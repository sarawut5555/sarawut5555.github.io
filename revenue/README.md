# FlowFinance — Personal Expense Tracker

A modern, single-user personal finance dashboard built with **SvelteKit**, **TypeScript**, **Tailwind CSS**, **Supabase**, and **ApexCharts**. Deploy-ready for **Vercel**.

![Stack](https://img.shields.io/badge/SvelteKit-2-FF3E00?style=flat&logo=svelte&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20DB-3ECF8E?style=flat&logo=supabase&logoColor=white)

## Features

- Email/password authentication with persistent SSR sessions
- Dashboard with income, expenses, balance, charts, and recent activity
- Full CRUD for transactions with categories, notes, and datetime
- Search, filter, sort, and paginate transactions
- Analytics: trends, income vs expense, category breakdown
- CSV export, dark mode, glassmorphism UI, toasts, modals
- Row Level Security — users only see their own data

## Quick start

### 1. Supabase project

1. Create a project at [supabase.com](https://supabase.com).
2. In **SQL Editor**, run the migration:

   `supabase/migrations/001_transactions.sql`

3. Enable **Email** provider under **Authentication → Providers**.
4. Copy **Project URL** and **anon public key** from **Settings → API**.

### 2. Local setup

```bash
cd revenue
cp .env.example .env
# Edit .env with your Supabase URL and anon key

npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173), sign up, then start tracking.

### Environment variables

| Variable | Description |
|----------|-------------|
| `PUBLIC_SUPABASE_URL` | Supabase project URL |
| `PUBLIC_SUPABASE_ANON_KEY` | Supabase anon (publishable) key |
| `PUBLIC_CURRENCY` | Optional ISO currency code (default `THB`) |

## Project structure

```
src/
├── routes/
│   ├── login/          # Auth
│   ├── signup/
│   └── (app)/          # Protected app shell
│       ├── dashboard/
│       ├── transactions/
│       └── analytics/
├── lib/
│   ├── components/     # UI, layout, charts, forms
│   ├── services/       # Supabase data layer
│   ├── stores/         # Theme, toasts
│   └── utils/          # Currency, dates, CSV, validation
├── hooks.server.ts     # Session + route protection
supabase/migrations/    # Schema + RLS
```

## Database

**Table:** `transactions`

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid | Primary key |
| `user_id` | uuid | References `auth.users` |
| `type` | text | `income` or `expense` |
| `amount` | numeric | Must be > 0 |
| `category` | text | See default categories |
| `note` | text | Optional |
| `created_at` | timestamptz | Transaction date/time |

RLS policies restrict all operations to `auth.uid() = user_id`.

## Deploy to Vercel

1. Push this folder to GitHub.
2. Import the repo in [Vercel](https://vercel.com).
3. Set environment variables (`PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`, optional `PUBLIC_CURRENCY`).
4. Deploy — `@sveltejs/adapter-vercel` is preconfigured.

Add your Vercel deployment URL to **Supabase → Authentication → URL Configuration** (Site URL + Redirect URLs).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run check` | TypeScript + Svelte check |

## Default categories

Food, Transport, Shopping, Bills, Salary, Investment, Entertainment, Other

## License

MIT — personal use.
