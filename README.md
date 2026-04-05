# Fintrak — Finance Dashboard

A clean, interactive finance dashboard built with React + Vite. Dark/light theme, role-based UI, charts, filtering, and local storage persistence — no backend required.

---

## Setup

```bash
npm install
npm run dev       # dev server at http://localhost:5173
npm run build     # production build → dist/
npm run preview   # preview the production build
```

---

## Features

### 1. Dashboard Overview
- **Summary cards**: Total Balance, Income, Expenses, Savings Rate
- **Bar chart**: 7-month income vs. expense trend (Oct → Apr)
- **Donut chart**: Spending breakdown by category with percentage legend

### 2. Transactions
- Full transaction list with Date, Description, Category, Type, Amount
- **Search**: Filter by description or category name
- **Dropdowns**: Filter by category, type (income/expense), sort order (newest/oldest/highest/lowest)
- **Export CSV**: Download filtered transactions as a `.csv` file
- **Admin only**: Add, edit, delete transactions via modal

### 3. Role-Based UI
Switch roles via the sidebar toggle:
- **Viewer** — read-only; no add/edit/delete controls visible
- **Admin** — full CRUD; action buttons appear in transaction rows

Role is persisted in `localStorage` across sessions.

### 4. Insights
- Highest spending category with percentage of total
- Savings rate with qualitative badge (Excellent / Good / Needs Attention)
- Largest single transaction
- Income vs. Expenses ratio
- Category spending rank (horizontal bar chart)
- 3-month side-by-side comparison table (Feb → Apr)

### 5. State Management
Uses React `useReducer` + `useContext` (no external library). State includes:
- `transactions[]` — all transaction records
- `filters` — search, category, type, sortBy
- `role` — viewer | admin
- `darkMode` — boolean

Role and dark mode persist via `localStorage`; transactions are initialized from `mockData.js`.

### 6. Dark / Light Mode
Toggle from the sidebar. Implemented entirely via CSS custom properties — no extra library.

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 | UI framework |
| Vite 5 | Build tool / dev server |
| CSS custom properties | Theming (dark/light) |
| Syne + DM Mono | Typography (Google Fonts) |
| localStorage | Persistence layer |

No external chart library — charts are built with plain SVG + flexbox.

---

## Project Structure

```
src/
├── context/
│   └── AppContext.jsx    # Global state (useReducer + Context)
├── data/
│   └── mockData.js       # Mock transactions, categories, monthly data
├── components/
│   ├── Dashboard.jsx     # Overview page
│   ├── Transactions.jsx  # Transactions page + modal
│   └── Insights.jsx      # Insights page
├── App.jsx               # Layout, sidebar, routing
└── App.css               # All styles (tokens, components, responsive)
```

---

## Design Decisions

- **No router**: Single-file navigation via `useState` — keeps things simple for a dashboard
- **No chart library**: SVG is sufficient for bar/donut charts; avoids bundle bloat
- **Mock data in JS**: Easier to read and modify than JSON; keeps data co-located with helper functions
- **CSS-only charts**: Transitions use cubic-bezier easing for a polished feel without animation libraries
- **Responsive**: Grid collapses gracefully at 1100px, 768px, and 480px breakpoints
