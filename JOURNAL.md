# Engineering & Security Journal

**Project:** El Shaddai Fragrances — E-Commerce Platform & AppSec Lab  
**Date:** September 10, 2026  
**Status:** In Active Development (Pre-Production)  

---

## Project Overview

El Shaddai Fragrances is a boutique e-commerce web application dedicated to luxury Oriental perfumery in Switzerland. The project serves a dual purpose:

1. **Production Objective:** Delivering a secure, functional, and performant commercial web boutique with localized Swiss payment flows (TWINT, IBAN bank transfer, and card payments).
2. **Security & Research Objective:** Serving as an authentic web application security (AppSec) and penetration testing laboratory in an isolated development environment, enabling hands-on practice with vulnerability discovery, exploit verification (e.g., using Burp Suite), and secure-code remediation.

---

## My Role & Development Methodology

This project is developed using an **AI-assisted engineering methodology**:

* **Architecture & Requirements:** I define system specifications, data models, business logic constraints, and security standards.
* **Review & Verification:** I critically review code changes, architectural decisions, and dependency selections generated with AI tools.
* **Testing & Security Validation:** I execute system tests, verify database integrity, validate security properties, and ensure the implementation aligns with established software engineering principles.
* **Hands-on Understanding:** I maintain deep understanding of each component, server entrypoint, and data flow to prepare for subsequent security analysis and code audits.

---

## Current Status

* **Frontend:** Fully implemented and styled using React 19, Vite, Tailwind CSS v4, and Radix UI primitives. It features a responsive catalog, interactive scent quiz, cart drawer with tiered discounts, and checkout forms.
* **Backend & Database:** The persistent database layer (SQLite + Drizzle ORM) has just been initialized. The real backend logic connecting client actions to database transactions is actively being built.
* **Production Readiness:** **The application is NOT production-ready yet.** All state transitions currently rely on client-side state and mock data.
* **Immediate Milestone:** Transitioning from client-side state to a fully validated, secure Minimum Viable Product (MVP) backend.
* **Next Major Milestone:** Cloud deployment, end-to-end purchasing tests, and completing the first real/test transaction.
* **Security Scope:** All security audits, penetration testing exercises, and intentional flaw injection will be conducted **strictly within authorized local and staging lab environments**, never against live production infrastructure or real users.

---

## Architectural Deep Dive: Completed Milestones

### 1. Server Entrypoint (`src/server.ts`)

The application leverages TanStack Start with a Nitro-based server entrypoint utilizing the standard Web Fetch API (`fetch(request, env, ctx)`):

* **SSR Orchestration:** Lazily imports `@tanstack/react-start/server-entry` on the first request to render React 19 pages server-side and dispatch RPC calls.
* **Platform Portability:** Adherence to standard `Request`/`Response` primitives ensures the application can run across Node.js, Docker, or edge environments (e.g., Cloudflare Workers).
* **Catastrophic Error Normalization:** Nitro's `h3` core absorbs uncaught SSR exceptions into internal JSON 500 responses (`{"unhandled":true,"message":"HTTPError"}`). The custom `normalizeCatastrophicSsrResponse` function intercepts these occurrences, retrieves original diagnostics via `consumeLastCapturedError()`, and renders a styled fallback error page (`renderErrorPage()`).

### 2. Server Functions Architecture (`createServerFn`)

Server-side operations utilize TanStack Start's `createServerFn` construct (demonstrated in `src/lib/api/example.functions.ts`):

* **Type-Safe RPCs:** Enables client components and route loaders to invoke server procedures directly with full TypeScript type inference.
* **Automatic Code Splitting:** During compilation, function bodies inside `.handler(...)` are extracted exclusively into the server bundle. The browser client receives only a lightweight HTTP RPC proxy.
* **Server-Only Module Boundary:** Files adhering to the `.server.ts` naming convention (such as `src/lib/config.server.ts` and `src/lib/db/index.server.ts`) are completely excluded from client bundles, preventing leakage of database handles, secrets, or internal server logic.

### 3. Database Layer: SQLite + Drizzle ORM

To balance zero-configuration local execution with future cloud scalability, the database layer was implemented using `@libsql/client` and `drizzle-orm`:

* **Driver Choice (`@libsql/client`):** Unlike native SQLite packages with C++ bindings (such as `better-sqlite3`), LibSQL operates across diverse environments without compilation dependencies and natively supports seamless transition to distributed cloud databases (e.g., Turso) by adjusting environment variables.
* **Configuration:** Established in `drizzle.config.ts`, mapping to `local.db` for local operations.
* **Database Client:** Isolated within `src/lib/db/index.server.ts`.
* **Database Schema (`src/lib/db/schema.ts`):**
  * `users`: Stores user credentials (`passwordHash`), roles (`customer` vs. `admin`), and timestamps.
  * `products`: Stores catalog details, authoritative prices, descriptions, and stock quantities.
  * `orders`: Tracks checkout records, customer details, payment choices, and financial totals.
  * `orderItems`: Stores individual line items per order linked via foreign keys.
  * `coupons`: Manages discount codes, percentage values, usage quotas, and active statuses.
