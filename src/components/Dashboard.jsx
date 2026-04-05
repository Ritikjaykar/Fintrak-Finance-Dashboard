import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORY_COLORS, getMonthlyData } from '../data/mockData';

const fmt = n =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })
    .format(Math.abs(n));

function SummaryCard({ label, value, sub, accent, icon }) {
  return (
    <div
      className="relative rounded-xl p-4 sm:p-5 flex items-start gap-3 sm:gap-4 border overflow-hidden transition-transform duration-150 hover:-translate-y-0.5"
      style={{ background: 'var(--c-surface)', borderColor: 'var(--c-border)' }}
    >
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: `linear-gradient(135deg,${accent} 0%,transparent 60%)`, opacity: 0.05 }} />
      <span className="text-xl sm:text-2xl mt-0.5 shrink-0" style={{ color: accent }}>{icon}</span>
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-[10px] font-bold tracking-[1.2px] uppercase font-mono" style={{ color: 'var(--c-muted)' }}>
          {label}
        </span>
        <span className="text-lg sm:text-2xl font-extrabold tracking-tight leading-tight" style={{ color: accent }}>
          {value}
        </span>
        {sub && <span className="text-[10px] sm:text-[11px] font-mono mt-1 truncate" style={{ color: 'var(--c-muted)' }}>{sub}</span>}
      </div>
    </div>
  );
}

function BarChart({ data }) {
  const max = Math.max(...data.map(d => Math.max(d.income, d.expenses)));
  return (
    <div className="rounded-xl border p-4 sm:p-6" style={{ background: 'var(--c-surface)', borderColor: 'var(--c-border)' }}>
      <h3 className="text-[11px] font-bold tracking-[1.5px] uppercase font-mono mb-4 sm:mb-5" style={{ color: 'var(--c-muted)' }}>
        Monthly Cash Flow
      </h3>
      <div className="flex items-end gap-1.5 sm:gap-3 h-32 sm:h-40">
        {data.map((d, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5 flex-1 h-full">
            <div className="flex gap-0.5 items-end w-full h-full">
              <div className="flex-1 rounded-t bar-anim min-h-[4px] cursor-default"
                style={{ height: `${(d.income / max) * 100}%`, background: 'var(--c-blue)' }}
                title={`Income: ${fmt(d.income)}`} />
              <div className="flex-1 rounded-t bar-anim min-h-[4px] opacity-80 cursor-default"
                style={{ height: `${(d.expenses / max) * 100}%`, background: 'var(--c-red)' }}
                title={`Expenses: ${fmt(d.expenses)}`} />
            </div>
            <span className="text-[9px] sm:text-[10px] font-mono" style={{ color: 'var(--c-muted)' }}>{d.month}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-4 mt-3">
        {[['var(--c-blue)', 'Income'], ['var(--c-red)', 'Expenses']].map(([col, lbl]) => (
          <span key={lbl} className="flex items-center gap-1.5 text-[11px] font-mono" style={{ color: 'var(--c-muted)' }}>
            <span className="w-2 h-2 rounded-sm inline-block" style={{ background: col }} />{lbl}
          </span>
        ))}
      </div>
    </div>
  );
}

function DonutChart({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  let cumulative = 0;
  const r = 60, cx = 80, cy = 80, strokeW = 22, circ = 2 * Math.PI * r;
  return (
    <div className="rounded-xl border p-4 sm:p-6" style={{ background: 'var(--c-surface)', borderColor: 'var(--c-border)' }}>
      <h3 className="text-[11px] font-bold tracking-[1.5px] uppercase font-mono mb-4 sm:mb-5" style={{ color: 'var(--c-muted)' }}>
        Spending Breakdown
      </h3>
      <div className="flex items-center gap-4 sm:gap-5">
        <svg width="140" height="140" viewBox="0 0 160 160" className="shrink-0 w-28 h-28 sm:w-36 sm:h-36">
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--c-border)" strokeWidth={strokeW} />
          {data.map((d, i) => {
            const pct = d.value / total;
            const dashArray = `${pct * circ} ${circ}`;
            const offset = -(cumulative * circ);
            cumulative += pct;
            return (
              <circle key={i} cx={cx} cy={cy} r={r} fill="none"
                stroke={CATEGORY_COLORS[d.category] || '#888'}
                strokeWidth={strokeW} strokeDasharray={dashArray} strokeDashoffset={offset}
                style={{ transformOrigin: `${cx}px ${cy}px`, transform: 'rotate(-90deg)', transition: 'all 0.5s' }} />
            );
          })}
          <text x={cx} y={cy - 6} textAnchor="middle" fill="var(--c-text)" fontSize="11" fontFamily="'DM Mono',monospace" fontWeight="600">TOTAL</text>
          <text x={cx} y={cy + 10} textAnchor="middle" fill="var(--c-green)" fontSize="10" fontFamily="'DM Mono',monospace">₹{(total / 1000).toFixed(1)}k</text>
        </svg>
        <div className="flex flex-col gap-1.5 sm:gap-2 flex-1 min-w-0">
          {data.slice(0, 6).map((d, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: CATEGORY_COLORS[d.category] || '#888' }} />
              <span className="flex-1 text-[10px] sm:text-[11px] font-mono truncate" style={{ color: 'var(--c-muted)' }}>
                {d.category.split(' ')[0]}
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold font-mono" style={{ color: 'var(--c-text)' }}>
                {((d.value / total) * 100).toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { state } = useApp();

  const stats = useMemo(() => {
    const income   = state.transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expenses = state.transactions.filter(t => t.type === 'expense').reduce((s, t) => s + Math.abs(t.amount), 0);
    return { income, expenses, balance: income - expenses };
  }, [state.transactions]);

  const spendingByCategory = useMemo(() => {
    const map = {};
    state.transactions.filter(t => t.type === 'expense')
      .forEach(t => { map[t.category] = (map[t.category] || 0) + Math.abs(t.amount); });
    return Object.entries(map).map(([category, value]) => ({ category, value })).sort((a, b) => b.value - a.value);
  }, [state.transactions]);

  const monthlyData  = useMemo(() => getMonthlyData(state.transactions), [state.transactions]);
  const savingsRate  = ((stats.balance / stats.income) * 100).toFixed(1);
  const incomeCount  = state.transactions.filter(t => t.type === 'income').length;
  const expenseCount = state.transactions.filter(t => t.type === 'expense').length;

  return (
    <div>
      {/* Header */}
      <div className="mb-5 sm:mb-7">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--c-text)' }}>Overview</h1>
        <p className="text-[12px] sm:text-[13px] font-mono mt-1" style={{ color: 'var(--c-muted)' }}>April 2026 · Financial Summary</p>
      </div>

      {/* Summary cards*/}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5 mb-4 sm:mb-6">
        <SummaryCard label="Total Balance"  value={fmt(stats.balance)}  accent="var(--c-green)"  icon="◈" sub="↑ 12.4% from last month" />
        <SummaryCard label="Total Income"   value={fmt(stats.income)}   accent="var(--c-blue)"   icon="↑" sub={`${incomeCount} transactions`} />
        <SummaryCard label="Total Expenses" value={fmt(stats.expenses)} accent="var(--c-red)"    icon="↓" sub={`${expenseCount} transactions`} />
        <SummaryCard label="Savings Rate"   value={`${savingsRate}%`}   accent="var(--c-yellow)" icon="◎" sub="of total income saved" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-3 sm:gap-3.5">
        <BarChart   data={monthlyData} />
        <DonutChart data={spendingByCategory} />
      </div>
    </div>
  );
}
