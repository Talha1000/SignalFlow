# SignalFlow

**Know who wants to buy. Know what to do next.**

SignalFlow is a B2B lead intelligence and sales automation platform that helps sales teams focus on the leads most likely to convert. It collects leads from multiple sources, scores them using AI-powered heuristics, and provides actionable next steps.

## Features

- **AI Lead Scoring** — Explainable scoring engine with person, company, behavior, and recency factors
- **Pipeline Management** — Kanban board with drag-and-drop deal tracking
- **Sales Sequences** — Multi-step automated outreach workflows
- **AI Copilot** — Chat-based assistant for instant pipeline insights
- **Email Composer** — AI-personalized email generation with tone control
- **Automation Builder** — Visual node-based workflow builder
- **Analytics Dashboard** — Charts and metrics powered by Recharts
- **Team Management** — Role-based access control (Owner, Admin, Manager, Rep, Viewer)
- **Command Palette** — ⌘K quick search across leads, companies, and contacts
- **Dark/Light Mode** — Full theme support with system preference detection

## Tech Stack

- **Framework**: Next.js 15 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL 15+ + Prisma ORM
- **Auth**: JWT sessions with secure HTTP-only cookies
- **AI**: Pluggable provider (Gemini API with local heuristic fallback)
- **Charts**: Recharts

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 15+

### Setup

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database connection string

# Push schema to database
npx prisma db push

# Generate Prisma client
npx prisma generate

# Seed demo data
npx tsx prisma/seed.ts

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Demo Accounts

After seeding, you can log in with:

| Email | Role | Password |
|---|---|---|
| alex.morgan@signalflow.io | Owner | SignalFlow2026! |
| sarah.connor@signalflow.io | Admin | SignalFlow2026! |
| liam.vance@signalflow.io | Manager | SignalFlow2026! |
| maya.patel@signalflow.io | Member | SignalFlow2026! |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (public)/           # Landing, pricing, features, etc.
│   ├── (auth)/             # Login, signup
│   ├── app/                # Authenticated app pages
│   │   ├── dashboard/
│   │   ├── leads/
│   │   ├── companies/
│   │   ├── contacts/
│   │   ├── pipeline/
│   │   ├── sequences/
│   │   ├── inbox/
│   │   ├── automations/
│   │   ├── campaigns/
│   │   ├── analytics/
│   │   ├── ai-insights/
│   │   ├── integrations/
│   │   ├── team/
│   │   └── settings/
│   └── api/                # API routes
├── components/             # React components
│   ├── ui/                 # Primitives (Button, Card, Badge, etc.)
│   ├── layout/             # AppShell, Navbar, Footer
│   ├── command/            # Command palette
│   ├── copilot/            # AI Sales Copilot
│   ├── email/              # Email composer
│   └── ...
├── lib/                    # Core business logic
│   ├── ai/                 # AI provider (Gemini + heuristic fallback)
│   ├── auth/               # Session management, RBAC
│   ├── scoring/            # Lead scoring engine
│   ├── audit/              # Audit logging
│   └── billing/            # Usage tracking
└── prisma/
    ├── schema.prisma       # Database schema (25+ models)
    └── seed.ts             # Demo data seeder
```

## License

MIT

## Deploying to Vercel (Free Tier)

1. **Create a free PostgreSQL database** (Supabase, Neon, Railway, etc.) and obtain its connection string, e.g.:
   ```
   postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public
   ```
2. **Add the secret to Vercel**:
   - Go to **Vercel Dashboard → Settings → Environment Variables**.
   - Add a new secret named **`database_url`** with the connection string.
   - Vercel will expose it as `DATABASE_URL` for the app (as defined in `vercel.json`).
3. **Deploy**:
   - Link the GitHub repository to Vercel (if not already linked).
   - Click **Deploy** or push a new commit to trigger a build.
   - The app will start with the database connection automatically configured.

> **Note:** The local `.env` file is only for local development. Do **not** commit actual credentials.
