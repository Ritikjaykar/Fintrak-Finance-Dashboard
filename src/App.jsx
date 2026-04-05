import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Dashboard    from './components/Dashboard';
import Transactions from './components/Transactions';
import Insights     from './components/Insights';
import './App.css';

const NAV = [
  { id: 'dashboard',    label: 'Overview',     icon: '◈' },
  { id: 'transactions', label: 'Transactions', icon: '≡' },
  { id: 'insights',     label: 'Insights',     icon: '◎' },
];

function Sidebar({ page, setPage, open, setOpen }) {
  const { state, dispatch } = useApp();
  const { role, darkMode } = state;

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-40 h-full flex flex-col px-4 py-6 border-r
          w-[220px] transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:static lg:translate-x-0 lg:shrink-0 lg:h-screen lg:sticky lg:top-0
        `}
        style={{ background: 'var(--c-surface)', borderColor: 'var(--c-border)' }}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-2 pb-6 mb-5 border-b" style={{ borderColor: 'var(--c-border)' }}>
          <div className="flex items-center gap-2.5">
            <span className="text-xl" style={{ color: 'var(--c-green)' }}>◆</span>
            <span className="text-lg font-extrabold tracking-tight" style={{ color: 'var(--c-text)' }}>Fintrak</span>
          </div>
          {/* close on mobile */}
          <button
            className="lg:hidden text-lg cursor-pointer border-0 bg-transparent"
            style={{ color: 'var(--c-muted)' }}
            onClick={() => setOpen(false)}
          >✕</button>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 flex-1">
          {NAV.map(item => {
            const active = page === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setPage(item.id); setOpen(false); }}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold w-full text-left transition-all cursor-pointer border-0"
                style={active
                  ? { background: 'var(--c-green)', color: '#000' }
                  : { background: 'transparent', color: 'var(--c-muted)' }
                }
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'var(--c-surface2)'; e.currentTarget.style.color = 'var(--c-text)'; }}}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--c-muted)'; }}}
              >
                <span className="w-5 text-center text-base">{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="flex flex-col gap-3 pt-4 border-t" style={{ borderColor: 'var(--c-border)' }}>
          <div className="rounded-xl p-3 border" style={{ background: 'var(--c-surface2)', borderColor: 'var(--c-border)' }}>
            <p className="text-[10px] font-bold tracking-[1.5px] mb-2 font-mono" style={{ color: 'var(--c-faint)' }}>ROLE</p>
            <div className="flex rounded-md overflow-hidden border" style={{ borderColor: 'var(--c-border2)' }}>
              {['viewer', 'admin'].map(r => (
                <button
                  key={r}
                  onClick={() => dispatch({ type: 'SET_ROLE', payload: r })}
                  className="flex-1 py-1.5 text-xs font-bold transition-all cursor-pointer border-0"
                  style={role === r
                    ? { background: 'var(--c-green)', color: '#000' }
                    : { background: 'transparent', color: 'var(--c-muted)' }
                  }
                >
                  {r[0].toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>
            <p className="text-[11px] mt-2 font-mono" style={{ color: 'var(--c-muted)' }}>
              {role === 'admin' ? '✦ Can add, edit & delete' : '◎ Read-only view'}
            </p>
          </div>
          <button
            onClick={() => dispatch({ type: 'TOGGLE_DARK' })}
            className="rounded-lg px-3 py-2 text-xs font-semibold border transition-all cursor-pointer"
            style={{ background: 'transparent', borderColor: 'var(--c-border)', color: 'var(--c-muted)' }}
          >
            {darkMode ? '◐ Light Mode' : '● Dark Mode'}
          </button>
        </div>
      </aside>
    </>
  );
}

/* Mobile top bar */
function TopBar({ page, setOpen }) {
  const label = NAV.find(n => n.id === page)?.label || '';
  return (
    <header
      className="lg:hidden flex items-center justify-between px-4 py-3 border-b sticky top-0 z-20"
      style={{ background: 'var(--c-surface)', borderColor: 'var(--c-border)' }}
    >
      <div className="flex items-center gap-2">
        <span style={{ color: 'var(--c-green)' }}>◆</span>
        <span className="font-extrabold tracking-tight text-base" style={{ color: 'var(--c-text)' }}>Fintrak</span>
        <span className="text-xs font-mono ml-1" style={{ color: 'var(--c-muted)' }}>/ {label}</span>
      </div>
      <button
        onClick={() => setOpen(true)}
        className="text-xl cursor-pointer border-0 bg-transparent p-1"
        style={{ color: 'var(--c-text)' }}
      >☰</button>
    </header>
  );
}

function AppInner() {
  const [page, setPage]   = useState('dashboard');
  const [open, setOpen]   = useState(false);
  const { state } = useApp();

  return (
    <div
      className={`flex min-h-screen ${state.darkMode ? 'dark' : 'light'}`}
      style={{ background: 'var(--c-bg)', color: 'var(--c-text)' }}
    >
      <Sidebar page={page} setPage={setPage} open={open} setOpen={setOpen} />
      <div className="flex flex-col flex-1 min-w-0">
        <TopBar page={page} setOpen={setOpen} />
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          {page === 'dashboard'    && <Dashboard />}
          {page === 'transactions' && <Transactions />}
          {page === 'insights'     && <Insights />}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return <AppProvider><AppInner /></AppProvider>;
}