* **Database Seeding (`src/lib/db/seed.ts`):**
  * Populates development catalog items and sample customer accounts.
  * Includes development/lab coupons (`BIENVENUE10`, `VIP20`, and a testing coupon `HACKME100` reserved strictly for development evaluation).
  * *Security Note:* Default admin accounts and mock seeds are restricted to local development environments; production deployments will require authenticated, interactive bootstrap commands with strong salted hashing.
* **Automation Scripts Added to `package.json`:**
  * `npm run db:push`: Synchronizes the Drizzle schema directly to the database.
  * `npm run db:seed`: Seeds local database records.
  * `npm run db:studio`: Launches Drizzle Studio for visual database inspection.

### 4. Source Control Baseline

* Project state baseline committed to Git (`chore: sync current project state`).
* Database infrastructure, schema, and dev tooling committed (`feat(db): setup SQLite with Drizzle ORM and add dev journal`).
* Database binaries (`*.db`, `*.db-journal`, `local.db`) added to `.gitignore` to prevent committing persistent data.

---

## Project Roadmap

The project follows a **security-by-design, production-first progression**. Robust application logic and real-world deployment take precedence before creating experimental security labs.

```
Database foundation
       │
       ▼
Real backend
       │
       ▼
Products / Orders / Coupons
       │
       ▼
Authentication / Authorization
       │
       ▼
Server-side validation
       │
       ▼
Production deployment
       │
       ▼
End-to-end purchase testing
       │
       ▼
First real sale
       │
       ▼
Separate AppSec lab environment
       │
       ▼
Controlled vulnerabilities
       │
       ▼
Burp Suite testing
       │
       ▼
Remediation
       │
       ▼
Retesting
```

---

## Next Steps

Immediate development priorities for the backend implementation:

1. **Connect Products to the Database:** Link the product catalog and categories directly to the database layer.
2. **Implement Server-Side Product Retrieval:** Replace static imports with server functions to fetch products and detail views.
3. **Implement Server-Side Coupon Validation:** Validate coupon codes, status, and discount limits strictly on the server.
4. **Implement Server-Side Order Creation:** Process orders via dedicated server handlers.
5. **Calculate Prices on the Server:** Compute subtotal, discounts, and grand totals server-side using authoritative database prices, discarding any untrusted client calculations.
6. **Validate Stock on the Server:** Ensure inventory availability before confirming any purchase.
7. **Use Transactions Where Appropriate:** Execute order insertion, item creation, coupon redemption, and stock decrements atomically within `db.transaction`.
8. **Test the Complete Checkout Flow:** Conduct end-to-end checkout validation to verify database persistence and data integrity.

---

## 🛡️ AppSec Environment Preparation (Burp Suite & Browser Setup)

As part of preparing for Phase 4 (AppSec evaluation in an isolated lab), the interception tooling was configured with zero active exploitation performed today:

* **Proxy Listener:** Confirmed standard local listener on `127.0.0.1:8080` in Burp Suite Community/Professional.
* **Browser Interception Strategy:** 
  * Option A (Recommended): Burp's embedded Chromium browser (`Proxy > Open browser`), which requires no certificate installation and pre-routes all loopback traffic.
  * Option B (Dedicated profile): External browser configured with proxy host `127.0.0.1:8080`, PortSwigger CA certificate installed in the Trusted Root Certification Authorities store, and proxy bypass rules cleared (removing `<-loopback>` or `localhost` from bypass lists).
* **Target Scope Definition:** Configured Target Scope filter in Burp strictly to `http://localhost:5173.*` to avoid intercepting extraneous operating system or browser background telemetry.
* **WebSocket Handling:** Configured Vite HMR (Hot Module Replacement) WebSocket passthrough in proxy match/replace rules to prevent UI disconnections during development.
* **Compliance:** Verification confirmed strictly passive tool readiness; no intrusive scans, fuzzing, or attack payloads were deployed.

---

## 🏁 Day 1 Closing Summary

* [x] **Technical Documentation Closed:** [`README.md`](README.md) updated with full tech stack (React 19, Vite 7, Drizzle, LibSQL/SQLite) and database lifecycle commands (`db:push`, `db:seed`, `db:verify`, `db:studio`).
* [x] **Database Verified:** Executed `npm run db:verify` on `local.db`, confirming 3 seeded user accounts, 4 catalog products, and 3 active coupons.
* [x] **Security Baseline Established:** Burp Suite interceptor profile documented and configured; testing pipeline scheduled for post-MVP.
* [x] **Repository Clean:** Git status verified and changes committed cleanly.

