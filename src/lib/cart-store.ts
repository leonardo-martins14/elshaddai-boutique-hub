import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/data/products";

export type CartItem = {
  slug: string;
  name: string;
  size: string;
  price: number;
  image: string;
  quantity: number;
  brand?: string;
  brandLabel?: string;
};

type CartState = {
  items: CartItem[];
  appliedCoupon: { code: string; percent: number } | null;
  add: (product: Product, quantity?: number) => void;
  remove: (slug: string) => void;
  setQty: (slug: string, quantity: number) => void;
  clear: () => void;
  totalItems: () => number;
  totalPrice: () => number;
  volumeDiscountPercent: () => number;
  volumeDiscountAmount: () => number;
  couponDiscountAmount: () => number;
  discountAmount: () => number;
  shippingFee: () => number;
  grandTotal: () => number;
  nextVolumeTierInfo: () => {
    currentPercent: number;
    nextPercent: number;
    itemsNeeded: number;
    message: string;
  };
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      appliedCoupon: null,
      add: (product, quantity = 1) =>
        set((state) => {
          const safeItems = Array.isArray(state.items) ? state.items : [];
          const existing = safeItems.find((i) => i && i.slug === product.slug);
          if (existing) {
            return {
              items: safeItems.map((i) =>
                i && i.slug === product.slug ? { ...i, quantity: (i.quantity || 0) + quantity } : i,
              ),
            };
          }
          return {
            items: [
              ...safeItems,
              {
                slug: product.slug,
                name: product.name,
                size: product.size,
                price: product.price,
                image: product.image,
                quantity,
                brand: product.brand,
                brandLabel: product.brandLabel,
              },
            ],
          };
        }),
      remove: (slug) =>
        set((state) => ({
          items: (Array.isArray(state.items) ? state.items : []).filter((i) => i && i.slug !== slug),
        })),
      setQty: (slug, quantity) =>
        set((state) => ({
          items: (Array.isArray(state.items) ? state.items : [])
            .map((i) => (i && i.slug === slug ? { ...i, quantity } : i))
            .filter((i) => i && i.quantity > 0),
        })),
      clear: () => set({ items: [], appliedCoupon: null }),
      totalItems: () =>
        (Array.isArray(get().items) ? get().items : []).reduce((s, i) => s + (i?.quantity || 0), 0),
      totalPrice: () =>
        (Array.isArray(get().items) ? get().items : []).reduce(
          (s, i) => s + (i?.quantity || 0) * (i?.price || 0),
          0,
        ),
      volumeDiscountPercent: () => {
        const count = get().totalItems();
        if (count >= 5) return 20;
        if (count === 4) return 15;
        if (count === 3) return 10;
        if (count === 2) return 5;
        return 0;
      },
      volumeDiscountAmount: () => {
        const sub = get().totalPrice();
        const percent = get().volumeDiscountPercent();
        return Math.round((sub * percent) / 100);
      },
      couponDiscountAmount: () => {
        const coupon = get().appliedCoupon;
        if (!coupon) return 0;
        const sub = get().totalPrice() - get().volumeDiscountAmount();
        return Math.round((sub * coupon.percent) / 100);
      },
      discountAmount: () => get().volumeDiscountAmount() + get().couponDiscountAmount(),
      shippingFee: () => {
        const sub = get().totalPrice();
        if (sub === 0) return 0;
        return sub >= 80 ? 0 : 7;
      },
      grandTotal: () => Math.max(0, get().totalPrice() - get().discountAmount() + get().shippingFee()),
      nextVolumeTierInfo: () => {
        const count = get().totalItems();
        if (count === 0) {
          return { currentPercent: 0, nextPercent: 5, itemsNeeded: 2, message: "Ajoutez 2 parfums pour débloquer 5% de réduction !" };
        }
        if (count === 1) {
          return { currentPercent: 0, nextPercent: 5, itemsNeeded: 1, message: "Ajoutez encore 1 parfum pour débloquer 5% de réduction !" };
        }
        if (count === 2) {
          return { currentPercent: 5, nextPercent: 10, itemsNeeded: 1, message: "Ajoutez encore 1 parfum pour débloquer 10% de réduction !" };
        }
        if (count === 3) {
          return { currentPercent: 10, nextPercent: 15, itemsNeeded: 1, message: "Ajoutez encore 1 parfum pour débloquer 15% de réduction !" };
        }
        if (count === 4) {
          return { currentPercent: 15, nextPercent: 20, itemsNeeded: 1, message: "Ajoutez encore 1 parfum pour débloquer 20% de réduction VIP !" };
        }
        return {
          currentPercent: 20,
          nextPercent: 20,
          itemsNeeded: 0,
          message: "Offre VIP Maximale active : -20% appliqués sur l'ensemble de votre commande !",
        };
      },
      applyCoupon: (rawCode: string) => {
        const code = rawCode.trim().toUpperCase();
        if (!code) return { success: false, message: "Veuillez entrer un code promo." };
        if (code === "WELCOME10" || code === "ELSHADDAI10" || code === "SUISSE10") {
          set({ appliedCoupon: { code, percent: 10 } });
          return { success: true, message: `Code ${code} appliqué (-10%)` };
        }
        if (code === "ELSHADDAI20" || code === "VIP20") {
          set({ appliedCoupon: { code, percent: 20 } });
          return { success: true, message: `Code ${code} appliqué (-20%)` };
        }
        return { success: false, message: "Code promo non valide ou expiré." };
      },
      removeCoupon: () => set({ appliedCoupon: null }),
    }),
    { name: "elshaddai-cart" },
  ),
);

export function formatCHF(amount: number): string {
  return new Intl.NumberFormat("fr-CH", {
    style: "currency",
    currency: "CHF",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
