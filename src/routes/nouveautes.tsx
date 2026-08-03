import { createFileRoute } from "@tanstack/react-router";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { SectionTitle } from "@/components/SectionTitle";
import { PRODUCTS } from "@/data/products";

export const Route = createFileRoute("/nouveautes")({
  head: () => ({
    meta: [
      { title: "Nouveautés — El Shaddai Fragrances" },
      { name: "description", content: "Les dernières créations de la maison El Shaddai Fragrances." },
      { property: "og:title", content: "Nouveautés — El Shaddai" },
      { property: "og:description", content: "Découvrez nos dernières créations parfumées." },
    ],
    links: [{ rel: "canonical", href: "/nouveautes" }],
  }),
  component: () => {
    const list = PRODUCTS.filter((p) => p.isNew);
    return (
      <div className="min-h-screen flex flex-col">
        <AnnouncementBar />
        <Header />
        <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <SectionTitle
            eyebrow="Fraîchement composés"
            title="Nouveautés"
            subtitle="Nos toutes dernières créations, à découvrir en exclusivité."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {list.map((p) => <ProductCard key={p.slug} product={p} />)}
          </div>
        </main>
        <Footer />
      </div>
    );
  },
});
