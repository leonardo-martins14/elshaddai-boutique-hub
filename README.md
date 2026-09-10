# El Shaddai Fragrances

A luxury Oriental perfumery e-commerce web application with Swiss payment integration (TWINT, IBAN, and Cards), built with modern full-stack TypeScript.

For development logs, architecture deep dives, and security roadmap, see [JOURNAL.md](JOURNAL.md).

---

## Features

- **Fragrance Catalogue & Quiz**: Dynamic product filtering by brand (Lattafa, Afnan, etc.), olfactory notes, and an interactive scent finder quiz.
- **Swiss Payments**: Dynamic TWINT QR code generation with copyable payment details, bank transfer (IBAN) instructions, and credit card support.
- **Shopping Cart & Checkout**: Tiered discount progress tracker, Swiss free shipping threshold (80 CHF), coupon code validation, and printable order confirmation.
- **Persistent Data Layer**: Type-safe local SQLite database managed with Drizzle ORM.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite 7, Tailwind CSS v4, Radix UI primitives, Lucide React, Sonner
- **Routing & SSR**: TanStack Router, TanStack Start, Nitro server runtime
- **State Management**: Zustand (with local storage persistence for cart state)
- **Forms & Validation**: React Hook Form, Zod
- **Database & ORM**: SQLite (`@libsql/client`), Drizzle ORM, Drizzle Kit

---

## Getting Started

### Prerequisites

- Node.js 18 or higher (Node 20+ recommended)
- npm or bun

### Setup & Database Initialization

```bash
# 1. Install dependencies
npm install

# 2. Synchronize database schema (SQLite)
npm run db:push

# 3. Seed development data (catalog, test users, coupons)
npm run db:seed

# 4. Verify database state
npm run db:verify

# 5. Start the development server
npm run dev
```

The application runs locally at `http://localhost:5173`.

---

## Database Commands

| Command | Description |
| :--- | :--- |
| `npm run db:push` | Applies schema changes directly to the SQLite database (`local.db`). |
| `npm run db:seed` | Inserts development catalog products, sample accounts, and test coupons. |
| `npm run db:verify` | Inspects database tables and reports row counts in terminal. |
| `npm run db:studio` | Launches Drizzle Studio in browser for visual database exploration. |

---

## Project Documentation & Security

See [`JOURNAL.md`](JOURNAL.md) for:
- Server entrypoint (`src/server.ts`) and Server Functions (`createServerFn`) architecture.
- Full database schema specification.
- Engineering journal and AI-assisted development methodology.
- Production-first roadmap and upcoming AppSec testing lab.
