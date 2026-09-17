'use client';

interface ChartPoint {
  label: string;
  value: number;
}

export function ListingsChart({ data }: { data: ChartPoint[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const width = 600;
  const height = 220;
  const padding = 24;
  const step = (width - padding * 2) / Math.max(data.length - 1, 1);

  const points = data.map((d, i) => {
    const x = padding + i * step;
    const y = height - padding - (d.value / max) * (height - padding * 2);
    return { x, y, ...d };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return (
    <div className="rounded-lg border p-5" style={{ backgroundColor: 'var(--admin-surface)', borderColor: 'var(--admin-border)' }}>
      <h2 className="text-sm font-semibold mb-4" style={{ color: 'var(--admin-text)' }}>
        Listings submitted — last 6 months
      </h2>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-56">
        <defs>
          <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--admin-accent)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--admin-accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#chartFill)" />
        <path d={linePath} fill="none" stroke="var(--admin-accent)" strokeWidth={2} />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={3} fill="var(--admin-accent)" />
        ))}
        {points.map((p, i) => (
          <text key={i} x={p.x} y={height - 4} fontSize={11} textAnchor="middle" fill="var(--admin-text-muted)">
            {p.label}
          </text>
        ))}
      </svg>
    </div>
  );
}
