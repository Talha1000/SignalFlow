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

## Running & Deploying Locally (Localhost)

1. **Configure Environment Variables**:
   Ensure `.env` contains your PostgreSQL connection string and secrets:
   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/signalflow?schema=public"
   JWT_SECRET="your-jwt-secret-key-at-least-32-chars"
   ```

2. **Database Push & Seed**:
   ```bash
   npx prisma db push
   npx tsx prisma/seed.ts
   ```

3. **Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Production Build & Local Server**:
   ```bash
   npm run build
   npm run start
   ```
   The optimized production server will be live on [http://localhost:3000](http://localhost:3000).

> **Note:** The `.env` file is for local development and deployment. Keep production credentials secure and never commit private keys.
