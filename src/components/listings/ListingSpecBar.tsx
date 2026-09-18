import { ShieldCheck, Clock, Wrench, Calendar, Weight, Fuel } from 'lucide-react';

interface SpecBarProps {
  inspectionScore: number | null;
  hours: number | null;
  condition: string | null;
  year: string | null;
  netWeight: number | null;
  fuelType: string | null;
}

function scoreLabel(score: number) {
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Very Good';
  if (score >= 65) return 'Good';
  if (score >= 50) return 'Fair';
  return 'Needs Work';
}

function Item({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="flex items-center gap-3 px-5 py-4 flex-1 min-w-[150px]">
      <span style={{ color: 'var(--lst-accent)' }}>{icon}</span>
      <div>
        <div className="text-xs" style={{ color: 'var(--lst-text-muted)' }}>
          {label}
        </div>
        <div className="text-sm font-bold" style={{ color: 'var(--lst-text)' }}>
          {value}
        </div>
        {sub && (
          <div className="text-[11px]" style={{ color: 'var(--lst-success)' }}>
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}

export function ListingSpecBar({
  inspectionScore,
  hours,
  condition,
  year,
  netWeight,
  fuelType,
}: SpecBarProps) {
  const items = [
    inspectionScore !== null && {
      icon: <ShieldCheck size={20} />,
      label: 'Inspection Score',
      value: `${inspectionScore} /100`,
      sub: scoreLabel(inspectionScore),
    },
    hours !== null && {
      icon: <Clock size={20} />,
      label: 'Hours',
      value: `${hours.toLocaleString()} hrs`,
    },
    condition && { icon: <Wrench size={20} />, label: 'Condition', value: condition },
    year && { icon: <Calendar size={20} />, label: 'Year', value: year },
    netWeight !== null && {
      icon: <Weight size={20} />,
      label: 'Net Weight',
      value: `${netWeight.toLocaleString()} lbs`,
    },
    fuelType && { icon: <Fuel size={20} />, label: 'Fuel Type', value: fuelType },
  ].filter(Boolean) as Array<{ icon: React.ReactNode; label: string; value: string; sub?: string }>;

  if (items.length === 0) return null;

  return (
    <div
      className="flex flex-wrap rounded-xl border divide-x"
      style={{
        backgroundColor: 'var(--lst-surface)',
        borderColor: 'var(--lst-border)',
        // @ts-expect-error CSS custom property for divide color
        '--tw-divide-opacity': 1,
      }}
    >
      {items.map((item, i) => (
        <Item key={i} {...item} />
      ))}
    </div>
  );
}