import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { SectionTitle } from "@/components/SectionTitle";
import { COLLECTIONS, productsByCollection, type Collection, type Product } from "@/data/products";

export const Route = createFileRoute("/collections/$slug")({
  loader: ({ params }) => {
    const collection = COLLECTIONS.find((c) => c.slug === (params.slug as Collection));
    if (!collection) throw notFound();
    const products = productsByCollection(params.slug as Collection);
    return { collection, products };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.collection.label} — El Shaddai Fragrances` },
          { name: "description", content: loaderData.collection.description },
          { property: "og:title", content: `Collection ${loaderData.collection.label}` },
          { property: "og:description", content: loaderData.collection.description },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center">
      <Link to="/collections" className="text-gold">Voir toutes les collections</Link>
    </div>
  ),
  component: CollectionPage,
});

function CollectionPage() {
  const { collection, products } = Route.useLoaderData();
  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar />
      <Header />
      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <SectionTitle
          eyebrow="Collection"
          title={collection.label}
          subtitle={collection.description}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((p: Product) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
