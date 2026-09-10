import { db } from "./index.server";
import { users, products, coupons } from "./schema";
import crypto from "node:crypto";

function hashPassword(password: string) {
  // SHA-256 for educational / demo purposes
  return crypto.createHash("sha256").update(password).digest("hex");
}

async function seed() {
  console.log("Seeding database...");

  // Seed initial users
  await db.insert(users).values([
    {
      email: "admin@elshaddai.ch",
      passwordHash: hashPassword("AdminSuperSecret2026!"),
      fullName: "Administrateur El Shaddai",
      role: "admin",
    },
    {
      email: "alice@example.com",
      passwordHash: hashPassword("password123"),
      fullName: "Alice Dupont",
      role: "customer",
    },
    {
      email: "bob@example.com",
      passwordHash: hashPassword("perfume2026"),
      fullName: "Bob Martin",
      role: "customer",
    },
  ]).onConflictDoNothing();

  // Seed initial coupons
  await db.insert(coupons).values([
    { code: "BIENVENUE10", discountPercent: 10, isActive: true, maxUses: 100 },
    { code: "VIP20", discountPercent: 20, isActive: true, maxUses: 50 },
    { code: "HACKME100", discountPercent: 100, isActive: true, maxUses: 5 },
  ]).onConflictDoNothing();

  // Seed sample products
  await db.insert(products).values([
    {
      slug: "khamrah",
      name: "Khamrah",
      brand: "Lattafa",
      price: 69.0,
      originalPrice: 85.0,
      category: "oriental",
      description: "Un parfum opulent aux notes de cannelle, noix de muscade et praliné avec fond d'ambre et vanille.",
      stock: 35,
      rating: 4.9,
      reviewCount: 42,
    },
    {
      slug: "yaracandy",
      name: "Yara Candy",
      brand: "Lattafa",
      price: 55.0,
      originalPrice: 65.0,
      category: "gourmand",
      description: "Une explosion fruitée et sucrée de bonbon, mandarine pétillante et vanille musquée.",
      stock: 20,
      rating: 4.8,
      reviewCount: 31,
    },
    {
      slug: "badee-al-oud-honor-glory",
      name: "Bade'e Al Oud - Honor & Glory",
      brand: "Lattafa",
      price: 75.0,
      originalPrice: 90.0,
      category: "oriental",
      description: "Accords d'ananas caramélisé, cannelle, crème brûlée et oud précieux.",
      stock: 15,
      rating: 4.95,
      reviewCount: 18,
    },
    {
      slug: "khamrah-qahwa",
      name: "Khamrah Qahwa",
      brand: "Lattafa",
      price: 79.0,
      originalPrice: 95.0,
      category: "oriental",
      description: "Une déclinaison au café fumé, cardamome et fève tonka de l'iconique Khamrah.",
      stock: 12,
      rating: 5.0,
      reviewCount: 26,
    },
  ]).onConflictDoNothing();

  console.log("Database successfully seeded!");
}

seed().catch((err) => {
  console.error("Seeding error:", err);
  process.exit(1);
});
