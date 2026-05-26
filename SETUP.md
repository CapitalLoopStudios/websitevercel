# SimProfit Waitlist – Setup Guide

## 1. Supabase Setup (5 min)

Geh in dein Supabase Projekt und führe dieses SQL aus (SQL Editor):

```sql
create table waitlist (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  signed_up_at timestamptz not null default now()
);

-- Nur API darf inserieren, kein Update/Delete von außen
alter table waitlist enable row level security;

create policy "Allow insert" on waitlist
  for insert with check (true);
```

Dann: Settings → API → kopiere:
- Project URL  → NEXT_PUBLIC_SUPABASE_URL
- anon public key → NEXT_PUBLIC_SUPABASE_ANON_KEY


## 2. Lokal starten

```bash
# .env.local erstellen
cp .env.local.example .env.local
# Werte eintragen (URL + Key von Supabase)

npm install
npm run dev
# → http://localhost:3000
```


## 3. Auf Vercel deployen

Option A – GitHub (empfohlen):
1. Repo auf GitHub pushen
2. vercel.com → New Project → GitHub Repo auswählen
3. Environment Variables eintragen (URL + Key)
4. Deploy klicken

Option B – Vercel CLI:
```bash
npm i -g vercel
vercel
# Dann in Vercel Dashboard → Settings → Environment Variables eintragen
```


## 4. Emails ansehen

Supabase Dashboard → Table Editor → waitlist
Alle Signups sind dort als Liste sichtbar.
Export als CSV möglich über das Download-Icon.


## Struktur

```
simprofit-waitlist/
├── lib/
│   └── supabase.js        # Supabase client
├── pages/
│   ├── api/
│   │   └── signup.js      # POST /api/signup
│   └── index.js           # Landing Page
├── .env.local.example
├── next.config.js
└── package.json
```
