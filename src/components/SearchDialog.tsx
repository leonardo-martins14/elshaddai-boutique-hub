import { Link } from "@tanstack/react-router";
import { Search as SearchIcon, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PRODUCTS } from "@/data/products";
import { formatCHF } from "@/lib/cart-store";

export function SearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!open) setQ("");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return PRODUCTS.filter((p) => {
      const hay = `${p.name} ${p.brandLabel} ${p.subtitle} ${p.collectionLabel} ${p.gender}`.toLowerCase();
      return hay.includes(term);
    }).slice(0, 12);
  }, [q]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-primary/40 backdrop-blur-sm flex items-start justify-center pt-20 px-4"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="w-full max-w-2xl bg-background border border-border shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-border px-4">
          <SearchIcon className="h-5 w-5 text-muted-foreground" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher un parfum, une marque, une note…"
            className="flex-1 py-5 bg-transparent outline-none text-base placeholder:text-muted-foreground"
          />
          <button
            onClick={() => onOpenChange(false)}
            aria-label="Fermer"
            className="p-2 hover:text-gold"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {q.trim() === "" ? (
            <p className="text-xs text-muted-foreground px-6 py-8 text-center tracking-wide">
              Commencez à taper pour explorer notre catalogue.
            </p>
          ) : results.length === 0 ? (
            <p className="text-xs text-muted-foreground px-6 py-8 text-center tracking-wide">
              Aucun parfum ne correspond à « {q} ».
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {results.map((p) => (
                <li key={p.slug}>
                  <Link
                    to="/boutique/$slug"
                    params={{ slug: p.slug }}
                    onClick={() => onOpenChange(false)}
                    className="flex items-center gap-4 px-4 py-3 hover:bg-secondary/40 transition-colors"
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      className="h-14 w-14 object-cover bg-secondary/40"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-serif text-base text-primary truncate">
                        {p.name}
                      </p>
                      <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground truncate">
                        {p.brandLabel} • {p.collectionLabel}
                      </p>
                    </div>
                    <span className="text-sm font-medium">{formatCHF(p.price)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
