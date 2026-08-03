import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { SectionTitle } from "@/components/SectionTitle";
import { PerfumeQuizDialog } from "@/components/PerfumeQuizDialog";
import { BRANDS, COLLECTIONS, PRODUCTS, type Brand, type Collection } from "@/data/products";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/boutique/")({
  head: () => ({
    meta: [
      { title: "Boutique — El Shaddai Fragrances" },
      { name: "description", content: "Tous nos parfums : eaux de parfum, extraits, collections orientales, florales et boisées." },
      { property: "og:title", content: "Boutique — El Shaddai Fragrances" },
      { property: "og:description", content: "Découvrez notre catalogue complet de parfums d'exception." },
    ],
    links: [{ rel: "canonical", href: "/boutique" }],
  }),
  component: Boutique,
});

function Boutique() {
  const [quizOpen, setQuizOpen] = useState(false);
  const [filter, setFilter] = useState<Collection | "all">("all");
  const [brand, setBrand] = useState<Brand | "all">("all");
  const [sort, setSort] = useState<"default" | "price-asc" | "price-desc">("default");

  let list = PRODUCTS;
  if (brand !== "all") list = list.filter((p) => p.brand === brand);
  if (filter !== "all") list = list.filter((p) => p.collection === filter);
  if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
  if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);

  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar />
      <Header />
      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <SectionTitle
          eyebrow="La boutique"
          title="Tous les parfums"
          subtitle="Découvrez l'ensemble de nos créations, classées par famille olfactive."
        />

        {/* Quiz Banner inside Boutique */}
        <div className="bg-gold/10 border border-gold/30 p-4 sm:p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="p-3 bg-gold/20 shrink-0 hidden sm:block">
              <Sparkles className="h-6 w-6 text-gold-dark" />
            </div>
            <div>
              <p className="font-serif text-lg text-primary">Besoin d'aide pour choisir votre parfum ?</p>
              <p className="text-xs text-muted-foreground mt-0.5">Répondez à 3 questions et obtenez des recommandations sur-mesure.</p>
            </div>
          </div>
          <button
            onClick={() => setQuizOpen(true)}
            className="shrink-0 bg-primary text-primary-foreground px-6 py-3 text-xs uppercase tracking-[0.18em] hover:bg-primary/90 transition-colors inline-flex items-center gap-2 cursor-pointer font-medium"
          >
            <Sparkles className="h-3.5 w-3.5 text-gold" /> Quiz Olfactif
          </button>
        </div>

        <div className="flex flex-col gap-4 mb-10 border-y border-border py-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground mr-2">Marque</span>
            <button
              onClick={() => setBrand("all")}
              className={`text-xs uppercase tracking-[0.18em] px-4 py-2 border transition-colors ${
                brand === "all"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border hover:border-gold"
              }`}
            >
              Toutes
            </button>
            {BRANDS.map((b) => (
              <button
                key={b.slug}
                onClick={() => setBrand(b.slug)}
                className={`text-xs uppercase tracking-[0.18em] px-4 py-2 border transition-colors ${
                  brand === b.slug
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border hover:border-gold"
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground mr-2">Famille</span>
              <button
                onClick={() => setFilter("all")}
                className={`text-xs uppercase tracking-[0.18em] px-4 py-2 border transition-colors ${
                  filter === "all"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border hover:border-gold"
                }`}
              >
                Toutes
              </button>
              {COLLECTIONS.map((c) => (
                <button
                  key={c.slug}
                  onClick={() => setFilter(c.slug)}
                  className={`text-xs uppercase tracking-[0.18em] px-4 py-2 border transition-colors ${
                    filter === c.slug
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border hover:border-gold"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              className="text-xs uppercase tracking-[0.18em] px-4 py-2 border border-border bg-background"
            >
              <option value="default">Tri par défaut</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
            </select>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mb-6">{list.length} parfums</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {list.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </main>
      <Footer />
      <PerfumeQuizDialog open={quizOpen} onOpenChange={setQuizOpen} />
    </div>
  );
}
