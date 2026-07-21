'use client';
import { useEffect, useState, useCallback } from 'react';
import { useLocale } from '@/lib/locale-context';
import { getBuses, saveBus, deleteBus, getAllUsers } from '@/lib/db';
import { I18nField, TextField } from '@/components/cms/CmsFields';
import { emptyI18n, type Bus, type BusRegion, type AppUser } from '@/lib/types';

const blank = (): Omit<Bus, 'id'> => ({
  name: emptyI18n(), plateNumber: '', driverId: '', driverName: '',
  regions: [{ name: '', departureTime: '', returnTime: '' }],
  visible: true, updatedAt: Date.now(),
});

export default function AdminBuses() {
  const { t, tx } = useLocale();
  const [list, setList] = useState<Bus[]>([]);
  const [drivers, setDrivers] = useState<AppUser[]>([]);
  const [editing, setEditing] = useState<(Omit<Bus, 'id'> & { id?: string }) | null>(null);
  const [busy, setBusy] = useState(false);

  const reload = useCallback(() => {
    getBuses().then(setList).catch(() => {});
    getAllUsers().then((u) => setDrivers(u.filter((x) => x.role === 'driver'))).catch(() => {});
  }, []);
  useEffect(() => { reload(); }, [reload]);

  const save = async () => {
    if (!editing || !editing.name.ar.trim()) return;
    // resolve driver name
    const driver = drivers.find((d) => d.uid === editing.driverId);
    setBusy(true);
    await saveBus({ ...editing, driverName: driver?.name ?? editing.driverName });
    setBusy(false);
    setEditing(null);
    reload();
  };

  const remove = async (id: string) => { if (confirm('تأكيد الحذف؟')) { await deleteBus(id); reload(); } };

  const updateRegion = (i: number, patch: Partial<BusRegion>) => {
    if (!editing) return;
    const regions = [...editing.regions];
    regions[i] = { ...regions[i], ...patch };
    setEditing({ ...editing, regions });
  };
  const addRegion = () => editing && setEditing({ ...editing, regions: [...editing.regions, { name: '', departureTime: '', returnTime: '' }] });
  const removeRegion = (i: number) => editing && setEditing({ ...editing, regions: editing.regions.filter((_, idx) => idx !== i) });

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-3 mb-5">
        <h2 className="text-xl font-bold text-gray-800">🚌 {t('manageBuses')}</h2>
        {!editing && (
          <button onClick={() => setEditing(blank())}
            className="px-4 py-2 rounded-md bg-burgundy text-white text-sm font-semibold hover:bg-burgundy-light">
            + {t('addBus')}
          </button>
        )}
      </div>

      {editing ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-5">
          <div className="grid md:grid-cols-2 gap-4">
            <I18nField label={t('busName')} value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} />
            <TextField label={t('plateNumber')} value={editing.plateNumber} onChange={(v) => setEditing({ ...editing, plateNumber: v })} />
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">{t('assignDriver')}</label>
              <select value={editing.driverId} onChange={(e) => setEditing({ ...editing, driverId: e.target.value })}
                className="w-full px-3 py-2 rounded-md border-2 border-gray-200 text-sm bg-white outline-none">
                <option value="">— اختر سائق —</option>
                {drivers.map((d) => <option key={d.uid} value={d.uid}>{d.name} ({d.email})</option>)}
              </select>
              {drivers.length === 0 && <p className="text-[10px] text-amber-600 mt-1">⚠️ لا يوجد سائقون. أنشئ حساب بدور &quot;سائق&quot; أولاً.</p>}
            </div>
          </div>

          {/* Regions */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-gray-700">🗺️ {t('byRegion')} — {t('busSchedule')}</label>
              <button onClick={addRegion} className="text-[11px] font-bold text-burgundy hover:underline">+ {t('addRegion')}</button>
            </div>
            <div className="space-y-2">
              {editing.regions.map((r, i) => (
                <div key={i} className="grid grid-cols-[1fr_auto_auto_auto] gap-2 items-center bg-gray-50 rounded-lg p-2">
                  <input value={r.name} onChange={(e) => updateRegion(i, { name: e.target.value })}
                    placeholder={t('region')} className="px-2 py-1.5 rounded border border-gray-200 text-xs outline-none" />
                  <input value={r.departureTime} onChange={(e) => updateRegion(i, { departureTime: e.target.value })}
                    placeholder="🚌 06:45" dir="ltr" className="w-24 px-2 py-1.5 rounded border border-gray-200 text-xs outline-none" />
                  <input value={r.returnTime} onChange={(e) => updateRegion(i, { returnTime: e.target.value })}
                    placeholder="🏠 14:30" dir="ltr" className="w-24 px-2 py-1.5 rounded border border-gray-200 text-xs outline-none" />
                  <button onClick={() => removeRegion(i)} className="text-red-500 text-sm px-1">✕</button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 mt-5">
            <button onClick={save} disabled={busy}
              className="px-5 py-2 rounded-md bg-burgundy text-white text-sm font-semibold hover:bg-burgundy-light disabled:opacity-60">💾 {t('save')}</button>
            <button onClick={() => setEditing(null)}
              className="px-5 py-2 rounded-md bg-gray-100 text-gray-600 text-sm font-semibold hover:bg-gray-200">{t('cancel')}</button>
          </div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {list.map((b) => (
            <div key={b.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-xl bg-orange-500/10 flex items-center justify-center text-xl">🚌</div>
                <div>
                  <div className="text-sm font-bold text-gray-800">{tx(b.name)}</div>
                  <div className="text-[11px] text-gray-400">{b.plateNumber} • {b.driverName || 'بدون سائق'}</div>
                </div>
              </div>
              <div className="space-y-1 mb-3">
                {b.regions.map((r, i) => (
                  <div key={i} className="flex items-center justify-between text-[11px] bg-gray-50 rounded px-2 py-1">
                    <span className="font-semibold text-gray-600">📍 {r.name}</span>
                    <span className="text-gray-400" dir="ltr">{r.departureTime} · {r.returnTime}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-1.5">
                <button onClick={() => setEditing(b)} className="flex-1 px-2 py-1.5 rounded-md bg-gray-100 text-gray-700 text-[11px] font-bold hover:bg-gray-200">✏️ {t('edit')}</button>
                <button onClick={() => remove(b.id)} className="px-2.5 py-1.5 rounded-md bg-red-500/10 text-red-600 text-[11px] font-bold hover:bg-red-500/20">🗑️</button>
              </div>
            </div>
          ))}
          {list.length === 0 && (
            <div className="col-span-full bg-white rounded-xl border border-gray-100 p-10 text-center text-sm text-gray-400">
              🚌 لا توجد باصات. أضف أول باص.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
