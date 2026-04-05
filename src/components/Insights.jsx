import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORY_COLORS } from '../data/mockData';

const fmt = n =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })
    .format(Math.abs(n));

function InsightCard({ title, value, desc, color, icon, badge }) {
  return (
    <div className="rounded-xl border p-4 sm:p-5 flex gap-3 sm:gap-4 transition-transform duration-150 hover:-translate-y-0.5"
      style={{ background: 'var(--c-surface)', borderColor: 'var(--c-border)' }}>
      <span className="text-xl sm:text-2xl shrink-0" style={{ color }}>{icon}</span>
      <div className="flex flex-col gap-1 min-w-0">
        <span className="text-[10px] font-bold tracking-[1px] uppercase font-mono" style={{ color: 'var(--c-muted)' }}>{title}</span>
        {badge && (
          <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded w-fit tracking-wide"
            style={{ background: color + '22', color }}>{badge}</span>
        )}
        <span className="text-xl sm:text-2xl font-extrabold tracking-tight" style={{ color }}>{value}</span>
        <span className="text-[10px] sm:text-[11px] font-mono leading-relaxed" style={{ color: 'var(--c-muted)' }}>{desc}</span>
      </div>
    </div>
  );
}

function SpendingTimeline({ byCategory }) {
  const max = byCategory[0]?.value || 1;
  return (
    <div className="rounded-xl border p-4 sm:p-6" style={{ background: 'var(--c-surface)', borderColor: 'var(--c-border)' }}>
      <h3 className="text-[11px] font-bold tracking-[1.5px] uppercase font-mono mb-4 sm:mb-5" style={{ color: 'var(--c-muted)' }}>
        Category Spending Rank
      </h3>
      <div className="flex flex-col gap-3">
        {byCategory.slice(0, 7).map((d, i) => (
          <div key={d.category} className="grid grid-cols-[24px_1fr_1fr_80px] sm:grid-cols-[24px_1fr_1fr_90px] gap-2 sm:gap-2.5 items-center">
            <span className="text-[10px] font-bold font-mono" style={{ color: 'var(--c-faint)' }}>#{i + 1}</span>
            <span className="text-[11px] sm:text-xs truncate" style={{ color: 'var(--c-muted)' }}>{d.category}</span>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--c-border)' }}>
              <div className="h-full rounded-full spend-anim"
                style={{ width: `${(d.value / max) * 100}%`, background: CATEGORY_COLORS[d.category] || '#888' }} />
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold font-mono text-right" style={{ color: 'var(--c-text)' }}>
              {fmt(d.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MonthCompare() {
  const months = ['Feb 2026', 'Mar 2026', 'Apr 2026'];
  const values = [
    { income: 100000, expenses: 19439 },
    { income: 105400, expenses: 31599 },
    { income:  97000, expenses: 10281 },
  ];
  return (
    <div className="rounded-xl border p-4 sm:p-6" style={{ background: 'var(--c-surface)', borderColor: 'var(--c-border)' }}>
      <h3 className="text-[11px] font-bold tracking-[1.5px] uppercase font-mono mb-4 sm:mb-5" style={{ color: 'var(--c-muted)' }}>
        3-Month Comparison
      </h3>
      <div className="flex flex-col">
        <div className="grid grid-cols-4 gap-1 sm:gap-2 pb-3 text-[9px] sm:text-[10px] font-bold tracking-[1.5px] font-mono"
          style={{ color: 'var(--c-faint)' }}>
          <span>Month</span><span>Income</span><span>Expenses</span><span>Net</span>
        </div>
        {months.map((m, i) => {
          const net = values[i].income - values[i].expenses;
          return (
            <div key={m} className="grid grid-cols-4 gap-1 sm:gap-2 py-3 border-t text-[10px] sm:text-xs font-mono items-center"
              style={{ borderColor: 'var(--c-border)' }}>
              <span className="font-semibold" style={{ color: 'var(--c-text)' }}>{m}</span>
              <span style={{ color: 'var(--c-blue)' }}>{fmt(values[i].income)}</span>
              <span style={{ color: 'var(--c-red)' }}>{fmt(values[i].expenses)}</span>
              <span style={{ color: net > 0 ? 'var(--c-green)' : 'var(--c-red)' }}>
                {net > 0 ? '+' : '−'}{fmt(net)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Insights() {
  const { state } = useApp();

  const analysis = useMemo(() => {
    const expenses     = state.transactions.filter(t => t.type === 'expense');
    const income       = state.transactions.filter(t => t.type === 'income');
    const byCategory   = {};
    expenses.forEach(t => { byCategory[t.category] = (byCategory[t.category] || 0) + Math.abs(t.amount); });
    const sortedCats   = Object.entries(byCategory).map(([c, v]) => ({ category: c, value: v })).sort((a, b) => b.value - a.value);
    const totalExpenses = expenses.reduce((s, t) => s + Math.abs(t.amount), 0);
    const totalIncome   = income.reduce((s, t) => s + t.amount, 0);
    const savingsRate   = ((totalIncome - totalExpenses) / totalIncome * 100).toFixed(1);
    const biggestTx     = [...state.transactions].sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))[0];
    return { sortedCats, totalExpenses, totalIncome, savingsRate, biggestTx, topCat: sortedCats[0] };
  }, [state.transactions]);

  const { sortedCats, totalExpenses, totalIncome, savingsRate, biggestTx, topCat } = analysis;

  return (
    <div>
      {/* Header */}
      <div className="mb-5 sm:mb-7">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--c-text)' }}>Insights</h1>
        <p className="text-[12px] sm:text-[13px] font-mono mt-1" style={{ color: 'var(--c-muted)' }}>
          Patterns &amp; observations from your data
        </p>
      </div>

      {/* Insight cards*/}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5 mb-4 sm:mb-6">
        {topCat && (
          <InsightCard icon="▲" title="Highest Spending Category"
            value={fmt(topCat.value)} badge={topCat.category}
            desc={`${((topCat.value / totalExpenses) * 100).toFixed(1)}% of total spending`}
            color={CATEGORY_COLORS[topCat.category] || '#F97316'} />
        )}
        <InsightCard icon="◎" title="Savings Rate"
          value={`${savingsRate}%`}
          badge={savingsRate > 30 ? 'Excellent' : savingsRate > 15 ? 'Good' : 'Needs Attention'}
          desc={`You kept ₹${((totalIncome - totalExpenses) / 1000).toFixed(1)}k of ₹${(totalIncome / 1000).toFixed(0)}k earned`}
          color="var(--c-green)" />
        {biggestTx && (
          <InsightCard icon="◆" title="Largest Transaction"
            value={fmt(biggestTx.amount)} badge={biggestTx.type}
            desc={`${biggestTx.description} · ${new Date(biggestTx.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}`}
            color="var(--c-yellow)" />
        )}
        <InsightCard icon="↕" title="Income vs Expenses Ratio"
          value={`${(totalIncome / totalExpenses).toFixed(2)}x`}
          desc="For every rupee spent, you earn this much"
          color="var(--c-blue)" badge="All Time" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-3 sm:gap-3.5">
        <SpendingTimeline byCategory={sortedCats} />
        <MonthCompare />
      </div>
    </div>
  );
}
