import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  fullName: text("full_name").notNull(),
  role: text("role", { enum: ["customer", "admin"] }).default("customer").notNull(),
  createdAt: text("created_at").$defaultFn(() => new Date().toISOString()).notNull(),
});

export const products = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  brand: text("brand").notNull(),
  price: real("price").notNull(),
  originalPrice: real("original_price"),
  category: text("category").notNull(),
  description: text("description").notNull(),
  stock: integer("stock").default(50).notNull(),
  rating: real("rating").default(5.0),
  reviewCount: integer("review_count").default(0),
  image: text("image"),
  createdAt: text("created_at").$defaultFn(() => new Date().toISOString()).notNull(),
});

export const orders = sqliteTable("orders", {
  id: text("id").primaryKey(), // E.g.: "ELS-104928"
  userId: integer("userId").references(() => users.id),
  clientName: text("client_name").notNull(),
  clientEmail: text("client_email").notNull(),
  clientPhone: text("client_phone").notNull(),
  shippingAddress: text("shipping_address").notNull(),
  paymentMethod: text("payment_method").notNull(), // "twint" | "iban" | "carte"
  subtotal: real("subtotal").notNull(),
  shipping: real("shipping").notNull(),
  grandTotal: real("grand_total").notNull(),
  status: text("status", { enum: ["pending", "paid", "shipped", "cancelled"] }).default("pending").notNull(),
  notes: text("notes"),
  createdAt: text("created_at").$defaultFn(() => new Date().toISOString()).notNull(),
});

export const orderItems = sqliteTable("order_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  orderId: text("order_id").references(() => orders.id).notNull(),
  productId: integer("product_id").references(() => products.id),
  productName: text("product_name").notNull(),
  size: text("size").notNull(),
  price: real("price").notNull(),
  quantity: integer("quantity").notNull(),
});

export const coupons = sqliteTable("coupons", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  code: text("code").notNull().unique(),
  discountPercent: integer("discount_percent").notNull(),
  isActive: integer("is_active", { mode: "boolean" }).default(true).notNull(),
  maxUses: integer("max_uses").default(100).notNull(),
  usedCount: integer("used_count").default(0).notNull(),
});
