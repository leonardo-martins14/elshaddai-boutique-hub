import { createFileRoute } from "@tanstack/react-router";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { SectionTitle } from "@/components/SectionTitle";
import { PRODUCTS } from "@/data/products";

export const Route = createFileRoute("/best-sellers")({
  head: () => ({
    meta: [
      { title: "Best-sellers — El Shaddai Fragrances" },
      { name: "description", content: "Les parfums les plus aimés de la maison El Shaddai." },
      { property: "og:title", content: "Best-sellers — El Shaddai" },
      { property: "og:description", content: "Nos parfums les plus aimés." },
    ],
    links: [{ rel: "canonical", href: "/best-sellers" }],
  }),
  component: () => {
    const list = PRODUCTS.filter((p) => p.isBestSeller);
    return (
      <div className="min-h-screen flex flex-col">
        <AnnouncementBar />
        <Header />
        <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <SectionTitle
            eyebrow="Les plus aimés"
            title="Best-sellers"
            subtitle="Les sillages qui ont conquis le cœur de notre clientèle."
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
