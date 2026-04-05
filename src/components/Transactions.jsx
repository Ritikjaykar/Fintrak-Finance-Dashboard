import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES, CATEGORY_COLORS } from '../data/mockData';

const fmt = n =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })
    .format(Math.abs(n));

const fieldStyle = { background: 'var(--c-surface)', borderColor: 'var(--c-border)', color: 'var(--c-text)' };

/* ── Modal ── */
function TransactionModal({ transaction, onSave, onClose }) {
  const [form, setForm] = useState(transaction || {
    date: new Date().toISOString().split('T')[0],
    description: '', category: CATEGORIES[0], amount: '', type: 'expense',
  });
  const set = patch => setForm(p => ({ ...p, ...patch }));

  const handleSubmit = () => {
    if (!form.description || !form.amount) return;
    const amt = parseFloat(form.amount);
    onSave({ ...form, id: transaction?.id || Date.now(), amount: form.type === 'expense' ? -Math.abs(amt) : Math.abs(amt) });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center anim-fade px-0 sm:px-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }} onClick={onClose}>
      <div className="w-full sm:w-[420px] sm:max-w-[95vw] rounded-t-2xl sm:rounded-2xl border anim-slide"
        style={{ background: 'var(--c-surface)', borderColor: 'var(--c-border2)' }} onClick={e => e.stopPropagation()}>
        {/* handle bar on mobile */}
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="w-10 h-1 rounded-full" style={{ background: 'var(--c-border2)' }} />
        </div>
        {/* header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 sm:py-5 border-b" style={{ borderColor: 'var(--c-border)' }}>
          <h3 className="text-base font-bold" style={{ color: 'var(--c-text)' }}>
            {transaction ? 'Edit Transaction' : 'New Transaction'}
          </h3>
          <button onClick={onClose} className="text-base cursor-pointer border-0 bg-transparent" style={{ color: 'var(--c-muted)' }}>✕</button>
        </div>
        {/* body */}
        <div className="px-5 sm:px-6 py-4 sm:py-5 flex flex-col gap-3 sm:gap-4">
          {[
            { label: 'Date',        key: 'date',        type: 'date' },
            { label: 'Description', key: 'description', type: 'text',   placeholder: 'e.g. Grocery shopping' },
            { label: 'Amount (₹)',  key: 'amount',      type: 'number', placeholder: '0.00' },
          ].map(({ label, key, type, placeholder }) => (
            <label key={key} className="flex flex-col gap-1.5 text-xs font-bold tracking-wide" style={{ color: 'var(--c-muted)' }}>
              {label}
              <input type={type} placeholder={placeholder} value={form[key]}
                onChange={e => set({ [key]: e.target.value })}
                className="rounded-lg px-3 py-2.5 text-[13px] border outline-none w-full" style={fieldStyle} />
            </label>
          ))}
          <label className="flex flex-col gap-1.5 text-xs font-bold tracking-wide" style={{ color: 'var(--c-muted)' }}>
            Type
            <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: 'var(--c-border)' }}>
              {['income', 'expense'].map(t => (
                <button key={t} onClick={() => set({ type: t })}
                  className="flex-1 py-2.5 text-[13px] font-semibold cursor-pointer border-0 transition-all"
                  style={form.type === t
                    ? { background: t === 'income' ? 'rgba(0,214,143,0.2)' : 'rgba(255,94,94,0.2)', color: t === 'income' ? 'var(--c-green)' : 'var(--c-red)' }
                    : { background: 'transparent', color: 'var(--c-muted)' }}>
                  {t[0].toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </label>
          <label className="flex flex-col gap-1.5 text-xs font-bold tracking-wide" style={{ color: 'var(--c-muted)' }}>
            Category
            <select value={form.category} onChange={e => set({ category: e.target.value })}
              className="rounded-lg px-3 py-2.5 text-[13px] border outline-none w-full" style={fieldStyle}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
        </div>
        {/* footer */}
        <div className="flex gap-2 justify-end px-5 sm:px-6 py-4 border-t pb-6 sm:pb-4" style={{ borderColor: 'var(--c-border)' }}>
          <button onClick={onClose}
            className="rounded-lg px-4 py-2.5 text-[13px] font-semibold border cursor-pointer"
            style={{ background: 'var(--c-surface2)', borderColor: 'var(--c-border)', color: 'var(--c-text)' }}>
            Cancel
          </button>
          <button onClick={handleSubmit}
            className="rounded-lg px-4 py-2.5 text-[13px] font-bold cursor-pointer border-0"
            style={{ background: 'var(--c-green)', color: '#000' }}>
            {transaction ? 'Save Changes' : 'Add Transaction'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Mobile card view for a single transaction ── */
function TxCard({ tx, isAdmin, onEdit, onDelete }) {
  return (
    <div className="rounded-xl border p-4 flex flex-col gap-2" style={{ background: 'var(--c-surface)', borderColor: 'var(--c-border)' }}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-[13px] font-semibold truncate" style={{ color: 'var(--c-text)' }}>{tx.description}</span>
          <span className="text-xs font-mono" style={{ color: 'var(--c-muted)' }}>
            {new Date(tx.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
          </span>
        </div>
        <span className="text-[14px] font-bold font-mono shrink-0"
          style={{ color: tx.type === 'income' ? 'var(--c-green)' : 'var(--c-red)' }}>
          {tx.type === 'income' ? '+' : '−'}{fmt(tx.amount)}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--c-muted)' }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: CATEGORY_COLORS[tx.category] || '#888' }} />
            {tx.category}
          </span>
          <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded uppercase"
            style={tx.type === 'income'
              ? { background: 'rgba(0,214,143,0.15)', color: 'var(--c-green)' }
              : { background: 'rgba(255,94,94,0.15)', color: 'var(--c-red)' }}>
            {tx.type}
          </span>
        </div>
        {isAdmin && (
          <div className="flex gap-1">
            <button onClick={() => onEdit(tx)}
              className="rounded-md px-2 py-1 text-xs border cursor-pointer"
              style={{ background: 'transparent', borderColor: 'var(--c-border)', color: 'var(--c-muted)' }}>✎</button>
            <button onClick={() => onDelete(tx.id)}
              className="rounded-md px-2 py-1 text-xs border cursor-pointer"
              style={{ background: 'transparent', borderColor: 'var(--c-border)', color: 'var(--c-muted)' }}>✕</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Page ── */
export default function Transactions() {
  const { state, dispatch } = useApp();
  const { filters, role }   = state;
  const [modalData, setModalData] = useState(null);
  const isAdmin = role === 'admin';

  const filtered = useMemo(() => {
    let txs = [...state.transactions];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      txs = txs.filter(t => t.description.toLowerCase().includes(q) || t.category.toLowerCase().includes(q));
    }
    if (filters.category !== 'all') txs = txs.filter(t => t.category === filters.category);
    if (filters.type     !== 'all') txs = txs.filter(t => t.type     === filters.type);
    const [by, dir] = filters.sortBy.split('-');
    txs.sort((a, b) => {
      const cmp = by === 'date' ? new Date(a.date) - new Date(b.date) : Math.abs(a.amount) - Math.abs(b.amount);
      return dir === 'desc' ? -cmp : cmp;
    });
    return txs;
  }, [state.transactions, filters]);

  const handleSave = tx => {
    dispatch({ type: state.transactions.some(t => t.id === tx.id) ? 'EDIT_TRANSACTION' : 'ADD_TRANSACTION', payload: tx });
    setModalData(null);
  };

  const exportCSV = () => {
    const rows = filtered.map(t => `${t.date},${t.description},${t.category},${t.type},${t.amount}`).join('\n');
    const blob = new Blob([`Date,Description,Category,Type,Amount\n${rows}`], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'transactions.csv'; a.click();
  };

  const gridCols = isAdmin
    ? 'grid-cols-[64px_1fr_140px_80px_110px_70px]'
    : 'grid-cols-[64px_1fr_140px_80px_110px]';

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-5 sm:mb-7 gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--c-text)' }}>Transactions</h1>
          <p className="text-[12px] sm:text-[13px] font-mono mt-1" style={{ color: 'var(--c-muted)' }}>{filtered.length} records found</p>
        </div>
        <div className="flex gap-2 flex-wrap justify-end">
          <button onClick={exportCSV}
            className="rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-xs font-semibold border cursor-pointer"
            style={{ background: 'transparent', borderColor: 'var(--c-border)', color: 'var(--c-muted)' }}>
            ↓ CSV
          </button>
          {isAdmin && (
            <button onClick={() => setModalData({})}
              className="rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-[13px] font-bold cursor-pointer border-0"
              style={{ background: 'var(--c-green)', color: '#000' }}>
              + Add
            </button>
          )}
        </div>
      </div>

      {/* Filters: 2-col grid on mobile, row on sm+ */}
      <div className="grid grid-cols-2 sm:flex gap-2 mb-5 sm:flex-wrap">
        <input
          className="col-span-2 rounded-lg px-3 py-2.5 text-[13px] border outline-none"
          placeholder="Search transactions…"
          value={filters.search}
          onChange={e => dispatch({ type: 'SET_FILTER', payload: { search: e.target.value } })}
          style={{ ...fieldStyle }} />
        {[
          { key: 'category', options: [['all', 'All Categories'], ...CATEGORIES.map(c => [c, c])] },
          { key: 'type',     options: [['all', 'All Types'], ['income', 'Income'], ['expense', 'Expense']] },
          { key: 'sortBy',   options: [['date-desc','Newest'],['date-asc','Oldest'],['amount-desc','Highest'],['amount-asc','Lowest']] },
        ].map(({ key, options }) => (
          <select key={key} value={filters[key]}
            onChange={e => dispatch({ type: 'SET_FILTER', payload: { [key]: e.target.value } })}
            className="rounded-lg px-2 sm:px-3 py-2.5 text-xs font-semibold border outline-none cursor-pointer"
            style={{ background: 'var(--c-surface)', borderColor: 'var(--c-border)', color: 'var(--c-muted)' }}>
            {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        ))}
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="text-center py-16" style={{ color: 'var(--c-muted)' }}>
          <div className="text-4xl mb-3" style={{ color: 'var(--c-faint)' }}>◎</div>
          <p className="mb-4">No transactions match your filters</p>
          <button onClick={() => dispatch({ type: 'SET_FILTER', payload: { search: '', category: 'all', type: 'all' } })}
            className="rounded-lg px-4 py-2 text-xs font-semibold border cursor-pointer"
            style={{ background: 'transparent', borderColor: 'var(--c-border)', color: 'var(--c-muted)' }}>
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          {/* Mobile: card list */}
          <div className="flex flex-col gap-3 sm:hidden">
            {filtered.map(tx => (
              <TxCard key={tx.id} tx={tx} isAdmin={isAdmin}
                onEdit={setModalData}
                onDelete={id => dispatch({ type: 'DELETE_TRANSACTION', payload: id })} />
            ))}
          </div>

          {/* Desktop: table */}
          <div className="hidden sm:block rounded-xl border overflow-hidden"
            style={{ background: 'var(--c-surface)', borderColor: 'var(--c-border)' }}>
            {/* table header */}
            <div className={`grid ${gridCols} gap-3 px-5 py-3 border-b text-[10px] font-bold tracking-[1.5px] font-mono`}
              style={{ borderColor: 'var(--c-border)', color: 'var(--c-faint)' }}>
              <span>DATE</span><span>DESCRIPTION</span><span>CATEGORY</span><span>TYPE</span><span>AMOUNT</span>
              {isAdmin && <span>ACTIONS</span>}
            </div>
            {/* rows */}
            {filtered.map(tx => (
              <div key={tx.id} className={`grid ${gridCols} gap-3 px-5 py-3 border-b items-center transition-colors`}
                style={{ borderColor: 'var(--c-border)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--c-surface2)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <span className="text-xs font-mono" style={{ color: 'var(--c-muted)' }}>
                  {new Date(tx.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                </span>
                <span className="text-[13px] font-semibold truncate" style={{ color: 'var(--c-text)' }}>{tx.description}</span>
                <span className="flex items-center gap-1.5 text-xs truncate" style={{ color: 'var(--c-muted)' }}>
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: CATEGORY_COLORS[tx.category] || '#888' }} />
                  {tx.category}
                </span>
                <span className="text-[10px] font-bold font-mono px-2 py-1 rounded w-fit uppercase"
                  style={tx.type === 'income'
                    ? { background: 'rgba(0,214,143,0.15)', color: 'var(--c-green)' }
                    : { background: 'rgba(255,94,94,0.15)', color: 'var(--c-red)' }}>
                  {tx.type}
                </span>
                <span className="text-[13px] font-bold font-mono text-right"
                  style={{ color: tx.type === 'income' ? 'var(--c-green)' : 'var(--c-red)' }}>
                  {tx.type === 'income' ? '+' : '−'}{fmt(tx.amount)}
                </span>
                {isAdmin && (
                  <span className="flex gap-1">
                    <button onClick={() => setModalData(tx)}
                      className="rounded-md px-2 py-1 text-xs border cursor-pointer"
                      style={{ background: 'transparent', borderColor: 'var(--c-border)', color: 'var(--c-muted)' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor='var(--c-blue)'; e.currentTarget.style.color='var(--c-blue)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor='var(--c-border)'; e.currentTarget.style.color='var(--c-muted)'; }}>✎</button>
                    <button onClick={() => dispatch({ type: 'DELETE_TRANSACTION', payload: tx.id })}
                      className="rounded-md px-2 py-1 text-xs border cursor-pointer"
                      style={{ background: 'transparent', borderColor: 'var(--c-border)', color: 'var(--c-muted)' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor='var(--c-red)'; e.currentTarget.style.color='var(--c-red)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor='var(--c-border)'; e.currentTarget.style.color='var(--c-muted)'; }}>✕</button>
                  </span>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {modalData !== null && (
        <TransactionModal
          transaction={Object.keys(modalData).length ? modalData : null}
          onSave={handleSave}
          onClose={() => setModalData(null)} />
      )}
    </div>
  );
}
