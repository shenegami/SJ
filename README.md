# AI Company Assistant

A production-ready Next.js 14 platform for managing projects, tasks, knowledge, salary scales, and an AI copilot backed by Supabase and OpenAI.

## Features

- 🔐 Email/password authentication with Supabase Auth and role-based access (Admin, HR, Manager, Employee)
- 📊 Real-time dashboard with KPIs, policy updates, and role-aware insights
- 📁 Projects & tasks management with optimistic UI flows and secure attachments
- 📚 Policy and salary scale ingestion pipeline with automatic parsing, storage, and pgvector-ready document chunking
- 🤖 AI assistant with switchable providers (OpenAI by default) delivering bilingual answers with citations
- 🌐 Arabic/English localisation, RTL/LTR switching, and persisted language preference
- 💼 Admin panel for provisioning users, audit-ready logging, and organisational settings scaffolding
- 🛡️ Comprehensive Postgres schema with RLS policies, Supabase migrations, and seed scripts
- 🚀 Deployment-ready configuration for Vercel and Supabase

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase CLI (`npm install -g supabase`)
- Supabase project for database and storage

### Installation

```bash
npm install
```

Copy `.env.example` to `.env.local` and populate the values.

### Database setup

```bash
supabase login
supabase link --project-ref <your-project-ref>
npm run db:migrate
npm run seed
```

The seed script provisions the base roles and bootstrap Admin/HR users using the credentials supplied in `.env.local` (`ADMIN_EMAIL`, `ADMIN_PASSWORD`, `HR_EMAIL`, `HR_PASSWORD`).

### Development server

```bash
npm run dev
```

Visit `http://localhost:3000` to access the application.

### Testing security policies

Unit tests for RLS helpers are provided via SQL policies. Use Supabase Studio or `supabase db remote commit` to validate policies within your project.

### Deploying

1. Deploy the Next.js app to Vercel (`vercel deploy`).
2. Set the environment variables from `.env.example` in Vercel.
3. Provision the Supabase database using the migrations in `sql/migrations`.
4. Configure storage bucket named `company-assistant` in Supabase Storage.
5. Configure the Vercel project to expose `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` plus the service key via encrypted environment variables.

### AI provider switching

The AI layer is abstracted via `lib/ai/provider.ts`. Set `AI_PROVIDER` in the environment to choose a backend. To add providers, extend `AIProvider` and update the factory.

### Scripts

- `npm run seed` – populate base data and bootstrap Admin/HR accounts
- `npm run create-hr` – helper script to add additional HR accounts

## Project structure

```
app/               # Next.js App Router routes & API handlers
components/        # UI and feature components (shadcn-based)
lib/               # Domain logic, Supabase clients, AI providers, ingestion
sql/migrations/    # Supabase SQL migrations and RLS policies
types/             # Shared TypeScript definitions
i18n/              # Localisation resources
scripts/           # Seed and bootstrap scripts
```

## Notes

- File uploads are routed through Supabase Storage via service role key with strict MIME and size guardrails.
- AI answers must reference the retrieved sources; the UI exposes a sources drawer placeholder to extend.
- All database access passes through Supabase clients respecting RLS policies; avoid using the service role key outside ingestion/admin flows.

Enjoy building with the AI Company Assistant! 🚀
