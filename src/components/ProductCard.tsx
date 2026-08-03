import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import type { Product } from "@/data/products";
import { formatCHF, useCart } from "@/lib/cart-store";
import { toast } from "sonner";

export function ProductCard({ product }: { product: Product }) {
  const add = useCart((s) => s.add);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    add(product);
    toast.success(`${product.name} ajouté au panier`);
  };

  return (
    <Link
      to="/boutique/$slug"
      params={{ slug: product.slug }}
      className="product-card group block bg-card border border-transparent hover:border-gold/30 transition-colors duration-500 p-4 sm:p-6"
    >
      <span className="frame-corner tl" />
      <span className="frame-corner tr" />
      <span className="frame-corner bl" />
      <span className="frame-corner br" />

      <div className="bottle-wrap aspect-[3/4] bg-secondary/40 relative mb-5 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        {product.imageHover && (
          <img
            src={product.imageHover}
            alt={`${product.name} — packaging`}
            className="absolute inset-0 h-full w-full object-cover opacity-0 group-hover:opacity-100"
            style={{ transition: "opacity 0.5s, transform 2s cubic-bezier(0, 0, 0.44, 1.18)" }}
            loading="lazy"
          />
        )}
        <span className="shine" />
        {product.isNew && (
          <span className="absolute top-3 left-3 bg-gold text-primary text-[10px] tracking-[0.18em] uppercase px-2 py-1 z-10">
            Nouveau
          </span>
        )}
        {product.isBestSeller && !product.isNew && (
          <span className="absolute top-3 left-3 bg-primary text-gold text-[10px] tracking-[0.18em] uppercase px-2 py-1 z-10">
            Best-seller
          </span>
        )}
      </div>

      <div className="text-center space-y-1">
        <p className="text-[10px] tracking-[0.22em] uppercase text-muted-foreground">
          {product.collectionLabel}
        </p>
        <h3 className="font-serif text-xl text-primary group-hover:text-gold transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-muted-foreground">
          {product.subtitle} • {product.size}
        </p>
        <p className="font-medium pt-1">{formatCHF(product.price)}</p>
      </div>

      <div className="add-cta pt-4">
        <button
          onClick={handleAdd}
          className="w-full border border-primary bg-background text-primary hover:bg-primary hover:text-primary-foreground transition-colors text-xs tracking-[0.18em] uppercase py-3 inline-flex items-center justify-center gap-2"
        >
          <Plus className="h-3.5 w-3.5" />
          Ajouter au panier
        </button>
      </div>
    </Link>
  );
}
