import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { SectionTitle } from "@/components/SectionTitle";
import { PerfumeQuizDialog } from "@/components/PerfumeQuizDialog";
import { PRODUCTS, COLLECTIONS, BRANDS } from "@/data/products";
import heroImg from "@/assets/perfume-hero.jpg";
import { ArrowRight, Sparkles, Truck, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "El Shaddai Fragrances — Parfums d'exception en Suisse" },
      {
        name: "description",
        content:
          "Découvrez la maison El Shaddai : eaux de parfum, extraits et collections orientales. Livraison en Suisse, commande en quelques clics.",
      },
      { property: "og:title", content: "El Shaddai Fragrances" },
      {
        property: "og:description",
        content: "Parfums d'exception inspirés des plus belles traditions orientales.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const [quizOpen, setQuizOpen] = useState(false);
  const newProducts = PRODUCTS.filter((p) => p.isNew).slice(0, 4);
  const bestSellers = PRODUCTS.filter((p) => p.isBestSeller).slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar />
      <Header />

      <main className="flex-1">
        {/* HERO */}
        <section className="relative overflow-hidden bg-secondary/30">
          <div className="absolute inset-0">
            <img
              src={heroImg}
              alt="Flacon de parfum El Shaddai"
              className="h-full w-full object-cover opacity-90"
              width={1920}
              height={1080}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ivory/90 via-ivory/40 to-transparent" />
          </div>
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-44">
            <div className="max-w-xl animate-fade-in">
              <p className="text-[11px] tracking-[0.35em] uppercase text-gold-dark mb-5">
                Nouvelle Collection 2026
              </p>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-primary leading-[1.05]">
                L'élégance d'un sillage,<br />
                <span className="italic text-gold-dark">la signature d'une maison.</span>
              </h1>
              <p className="mt-6 text-base text-primary/80 max-w-md leading-relaxed">
                Des parfums d'exception, composés avec les matières les plus nobles de la haute parfumerie orientale.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  to="/boutique"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 text-xs uppercase tracking-[0.2em] hover:bg-primary/90 transition-all hover:gap-3"
                >
                  Découvrir <ArrowRight className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => setQuizOpen(true)}
                  className="inline-flex items-center gap-2 border border-gold text-gold-dark bg-gold/10 px-8 py-4 text-xs uppercase tracking-[0.2em] hover:bg-gold hover:text-primary transition-colors cursor-pointer font-medium"
                >
                  <Sparkles className="h-4 w-4" /> Trouver mon parfum
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* USP STRIP */}
        <section className="border-y border-border bg-card">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            {[
              { icon: Truck, title: "Livraison offerte", text: "dès 80 CHF en Suisse" },
              { icon: Sparkles, title: "Échantillons offerts", text: "à chaque commande" },
              { icon: ShieldCheck, title: "Parfums authentiques", text: "matières nobles sélectionnées" },
            ].map((item) => (
              <div key={item.title} className="flex items-center justify-center gap-4">
                <item.icon className="h-7 w-7 text-gold" strokeWidth={1.2} />
                <div className="text-left">
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* NEW */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <SectionTitle
            eyebrow="Nouveautés"
            title="Dernières créations"
            subtitle="Quatre signatures inédites, fraîchement composées dans nos ateliers."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newProducts.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/nouveautes"
              className="inline-flex items-center gap-2 text-sm tracking-[0.18em] uppercase text-primary hover:text-gold transition-colors"
            >
              Voir toutes les nouveautés <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* COLLECTIONS */}
        <section className="bg-card border-y border-border py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionTitle
              eyebrow="Nos univers"
              title="Collections"
              subtitle="Explorez nos familles olfactives, des sillages chauds aux notes fraîches et lumineuses."
            />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {COLLECTIONS.map((c) => (
                <Link
                  key={c.slug}
                  to="/collections/$slug"
                  params={{ slug: c.slug }}
                  className="group relative overflow-hidden border border-border bg-background p-8 text-center transition-all hover:border-gold hover:shadow-lg"
                >
                  <div className="absolute inset-x-0 -top-1 h-px bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
                  <p className="font-display text-lg tracking-[0.18em] uppercase text-primary group-hover:text-gold-dark transition-colors">
                    {c.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    {c.description.split(",")[0]}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* BRANDS */}
        <section className="bg-secondary/40 border-b border-border py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <SectionTitle
              eyebrow="Nos Maisons"
              title="Marques d'Exception"
              subtitle="Découvrez les plus prestigieuses maisons de parfumerie orientale."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {BRANDS.map((b) => {
                const count = PRODUCTS.filter((p) => p.brand === b.slug).length;
                return (
                  <Link
                    key={b.slug}
                    to="/boutique"
                    className="group border border-border bg-card p-8 hover:border-gold transition-all shadow-sm hover:shadow-md"
                  >
                    <h3 className="font-display text-2xl tracking-[0.2em] text-primary group-hover:text-gold transition-colors">
                      {b.label}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-2 uppercase tracking-[0.15em]">
                      {count} parfums d'exception
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* BEST SELLERS */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <SectionTitle
            eyebrow="Les plus aimés"
            title="Best-sellers"
            subtitle="Les sillages qui ont conquis notre clientèle."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>

        {/* QUIZ BANNER */}
        <section className="bg-card border-y border-gold/30 py-20 relative overflow-hidden">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
            <span className="inline-flex items-center gap-2 text-gold-dark text-xs uppercase tracking-[0.25em] font-medium bg-gold/10 border border-gold/30 px-4 py-1.5">
              <Sparkles className="h-4 w-4" /> Assistant Olfactif Personnalisé
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-primary">
              Vous hésitez sur le choix de votre parfum ?
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Répondez à 3 questions simples et découvrez en quelques secondes les créations El Shaddai ajustées a vos goûts.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setQuizOpen(true)}
                className="bg-primary text-primary-foreground px-8 py-4 text-xs uppercase tracking-[0.2em] hover:bg-primary/90 transition-all hover:scale-105 inline-flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <Sparkles className="h-4 w-4 text-gold" /> Lancer le quiz olfactif
              </button>
            </div>
          </div>
        </section>

        {/* QUOTE */}
        <section className="bg-primary text-primary-foreground py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-gold text-2xl mb-6">✦</p>
            <p className="font-serif text-2xl sm:text-3xl italic leading-relaxed">
              « Le parfum est cette goutte invisible qui devient inoubliable. »
            </p>
            <div className="gold-rule max-w-[80px] mx-auto mt-8" />
          </div>
        </section>
      </main>

      <Footer />
      <PerfumeQuizDialog open={quizOpen} onOpenChange={setQuizOpen} />
    </div>
  );
}
