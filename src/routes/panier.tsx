import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SectionTitle } from "@/components/SectionTitle";
import { formatCHF, useCart } from "@/lib/cart-store";

export const Route = createFileRoute("/panier")({
  head: () => ({
    meta: [
      { title: "Panier — El Shaddai Fragrances" },
      { name: "description", content: "Votre panier El Shaddai Fragrances." },
    ],
  }),
  component: PanierPage,
});

function PanierPage() {
  const items = useCart((s) => s.items);
  const subtotal = useCart((s) => s.totalPrice)();
  const shipping = useCart((s) => s.shippingFee)();
  const grandTotal = useCart((s) => s.grandTotal)();
  const totalCount = useCart((s) => s.totalItems)();
  const volumePercent = useCart((s) => s.volumeDiscountPercent)();
  const volumeDiscount = useCart((s) => s.volumeDiscountAmount)();
  const couponDiscount = useCart((s) => s.couponDiscountAmount)();
  const appliedCoupon = useCart((s) => s.appliedCoupon);
  const nextVolumeTier = useCart((s) => s.nextVolumeTierInfo)();
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);

  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar />
      <Header />
      <main className="flex-1 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
        <SectionTitle eyebrow="Étape 1 sur 2" title="Votre panier" />

        {items.length === 0 ? (
          <div className="text-center py-16 space-y-6">
            <ShoppingBag className="h-16 w-16 text-muted-foreground/40 mx-auto" />
            <p className="text-muted-foreground">Votre panier est vide pour le moment.</p>
            <Link
              to="/boutique"
              className="inline-block bg-primary text-primary-foreground px-8 py-4 text-xs uppercase tracking-[0.2em] hover:bg-primary/90"
            >
              Découvrir la boutique
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Volume discount banner */}
            <div className="bg-gold/10 border border-gold/40 p-4 text-center text-sm space-y-1">
              <p className="text-gold-dark font-medium font-serif text-base">
                Offre Spéciale Multi-Parfums
              </p>
              <p className="text-muted-foreground text-xs">
                {nextVolumeTier.message}
              </p>
              <div className="flex justify-center gap-2 text-[11px] pt-2 font-medium">
                <span className={`px-2 py-0.5 border ${totalCount >= 2 ? "border-gold bg-gold text-primary font-bold" : "border-border text-muted-foreground"}`}>2 Parfums: -5%</span>
                <span className={`px-2 py-0.5 border ${totalCount >= 3 ? "border-gold bg-gold text-primary font-bold" : "border-border text-muted-foreground"}`}>3 Parfums: -10%</span>
                <span className={`px-2 py-0.5 border ${totalCount >= 4 ? "border-gold bg-gold text-primary font-bold" : "border-border text-muted-foreground"}`}>4 Parfums: -15%</span>
                <span className={`px-2 py-0.5 border ${totalCount >= 5 ? "border-gold bg-gold text-primary font-bold" : "border-border text-muted-foreground"}`}>5+ Parfums: -20% VIP</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <div key={item.slug} className="flex gap-4 sm:gap-6 bg-card border border-border hover:border-gold/40 transition-all p-4 sm:p-6 shadow-2xs">
                    <Link to="/boutique/$slug" params={{ slug: item.slug }} className="shrink-0 group">
                      <div className="h-32 w-24 sm:h-36 sm:w-28 bg-secondary/40 border border-gold/40 overflow-hidden shadow-sm">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </Link>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-[10px] uppercase tracking-[0.25em] text-gold-dark font-medium">
                              {item.brandLabel || item.brand || "El Shaddai Fragrances"}
                            </p>
                            <Link
                              to="/boutique/$slug"
                              params={{ slug: item.slug }}
                              className="font-serif text-xl sm:text-2xl text-primary hover:text-gold transition-colors font-medium leading-tight block"
                            >
                              {item.name}
                            </Link>
                          </div>
                          <button
                            onClick={() => remove(item.slug)}
                            aria-label="Retirer"
                            title="Supprimer du panier"
                            className="text-muted-foreground hover:text-destructive p-1.5 transition-colors cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{item.size || "100 ml — Eau de Parfum"}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Prix unitaire : <strong className="text-primary font-sans font-semibold">{formatCHF(item.price)}</strong>
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/60">
                        <div className="inline-flex items-center border border-gold/40 bg-background shadow-2xs">
                          <button
                            onClick={() => setQty(item.slug, item.quantity - 1)}
                            className="px-3 py-1.5 hover:bg-gold/10 text-primary transition-colors cursor-pointer"
                            aria-label="Diminuer"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="px-4 text-xs font-semibold font-sans text-primary">{item.quantity}</span>
                          <button
                            onClick={() => setQty(item.slug, item.quantity + 1)}
                            className="px-3 py-1.5 hover:bg-gold/10 text-primary transition-colors cursor-pointer"
                            aria-label="Augmenter"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] uppercase tracking-widest text-muted-foreground block">Total article</span>
                          <span className="font-sans text-xl font-bold text-primary">{formatCHF(item.price * item.quantity)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <aside className="bg-card border border-border p-6 h-fit lg:sticky lg:top-28">
                <h3 className="font-serif text-xl mb-4">Récapitulatif</h3>
                <div className="space-y-2 text-sm border-b border-border pb-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sous-total</span>
                    <span className="font-sans font-semibold text-primary">{formatCHF(subtotal)}</span>
                  </div>
                  {volumePercent > 0 && (
                    <div className="flex justify-between text-gold-dark font-medium text-xs">
                      <span>Offre multi-parfums (-{volumePercent}%)</span>
                      <span className="font-sans font-semibold">-{formatCHF(volumeDiscount)}</span>
                    </div>
                  )}
                  {appliedCoupon && couponDiscount > 0 && (
                    <div className="flex justify-between text-gold-dark font-medium text-xs">
                      <span>Remise code ({appliedCoupon.code})</span>
                      <span className="font-sans font-semibold">-{formatCHF(couponDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Livraison (Suisse)</span>
                    <span className="text-gold font-sans font-semibold">
                      {shipping === 0 ? "Offerte" : formatCHF(shipping)}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between pt-4 text-lg">
                  <span className="font-serif">Total</span>
                  <span className="font-sans font-bold text-xl text-primary">{formatCHF(grandTotal)}</span>
                </div>
                <Link
                  to="/commande"
                  className="mt-6 block text-center w-full bg-primary text-primary-foreground py-4 text-xs uppercase tracking-[0.2em] hover:bg-primary/90"
                >
                  Passer commande
                </Link>
                <Link
                  to="/boutique"
                  className="mt-3 block text-center w-full border border-border py-3 text-xs uppercase tracking-[0.2em] hover:border-gold"
                >
                  Continuer mes achats
                </Link>
              </aside>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
