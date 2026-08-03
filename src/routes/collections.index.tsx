import { createFileRoute, Link } from "@tanstack/react-router";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SectionTitle } from "@/components/SectionTitle";
import { COLLECTIONS, productsByCollection } from "@/data/products";

export const Route = createFileRoute("/collections/")({
  head: () => ({
    meta: [
      { title: "Collections — El Shaddai Fragrances" },
      { name: "description", content: "Nos familles olfactives : Oriental, Floral, Boisé, Ambré et Frais." },
      { property: "og:title", content: "Collections — El Shaddai" },
      { property: "og:description", content: "Explorez nos univers olfactifs." },
    ],
    links: [{ rel: "canonical", href: "/collections" }],
  }),
  component: Collections,
});

function Collections() {
  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar />
      <Header />
      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <SectionTitle
          eyebrow="Nos univers"
          title="Collections"
          subtitle="Cinq familles olfactives pour explorer toute la richesse de notre maison."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {COLLECTIONS.map((c) => {
            const count = productsByCollection(c.slug).length;
            const sample = productsByCollection(c.slug)[0];
            return (
              <Link
                key={c.slug}
                to="/collections/$slug"
                params={{ slug: c.slug }}
                className="group relative border border-border bg-card overflow-hidden flex flex-col sm:flex-row hover:border-gold transition-colors"
              >
                <div className="sm:w-1/2 aspect-square sm:aspect-auto overflow-hidden bg-secondary/40">
                  {sample && (
                    <img
                      src={sample.image}
                      alt={c.label}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  )}
                </div>
                <div className="sm:w-1/2 p-8 flex flex-col justify-center">
                  <p className="text-[11px] tracking-[0.3em] uppercase text-gold mb-2">
                    {count} parfums
                  </p>
                  <h3 className="font-serif text-3xl text-primary group-hover:text-gold-dark transition-colors">
                    {c.label}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                    {c.description}
                  </p>
                  <span className="mt-6 text-xs uppercase tracking-[0.2em] text-primary inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                    Découvrir →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
