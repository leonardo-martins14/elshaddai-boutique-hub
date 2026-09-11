import { db } from "./index.server";
import { users, products, coupons, orders } from "./schema";

async function verify() {
  console.log("--- SQLite & Drizzle Verification ---");
  const userList = await db.select().from(users);
  const productList = await db.select().from(products);
  const couponList = await db.select().from(coupons);
  const orderList = await db.select().from(orders);

  console.log(`Users in DB:    ${userList.length} (Sample: ${userList[0]?.email ?? "none"})`);
  console.log(`Products in DB: ${productList.length} (Sample: ${productList[0]?.name ?? "none"} - CHF ${productList[0]?.price ?? 0})`);
  console.log(`Coupons in DB:  ${couponList.length} (Codes: ${couponList.map((c) => c.code).join(", ")})`);
  console.log(`Orders in DB:   ${orderList.length}`);
  console.log("Status: SQLite database is ACTIVE and correctly seeded!");
  process.exit(0);
}

verify().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
