# El Shaddai Fragrances

A boutique e-commerce web application for luxury Oriental perfumery in Switzerland.

## Features

- **Fragrance Catalogue & Quiz**: Interactive scent finder quiz to suggest perfumes based on notes, plus brand and category filters.
- **Swiss Payments**: TWINT support with dynamic QR code generation, IBAN bank transfer details, and credit card payments.
- **Shopping Cart**: Persistent cart drawer, tier discounts, free shipping progress tracker (80 CHF threshold), and promo code input.
- **Checkout Flow**: Complete checkout page with form validation and printable order confirmation.

## Tech Stack

- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Routing**: TanStack Router
- **State**: Zustand (with local storage persistence)
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod
- **Icons & UI**: Lucide React, Sonner

## Development

### Prerequisites

- Node.js 18 or higher
- npm or bun

### Setup

```bash
# Install dependencies
npm install

# Run dev server
npm run dev
```

The application runs locally at `http://localhost:5173` (or `http://localhost:8080`).
