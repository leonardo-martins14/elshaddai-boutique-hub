import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { formatCHF, useCart } from "@/lib/cart-store";
import { toast } from "sonner";

export function CartDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const items = useCart((s) => s.items);
  const subtotal = useCart((s) => s.totalPrice)();
  const shipping = useCart((s) => s.shippingFee)();
  const grandTotal = useCart((s) => s.grandTotal)();
  const appliedCoupon = useCart((s) => s.appliedCoupon);
  const applyCoupon = useCart((s) => s.applyCoupon);
  const removeCoupon = useCart((s) => s.removeCoupon);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);

  const [couponInput, setCouponInput] = useState("");

  const volumePercent = useCart((s) => s.volumeDiscountPercent)();
  const volumeDiscount = useCart((s) => s.volumeDiscountAmount)();
  const couponDiscount = useCart((s) => s.couponDiscountAmount)();
  const nextVolumeTier = useCart((s) => s.nextVolumeTierInfo)();

  const missingForFreeShipping = Math.max(0, 80 - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / 80) * 100);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md bg-background flex flex-col h-full overflow-hidden p-6 gap-0">
        {/* Header */}
        <SheetHeader className="shrink-0 pb-4">
          <SheetTitle className="font-display text-lg tracking-[0.2em] uppercase text-primary">
            Votre Panier {items.length > 0 && `(${items.reduce((acc, i) => acc + i.quantity, 0)})`}
          </SheetTitle>
        </SheetHeader>

        {/* Top Banners */}
        {items.length > 0 && (
          <div className="shrink-0 space-y-2 pb-3">
            {/* Free shipping banner */}
            <div className="bg-secondary/50 p-2.5 border border-border text-center space-y-1">
              <p className="text-xs text-primary font-medium">
                {missingForFreeShipping > 0 ? (
                  <>
                    Ajoutez encore <strong className="text-gold-dark">{formatCHF(missingForFreeShipping)}</strong> pour la <strong className="text-gold-dark">livraison offerte</strong> !
                  </>
                ) : (
                  <span className="text-gold-dark font-semibold">Félicitations ! Livraison offerte en Suisse !</span>
                )}
              </p>
              <div className="w-full bg-border h-1 rounded-full overflow-hidden">
                <div
                  className="bg-gold h-full transition-all duration-500"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>

            {/* Volume discount banner */}
            <div className="bg-gold/10 border border-gold/30 p-2.5 text-center text-xs space-y-1">
              <p className="text-gold-dark font-medium">
                <strong>Offre Multi-Parfums</strong> : {nextVolumeTier.message}
              </p>
              {volumePercent > 0 && (
                <p className="text-[11px] text-muted-foreground font-semibold text-gold-dark">
                  Remise de {volumePercent}% déjà débloquée et appliquée !
                </p>
              )}
            </div>
          </div>
        )}

        <div className="gold-rule shrink-0 mb-3" />

        {/* Main List Area with flex-1 min-h-0 overflow-y-auto */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-12">
            <ShoppingBag className="h-12 w-12 text-muted-foreground/40" />
            <p className="text-muted-foreground">Votre panier est vide</p>
            <Button
              onClick={() => onOpenChange(false)}
              asChild
              variant="outline"
              className="border-primary"
            >
              <Link to="/boutique">Découvrir la boutique</Link>
            </Button>
          </div>
        ) : (
          <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-3 py-1">
            {items.map((item) => (
              <div
                key={item.slug}
                className="p-3 bg-card border border-border/80 shadow-2xs flex gap-3.5 items-center hover:border-gold/40 transition-colors"
              >
                <Link
                  to="/boutique/$slug"
                  params={{ slug: item.slug }}
                  onClick={() => onOpenChange(false)}
                  className="shrink-0 relative group"
                >
                  <div className="h-20 w-16 bg-secondary/40 border border-gold/40 overflow-hidden shadow-2xs">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                </Link>

                <div className="flex-1 flex flex-col justify-between min-h-[80px]">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[9px] uppercase tracking-[0.2em] text-gold-dark font-medium leading-none mb-1">
                          {item.brandLabel || item.brand || "El Shaddai Fragrances"}
                        </p>
                        <Link
                          to="/boutique/$slug"
                          params={{ slug: item.slug }}
                          onClick={() => onOpenChange(false)}
                          className="font-serif text-base text-primary font-medium hover:text-gold transition-colors leading-snug block"
                        >
                          {item.name}
                        </Link>
                      </div>
                      <button
                        onClick={() => remove(item.slug)}
                        className="text-muted-foreground hover:text-destructive p-1 transition-colors cursor-pointer"
                        aria-label="Retirer"
                        title="Supprimer du panier"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{item.size || "100 ml — Eau de Parfum"}</p>
                  </div>

                  <div className="flex items-end justify-between mt-2 pt-1.5 border-t border-border/40">
                    <div className="inline-flex items-center border border-gold/40 bg-background">
                      <button
                        onClick={() => setQty(item.slug, item.quantity - 1)}
                        className="px-2 py-0.5 hover:bg-gold/10 text-primary transition-colors cursor-pointer"
                        aria-label="Diminuer"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-2.5 text-xs font-semibold font-mono text-primary">{item.quantity}</span>
                      <button
                        onClick={() => setQty(item.slug, item.quantity + 1)}
                        className="px-2 py-0.5 hover:bg-gold/10 text-primary transition-colors cursor-pointer"
                        aria-label="Augmenter"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="font-sans text-base font-bold text-primary leading-none">
                        {formatCHF(item.price * item.quantity)}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-[10px] text-muted-foreground font-sans mt-0.5">
                          {item.quantity} × {formatCHF(item.price)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Area with Promo & Totals */}
        {items.length > 0 && (
          <div className="shrink-0 border-t border-border pt-3 space-y-2 bg-background mt-auto">
            {/* Promo Code Input */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-gold/10 border border-gold/30 px-3 py-1 text-xs">
                  <span className="text-gold-dark font-medium">{appliedCoupon.code} (-{appliedCoupon.percent}%)</span>
                  <button
                    onClick={removeCoupon}
                    className="text-muted-foreground hover:text-destructive text-[11px] underline ml-2 cursor-pointer"
                  >
                    Retirer
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const res = applyCoupon(couponInput);
                    if (res.success) {
                      toast.success(res.message);
                      setCouponInput("");
                    } else {
                      toast.error(res.message);
                    }
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    placeholder="Code promo (ex: WELCOME10)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 border border-border bg-background px-3 py-1.5 text-xs focus:border-gold focus:outline-none uppercase"
                  />
                  <button
                    type="submit"
                    className="bg-secondary hover:bg-secondary/80 border border-border px-3 py-1.5 text-[11px] uppercase tracking-wider font-medium cursor-pointer"
                  >
                    Appliquer
                  </button>
                </form>
              )}
            </div>

            <div className="space-y-1 text-xs pt-1">
              <div className="flex justify-between text-muted-foreground">
                <span>Sous-total</span>
                <span className="font-sans font-semibold text-primary">{formatCHF(subtotal)}</span>
              </div>
              {volumePercent > 0 && volumeDiscount > 0 && (
                <div className="flex justify-between text-gold-dark font-medium">
                  <span>Offre multi-parfums (-{volumePercent}%)</span>
                  <span className="font-sans font-semibold">-{formatCHF(volumeDiscount)}</span>
                </div>
              )}
              {appliedCoupon && (
                <div className="flex justify-between text-gold-dark font-medium">
                  <span>Remise code ({appliedCoupon.code})</span>
                  <span className="font-sans font-semibold">-{formatCHF(couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>Livraison Suisse</span>
                <span>{shipping === 0 ? <strong className="text-gold-dark uppercase tracking-wider text-[10px]">Offerte</strong> : <span className="font-sans font-semibold text-primary">{formatCHF(shipping)}</span>}</span>
              </div>
            </div>

            <div className="flex justify-between text-base pt-2 border-t border-border/60">
              <span className="font-serif font-medium">Total estimé</span>
              <span className="text-primary font-sans font-bold text-lg">{formatCHF(grandTotal)}</span>
            </div>

            <Button
              asChild
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-xs tracking-[0.2em] py-3 h-auto uppercase mt-1"
            >
              <Link to="/commande" onClick={() => onOpenChange(false)}>
                Passer commande
              </Link>
            </Button>

            <Link
              to="/panier"
              onClick={() => onOpenChange(false)}
              className="block text-center text-[11px] text-muted-foreground hover:text-gold uppercase tracking-[0.18em] pt-1"
            >
              Voir le panier détaillé
            </Link>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
