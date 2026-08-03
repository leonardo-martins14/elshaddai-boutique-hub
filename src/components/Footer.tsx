import { Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <div className="bg-background inline-block p-3 rounded">
              <Logo className="h-16 w-16" />
            </div>
            <p className="mt-4 font-display tracking-[0.2em] text-gold">EL SHADDAI</p>
            <p className="text-xs tracking-[0.3em] uppercase text-primary-foreground/60 mt-1">
              Fragrances
            </p>
            <p className="text-sm text-primary-foreground/70 mt-4 leading-relaxed">
              Parfums d'exception inspirés des plus belles traditions de la haute parfumerie orientale.
            </p>
          </div>

          <div>
            <h4 className="font-display text-sm tracking-[0.2em] text-gold mb-5 uppercase">
              Boutique
            </h4>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li><Link to="/boutique" className="hover:text-gold transition-colors">Tous les parfums</Link></li>
              <li><Link to="/nouveautes" className="hover:text-gold transition-colors">Nouveautés</Link></li>
              <li><Link to="/best-sellers" className="hover:text-gold transition-colors">Best-sellers</Link></li>
              <li><Link to="/collections" className="hover:text-gold transition-colors">Collections</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm tracking-[0.2em] text-gold mb-5 uppercase">
              Maison
            </h4>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li><Link to="/a-propos" className="hover:text-gold transition-colors">À propos</Link></li>
              <li><Link to="/contact" className="hover:text-gold transition-colors">Contact</Link></li>
              <li><Link to="/panier" className="hover:text-gold transition-colors">Mon panier</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm tracking-[0.2em] text-gold mb-5 uppercase">
              Nous joindre
            </h4>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Suisse
              </li>
              <li>
                <Link to="/contact" className="hover:text-gold transition-colors">
                  Formulaire de contact
                </Link>
              </li>
            </ul>
          </div>

        </div>

        <div className="gold-rule mt-12" />
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-primary-foreground/60">
          <p>© {new Date().getFullYear()} El Shaddai Fragrances. Tous droits réservés.</p>
          <p className="tracking-widest uppercase">Fait avec passion en Suisse</p>
        </div>
      </div>
    </footer>
  );
}
