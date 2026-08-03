import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Minus, Plus, ChevronRight } from "lucide-react";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { getProduct, PRODUCTS } from "@/data/products";
import { formatCHF, useCart } from "@/lib/cart-store";
import { toast } from "sonner";

export const Route = createFileRoute("/boutique/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — El Shaddai Fragrances` },
          { name: "description", content: loaderData.product.description },
          { property: "og:title", content: `${loaderData.product.name} — El Shaddai` },
          { property: "og:description", content: loaderData.product.description },
          { property: "og:image", content: loaderData.product.image },
          { property: "og:type", content: "product" },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar />
      <Header />
      <div className="flex-1 flex items-center justify-center py-32">
        <div className="text-center">
          <h1 className="font-serif text-3xl">Parfum introuvable</h1>
          <Link to="/boutique" className="text-gold mt-4 inline-block">
            Retour à la boutique
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const [qty, setQty] = useState(1);
  const add = useCart((s) => s.add);

  const related = PRODUCTS.filter(
    (p) => p.collection === product.collection && p.slug !== product.slug,
  ).slice(0, 4);

  const handleAdd = () => {
    add(product, qty);
    toast.success(`${product.name} ajouté au panier`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        {/* Breadcrumb */}
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 text-xs text-muted-foreground flex items-center gap-2">
          <Link to="/" className="hover:text-gold">Accueil</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/boutique" className="hover:text-gold">Boutique</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-primary">{product.name}</span>
        </nav>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            <div className="product-card relative bg-secondary/30 p-6 sm:p-10">
              <span className="frame-corner tl" />
              <span className="frame-corner tr" />
              <span className="frame-corner bl" />
              <span className="frame-corner br" />
              <div className="bottle-wrap aspect-[3/4]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                  width={800}
                  height={1024}
                />
                <span className="shine" />
              </div>
            </div>

            <div className="flex flex-col">
              <p className="text-[11px] tracking-[0.3em] uppercase text-gold mb-3">
                {product.collectionLabel}
              </p>
              <h1 className="font-serif text-4xl sm:text-5xl text-primary">{product.name}</h1>
              <p className="mt-2 text-muted-foreground">
                {product.subtitle} • {product.size}
              </p>
              <p className="font-serif text-3xl mt-6">{formatCHF(product.price)}</p>

              <div className="gold-rule my-8" />

              <p className="text-primary/80 leading-relaxed">{product.description}</p>

              <div className="mt-8 space-y-4">
                <h3 className="text-[11px] tracking-[0.3em] uppercase text-gold">
                  Pyramide olfactive
                </h3>
                <dl className="space-y-3 text-sm">
                  <div className="flex gap-3">
                    <dt className="w-24 text-muted-foreground uppercase tracking-wider text-xs pt-0.5">Tête</dt>
                    <dd>{product.notes.tete.join(", ")}</dd>
                  </div>
                  <div className="flex gap-3">
                    <dt className="w-24 text-muted-foreground uppercase tracking-wider text-xs pt-0.5">Cœur</dt>
                    <dd>{product.notes.coeur.join(", ")}</dd>
                  </div>
                  <div className="flex gap-3">
                    <dt className="w-24 text-muted-foreground uppercase tracking-wider text-xs pt-0.5">Fond</dt>
                    <dd>{product.notes.fond.join(", ")}</dd>
                  </div>
                </dl>
              </div>

              <div className="gold-rule my-8" />

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="inline-flex items-center border border-primary h-14">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="px-4 h-full hover:bg-secondary"
                    aria-label="Diminuer"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-6 font-medium">{qty}</span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="px-4 h-full hover:bg-secondary"
                    aria-label="Augmenter"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <button
                  onClick={handleAdd}
                  className="flex-1 bg-primary text-primary-foreground h-14 px-8 text-xs uppercase tracking-[0.2em] hover:bg-primary/90 transition-colors"
                >
                  Ajouter au panier — {formatCHF(product.price * qty)}
                </button>
              </div>

              <p className="text-xs text-muted-foreground mt-6">
                Livraison offerte dès 80.00 CHF • Échantillons offerts • Paiement 100% sécurisé (TWINT, Virement, Carte)
              </p>
            </div>
          </div>

          {related.length > 0 && (
            <div className="mt-24">
              <h2 className="font-serif text-2xl sm:text-3xl text-primary mb-8 text-center">
                Vous aimerez aussi
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {related.map((p) => (
                  <ProductCard key={p.slug} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
