'use client';
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useLocale } from '@/lib/locale-context';
import { getBusForDriver, getBusLive, updateBusLive, setBusStatus } from '@/lib/db';
import BusMap from '@/components/BusMap';
import type { Bus, BusStatus } from '@/lib/types';

const statusOptions: { v: BusStatus; key: string; color: string }[] = [
  { v: 'moving', key: 'statusMoving', color: 'bg-blue-600' },
  { v: 'near', key: 'statusNear', color: 'bg-amber-500' },
  { v: 'arrived', key: 'statusArrived', color: 'bg-green-600' },
  { v: 'idle', key: 'statusIdle', color: 'bg-gray-400' },
];

export default function DriverPage() {
  const { user } = useAuth();
  const { t } = useLocale();
  const [bus, setBus] = useState<Bus | null>(null);
  const [sharing, setSharing] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [status, setStatus] = useState<BusStatus>('idle');
  const [error, setError] = useState('');
  const watchId = useRef<number | null>(null);

  useEffect(() => {
    if (!user) return;
    getBusForDriver(user.uid).then((b) => {
      setBus(b);
      if (b) getBusLive(b.id).then((l) => { if (l) { setStatus(l.status); setSharing(l.sharing); } });
    });
  }, [user]);

  // Cleanup watcher on unmount
  useEffect(() => () => {
    if (watchId.current !== null) navigator.geolocation.clearWatch(watchId.current);
  }, []);

  const startSharing = () => {
    setError('');
    if (!bus) return;
    if (!('geolocation' in navigator)) { setError(t('enableGps')); return; }

    watchId.current = navigator.geolocation.watchPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCoords({ lat, lng });
        await updateBusLive(bus.id, { lat, lng, sharing: true, status: status === 'idle' ? 'moving' : status });
      },
      () => setError(t('locationPermission')),
      { enableHighAccuracy: true, maximumAge: 2000, timeout: 10000 }
    );
    setSharing(true);
    if (status === 'idle') { setStatus('moving'); setBusStatus(bus.id, 'moving'); }
  };

  const stopSharing = async () => {
    if (watchId.current !== null) { navigator.geolocation.clearWatch(watchId.current); watchId.current = null; }
    setSharing(false);
    if (bus) await updateBusLive(bus.id, { sharing: false });
  };

  const changeStatus = async (s: BusStatus) => {
    setStatus(s);
    if (bus) await setBusStatus(bus.id, s);
  };

  if (!bus) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-10 text-center text-sm text-gray-400">
        🚌 لا يوجد باص مخصص لك بعد. يتم تخصيصه من لوحة الإدارة.
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-2xl">🚌</div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">{t('myBus')}</h2>
          <div className="text-xs text-gray-500">{bus.name.ar} • {bus.plateNumber}</div>
        </div>
      </div>

      {error && <div className="mb-4 bg-red-500/5 border border-red-500/20 text-red-700 rounded-lg p-3 text-xs">{error}</div>}

      {/* Share toggle */}
      <div className={`rounded-2xl p-6 mb-5 text-center transition ${sharing ? 'bg-green-500/10 border-2 border-green-500/30' : 'bg-white border border-gray-100'}`}>
        <div className={`inline-flex items-center gap-2 text-sm font-bold mb-4 ${sharing ? 'text-green-600' : 'text-gray-400'}`}>
          <span className={`w-2.5 h-2.5 rounded-full ${sharing ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
          {sharing ? t('sharing') : t('notSharing')}
        </div>
        <div>
          {!sharing ? (
            <button onClick={startSharing}
              className="px-8 py-4 rounded-2xl bg-orange-600 text-white font-bold text-lg hover:bg-orange-700 transition shadow-lg">
              📍 {t('shareLocation')}
            </button>
          ) : (
            <button onClick={stopSharing}
              className="px-8 py-4 rounded-2xl bg-red-600 text-white font-bold text-lg hover:bg-red-700 transition shadow-lg">
              ⏹️ {t('stopSharing')}
            </button>
          )}
        </div>
        {coords && (
          <div className="text-[11px] text-gray-400 mt-3" dir="ltr">
            📌 {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
          </div>
        )}
      </div>

      {/* Status buttons */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-5">
        <div className="text-sm font-bold text-gray-700 mb-3">{t('updateStatus')}</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {statusOptions.map((s) => (
            <button key={s.v} onClick={() => changeStatus(s.v)}
              className={`px-3 py-3 rounded-xl text-white text-xs font-bold transition ${s.color} ${status === s.v ? 'ring-2 ring-offset-2 ring-gray-400' : 'opacity-70 hover:opacity-100'}`}>
              {t(s.key)}
            </button>
          ))}
        </div>
      </div>

      {/* Live map preview */}
      {coords && <BusMap lat={coords.lat} lng={coords.lng} height={280} />}

      <p className="text-[11px] text-gray-400 text-center mt-4 leading-relaxed">
        💡 اترك هذه الصفحة مفتوحة أثناء القيادة ليستمر إرسال موقعك لأولياء الأمور.
      </p>
    </div>
  );
}
