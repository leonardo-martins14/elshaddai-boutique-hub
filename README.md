<div align="center">

  # ✦ EL SHADDAI FRAGRANCES ✦
  **Exceptional Oriental Perfumery E-Commerce Platform Tailored for Switzerland.**

  [![React](https://img.shields.io/badge/React-18.x-blue?style=for-the-badge&logo=react)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-5.x-purple?style=for-the-badge&logo=vite)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x_/_4.x-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![TanStack Router](https://img.shields.io/badge/TanStack_Router-Latest-FF4154?style=for-the-badge&logo=react)](https://tanstack.com/router)

  [Overview](#-about-the-project) •
  [Key Features](#-key-features) •
  [Tech Stack](#-tech-stack--architecture) •
  [Getting Started](#-getting-started) •
  [Project Structure](#-project-structure)

</div>

---

## 💎 About the Project

**El Shaddai Fragrances** is a high-end luxury e-commerce platform dedicated to fine Oriental perfumery in Switzerland. Designed with an **Art Déco aesthetic (Ivory, Gold & Deep Obsidian)**, the boutique delivers an immersive, ultra-fast, and seamless shopping experience.

The platform incorporates reactive state management, an interactive bespoke fragrance finder quiz, and native Swiss payment integrations (**TWINT**, **IBAN Bank Transfer**, and **Credit Card**).

---

## ✨ Key Features

### 🌸 1. Interactive Olfactory Quiz ("Trouvez votre signature")
- **3-Step Guided Quiz** (Scent Family, Vibe/Target, & Occasion/Intensity).
- Tailored recommendation engine displaying top 3 matching perfumes with affinity scores (e.g. *98% Match*).
- Instant 1-click "Add to Cart" directly from quiz results.

### 📱 2. Instant Swiss TWINT Payment (Dynamic QR Code)
- Vector scannable **TWINT QR Code** generated dynamically for smartphone camera scanning.
- Official merchant number **`077 234 23 23`** with exact order totals in **CHF**.
- 1-tap quick copy buttons for phone number and exact payment amount.

### 🎁 3. Progressive Volume Discounts & Free Shipping Bar
- **Automated Tiered Savings**: 2 items (-5%), 3 items (-10%), 4 items (-15%), 5+ items (-20% VIP).
- Dynamic progress bar for **Free Shipping in Switzerland** (80 CHF threshold).
- Coupon code engine (e.g., `WELCOME10`).

### 🛒 4. Reactive Luxury Cart Experience (CartDrawer & Panier Page)
- Side-drawer with real-time reactive badge counter in the header (0ms delay).
- Gold-framed product cards highlighting top oriental perfume houses (*Lattafa*, *Al Wataniah*), size specifications, unit prices, and line subtotals.

### 💳 5. Type-Safe Checkout Workflow
- Form validation built with **Zod** & **React Hook Form**.
- Supports 3 payment gateways: **TWINT**, **Raiffeisen / Cantonal Bank IBAN Transfer**, and **SSL Credit Card**.
- Printable order confirmation screen with order reference numbers.

---

## 🛠️ Tech Stack & Architecture

| Technology | Role |
| :--- | :--- |
| **React 18** | UI Library for modular and high-performance component rendering |
| **TypeScript** | Strict static typing for enterprise-grade code safety |
| **Vite** | Next-generation frontend build tool and dev server |
| **TanStack Router** | Type-safe file-based routing system |
| **Zustand** | Global state management for persistent cart state |
| **Tailwind CSS** | Custom Art Déco design system (Ivory, Gold, Dark Obsidian) |
| **Lucide React** | Modern vector icon suite |
| **Sonner** | Luxury toast notification system |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) or [bun](https://bun.sh/)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/elshaddai-boutique-hub.git
cd elshaddai-boutique-hub
```

### 2. Install dependencies
```bash
npm install
# or using bun
bun install
```

### 3. Run local development server
```bash
npm run dev
# or using bun
bun dev
```

The application will be available at `http://localhost:8080` or `http://localhost:5173`.

---

## 📁 Project Structure

```text
elshaddai-boutique-hub/
├── public/                     # Public assets & favicon
├── src/
│   ├── assets/                 # High-definition perfume imagery
│   ├── components/             # Reusable UI components
│   │   ├── AnnouncementBar.tsx # Top notification bar
│   │   ├── CartDrawer.tsx      # Reactive slide-out cart drawer
│   │   ├── Header.tsx          # Main header navigation & live cart badge
│   │   ├── Footer.tsx          # Official footer & links
│   │   ├── PerfumeQuizDialog.tsx # Olfactory Quiz modal
│   │   ├── TwintQrCode.tsx     # TWINT QR Code generator
│   │   └── ProductCard.tsx     # Animated Art Déco product card
│   ├── data/
│   │   └── products.ts         # Fragrance catalogue & scent pyramid dataset
│   ├── lib/
│   │   └── cart-store.ts       # Zustand cart store with localStorage persistence
│   ├── routes/                 # TanStack Router file-based routes
│   │   ├── __root.tsx          # Root layout & error boundaries
│   │   ├── index.tsx           # Homepage (Hero, Collections, Best-Sellers)
│   │   ├── boutique.index.tsx  # Full catalogue with brand filters
│   │   ├── boutique.$slug.tsx  # Product detail page & olfactive pyramids
│   │   ├── collections.index.tsx # Olfactory family exploration
│   │   ├── panier.tsx          # Dedicated shopping cart page
│   │   ├── commande.tsx        # Checkout form & shipping info
│   │   └── commande_.confirmation.tsx # Order confirmation screen
│   ├── styles.css              # Design System (CSS variables, Gold, Ivory)
│   └── main.tsx                # Application entry point
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🇨🇭 Target Market (Switzerland)

Engineered specifically for the **Swiss market**:
- All pricing and calculations formatted natively in **Swiss Francs (CHF)**.
- Integrated Swiss local payment solutions (**TWINT** and **Raiffeisen / Cantonal Bank**).
- Free shipping threshold configured for Swiss logistics (**80 CHF**).

---

<div align="center">
  <sub>Crafted with precision for <strong>El Shaddai Fragrances</strong>. All rights reserved.</sub>
</div>
