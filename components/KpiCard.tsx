interface Props {
  label: string;
  value: string;
  change?: string;
  changeType?: 'pos' | 'neu' | 'wrn';
  icon: string;
  barWidth?: number;
}

export default function KpiCard({ label, value, change, changeType = 'neu', icon, barWidth = 75 }: Props) {
  const changeColor = { pos: 'text-green-600', neu: 'text-gray-400', wrn: 'text-amber-600' }[changeType];
  return (
    <div className="relative bg-white rounded-xl p-5 border border-gray-100 shadow-sm overflow-hidden">
      <span className="absolute end-4 top-3.5 text-3xl opacity-10">{icon}</span>
      <div className="text-[11px] font-bold text-gray-400 tracking-wide mb-1.5">{label}</div>
      <div className="font-display text-3xl font-bold text-gray-800 leading-none mb-1">{value}</div>
      {change && <div className={`text-[11px] font-medium ${changeColor}`}>{change}</div>}
      <div className="h-[3px] bg-gray-100 rounded mt-2.5">
        <div className="h-full rounded bg-gradient-to-r from-burgundy to-gold" style={{ width: `${barWidth}%` }} />
      </div>
    </div>
  );
}
