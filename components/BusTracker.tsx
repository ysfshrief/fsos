'use client';
import { useEffect, useState, useRef } from 'react';
import { useLocale } from '@/lib/locale-context';
import { getBusById, getBusLive } from '@/lib/db';
import BusMap from '@/components/BusMap';
import type { Bus, BusLive, BusStatus } from '@/lib/types';

const statusMeta: Record<BusStatus, { key: string; color: string; bg: string }> = {
  idle: { key: 'statusIdle', color: 'text-gray-500', bg: 'bg-gray-100' },
  moving: { key: 'statusMoving', color: 'text-blue-600', bg: 'bg-blue-500/10' },
  near: { key: 'statusNear', color: 'text-amber-600', bg: 'bg-amber-500/10' },
  arrived: { key: 'statusArrived', color: 'text-green-600', bg: 'bg-green-500/10' },
};

export default function BusTracker({ busId, region }: { busId: string; region?: string }) {
  const { t, tx } = useLocale();
  const [bus, setBus] = useState<Bus | null>(null);
  const [live, setLive] = useState<BusLive | null>(null);
  const prevStatus = useRef<BusStatus | null>(null);
  const [notif, setNotif] = useState<string | null>(null);

  useEffect(() => { getBusById(busId).then(setBus).catch(() => {}); }, [busId]);

  // Poll live location every 5s
  useEffect(() => {
    let active = true;
    const poll = () => getBusLive(busId).then((l) => { if (active && l) handleLive(l); }).catch(() => {});
    poll();
    const timer = setInterval(poll, 5000);
    return () => { active = false; clearInterval(timer); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busId]);

  const handleLive = (l: BusLive) => {
    setLive(l);
    // Fire a notification when status changes
    if (prevStatus.current && prevStatus.current !== l.status) {
      if (l.status === 'moving') setNotif(t('notifMoving'));
      else if (l.status === 'near') setNotif(t('notifNear'));
      else if (l.status === 'arrived') setNotif(t('notifArrived'));
      setTimeout(() => setNotif(null), 6000);
    }
    prevStatus.current = l.status;
  };

  if (!bus) return null;

  const meta = statusMeta[live?.status ?? 'idle'];
  const myRegion = bus.regions.find((r) => r.name === region);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-5 bg-gradient-to-l from-orange-500/10 to-transparent border-b border-gray-100">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-orange-500/15 flex items-center justify-center text-xl">🚌</div>
            <div>
              <div className="font-bold text-gray-800 text-sm">{tx(bus.name)}</div>
              <div className="text-[11px] text-gray-400">{bus.plateNumber} • {bus.driverName}</div>
            </div>
          </div>
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${meta.bg} ${meta.color}`}>
            {t(meta.key)}
          </span>
        </div>
      </div>

      {/* Notification toast */}
      {notif && (
        <div className="mx-5 mt-4 bg-burgundy text-white rounded-xl p-3 text-sm font-semibold flex items-center gap-2 animate-[popIn_.3s_ease]">
          🔔 {notif}
        </div>
      )}

      <div className="p-5 space-y-5">
        {/* Live map — only meaningful when sharing */}
        {live?.sharing && live.status !== 'arrived' ? (
          <div>
            <div className="text-xs font-bold text-gray-700 mb-2">📍 {t('currentLocation')}</div>
            <BusMap lat={live.lat} lng={live.lng} height={260} />
            {live.etaMinutes > 0 && (
              <div className="mt-3 flex items-center justify-center gap-2 bg-gold-pale text-gold-dark rounded-xl py-2.5 text-sm font-bold">
                ⏱️ {t('eta')}: {live.etaMinutes} {t('minutes')}
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-2xl bg-gray-50 border border-gray-100 h-[180px] flex flex-col items-center justify-center gap-2 text-gray-400">
            <span className="text-4xl">{live?.status === 'arrived' ? '✅' : '🚏'}</span>
            <span className="text-sm font-semibold">
              {live?.status === 'arrived' ? t('statusArrived') : t('statusIdle')}
            </span>
          </div>
        )}

        {/* Schedule for my region */}
        <div>
          <div className="text-xs font-bold text-gray-700 mb-2">🕐 {t('busSchedule')} {region ? `— ${region}` : ''}</div>
          {myRegion ? (
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-500/5 rounded-xl p-3 text-center">
                <div className="text-[10px] text-gray-500 mb-1">🚌 {t('departureTimes')}</div>
                <div className="text-lg font-bold text-blue-600" dir="ltr">{myRegion.departureTime}</div>
              </div>
              <div className="bg-green-500/5 rounded-xl p-3 text-center">
                <div className="text-[10px] text-gray-500 mb-1">🏠 {t('returnTimes')}</div>
                <div className="text-lg font-bold text-green-600" dir="ltr">{myRegion.returnTime}</div>
              </div>
            </div>
          ) : (
            // Show all regions if student's region not set
            <div className="space-y-2">
              {bus.regions.map((r) => (
                <div key={r.name} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 text-xs">
                  <span className="font-semibold text-gray-700">📍 {r.name}</span>
                  <span className="text-gray-500" dir="ltr">🚌 {r.departureTime} · 🏠 {r.returnTime}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes popIn { from { opacity:0; transform: translateY(-6px) } to { opacity:1; transform: translateY(0) } }
      `}</style>
    </div>
  );
}
