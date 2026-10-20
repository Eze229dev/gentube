# RelancePro

Micro-SaaS mobile-first pour aider les vendeurs WhatsApp à ne pas oublier leurs prospects.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Supabase Auth + PostgreSQL
- PWA

## Installation

```bash
npm install
cp .env.example .env.local
```

Renseignez `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` dans `.env.local`.

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

```bash
npm run typecheck
npm run lint
```
