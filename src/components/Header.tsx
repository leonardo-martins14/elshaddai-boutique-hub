import { Link } from "@tanstack/react-router";
import { Menu, Search, ShoppingBag, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { useCart } from "@/lib/cart-store";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CartDrawer } from "./CartDrawer";
import { SearchDialog } from "./SearchDialog";
import { PerfumeQuizDialog } from "./PerfumeQuizDialog";

const NAV = [
  { to: "/boutique", label: "Boutique" },
  { to: "/nouveautes", label: "Nouveautés" },
  { to: "/best-sellers", label: "Best-sellers" },
  { to: "/collections", label: "Collections" },
  { to: "/a-propos", label: "À propos" },
  { to: "/contact", label: "Contact" },
];

export function Header() {
  const items = useCart((s) => s.items);
  const totalItems = (items || []).reduce((sum, item) => sum + (item.quantity || 0), 0);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-background"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger className="lg:hidden p-2 -ml-2" aria-label="Menu">
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="left" className="w-80 bg-background">
              <div className="flex flex-col gap-1 pt-8">
                <Logo className="h-14 w-14 mb-6" />
                {NAV.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="text-base py-3 border-b border-border tracking-wide font-serif"
                  >
                    {item.label}
                  </Link>
                ))}
                <button
                  onClick={() => setQuizOpen(true)}
                  className="mt-6 flex items-center justify-center gap-2 border border-gold text-gold-dark py-3 px-4 text-xs uppercase tracking-[0.18em] font-medium hover:bg-gold/10 transition-colors"
                >
                  <Sparkles className="h-4 w-4" /> Quiz Olfactif
                </button>
                <Link to="/contact" className="text-sm mt-4 text-muted-foreground">
                  Nous contacter
                </Link>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 lg:flex-1">
            <Logo className="h-12 w-12 lg:h-14 lg:w-14" />
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="font-display text-lg tracking-[0.2em] text-primary">
                EL SHADDAI
              </span>
              <span className="text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
                Fragrances
              </span>
            </div>
          </Link>

          {/* Nav */}
          <nav className="hidden lg:flex items-center gap-8 lg:flex-1 justify-center">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-xs uppercase tracking-[0.18em] text-primary hover:text-gold transition-colors relative group"
                activeProps={{ className: "text-gold" }}
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-gold transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-2 lg:flex-1 justify-end">
            <button
              onClick={() => setQuizOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 border border-gold/40 text-gold-dark hover:bg-gold/10 text-[10px] uppercase tracking-[0.18em] transition-colors font-medium cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Quiz Olfactif
            </button>
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Rechercher"
              className="inline-flex p-2 hover:text-gold transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>
            <button
              onClick={() => setOpen(true)}
              aria-label="Panier"
              className="relative p-2 hover:text-gold transition-colors"
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1.5 rounded-full bg-gold text-primary text-[11px] font-bold flex items-center justify-center shadow-md border border-primary/20">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
      <CartDrawer open={open} onOpenChange={setOpen} />
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
      <PerfumeQuizDialog open={quizOpen} onOpenChange={setQuizOpen} />
    </header>
  );
}

export { X };
