import { BarChart, Bar, LabelList, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Line, Area } from 'recharts';
import SavingsChartTooltip from './SavingsChartTooltip';

const SavingsChartGraphs = ({ data, viewBy }) => {
  const tooltip = <SavingsChartTooltip viewBy={viewBy} />;

  if (viewBy === 'All-Time') {
    return (
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} margin={{ top: 24, right: 16, left: 16, bottom: 10 }}>
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2BEBC8" stopOpacity={1} />
              <stop offset="100%" stopColor="#2BEBC8" stopOpacity={0.4} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis dataKey="name" stroke="#444" tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} padding={{ left: 10, right: 10 }} />
          <YAxis hide />
          <Tooltip content={tooltip} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
          <Bar dataKey="balance" fill="url(#barGradient)" radius={[6, 6, 0, 0]}>
            <LabelList dataKey="balance" position="top" formatter={(v) => v >= 1000 ? `$${(v / 1000).toFixed(1)}k` : `$${v}`} style={{ fill: '#2BEBC8', fontSize: 10, fontWeight: 600 }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <ComposedChart data={data} margin={{ top: 10, right: 16, left: 16, bottom: 10 }}>
        <defs>
          <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2BEBC8" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#2BEBC8" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis dataKey="name" stroke="#444" tick={{ fill: '#555', fontSize: 11 }} axisLine={false} tickLine={false} padding={{ left: 10, right: 10 }} />
        <YAxis hide />
        <Tooltip content={tooltip} cursor={{ stroke: 'rgba(255,255,255,0.08)', strokeWidth: 1 }} />
        <Area
          type="monotone"
          dataKey="balance"
          stroke="#2BEBC8"
          strokeWidth={2}
          fill="url(#savingsGradient)"
          dot={false}
          activeDot={{ r: 4, fill: '#2BEBC8', strokeWidth: 0 }}
        />
        <Line
          type="monotone"
          dataKey="previousBalance"
          stroke="#555"
          strokeWidth={1.5}
          strokeDasharray="5 4"
          dot={false}
          activeDot={{ r: 3, fill: '#555', strokeWidth: 0 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default SavingsChartGraphs;
