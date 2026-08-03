import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Smartphone, Building2, Banknote, ShieldCheck, Mail, Printer, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { formatCHF, useCart } from "@/lib/cart-store";
import { toast } from "sonner";
import { TwintQrCode } from "@/components/TwintQrCode";

type LastOrder = {
  orderId: string;
  date: string;
  client: {
    nom: string;
    email: string;
    telephone: string;
    adresse: string;
    codePostal: string;
    ville: string;
    pays: string;
    modePaiement: string;
    notes?: string;
  };
  items: { slug: string; name: string; size: string; price: number; image: string; quantity: number }[];
  subtotal: number;
  shipping: number;
  grandTotal: number;
};

export const Route = createFileRoute("/commande_/confirmation")({
  head: () => ({
    meta: [
      { title: "Commande confirmée — El Shaddai Fragrances" },
      { name: "description", content: "Merci pour votre commande." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ConfirmationPage,
});

function ConfirmationPage() {
  const [order, setOrder] = useState<LastOrder | null>(null);
  const [mailto, setMailto] = useState<string | null>(null);
  const clear = useCart((s) => s.clear);

  useEffect(() => {
    const rawOrder = localStorage.getItem("elshaddai-last-order");
    const rawMailto = localStorage.getItem("elshaddai-last-mailto");
    
    if (rawOrder) {
      try {
        setOrder(JSON.parse(rawOrder));
        // Vider le panier uniquement une fois arrivé sur la page de confirmation !
        clear();
      } catch (e) {
        console.error(e);
      }
    }
    if (rawMailto) {
      setMailto(rawMailto);
    }
  }, [clear]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copié dans le presse-papier !`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar />
      <Header />
      <main className="flex-1 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gold/15 text-gold-dark mb-6">
            <Check className="h-10 w-10" strokeWidth={1.5} />
          </div>
          <p className="text-[11px] tracking-[0.3em] uppercase text-gold mb-2">Merci pour votre confiance</p>
          <h1 className="font-serif text-3xl sm:text-4xl text-primary">
            {order ? `Commande #${order.orderId} enregistrée` : "Votre commande a été reçue !"}
          </h1>
          <div className="gold-rule max-w-[80px] mx-auto my-6" />
          <p className="text-muted-foreground leading-relaxed text-sm">
            Un email récapitulatif a été préparé pour <strong className="text-primary">contact@elshaddai-boutique.ch</strong>.
            Nous traitons votre demande dans les plus brefs délais.
          </p>
        </div>

        {order && (
          <div className="mt-12 space-y-8">
            {/* Delivery banner */}
            <div className="bg-gold/10 border border-gold/30 p-4 text-center text-xs space-y-1">
              <p className="font-medium text-gold-dark text-sm">🇨🇭 Expédition Express La Poste Suisse</p>
              <p className="text-muted-foreground">
                Votre colis sera soigneusement emballé et expédié sous 24h. Réception sous 24h à 48h jours ouvrés.
              </p>
            </div>

            {/* Payment instruction box */}
            <div className="bg-card border border-gold/40 p-6 sm:p-8 space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-gold text-primary text-[10px] uppercase tracking-[0.2em] px-3 py-1 font-medium">
                Paiement
              </div>

              {order.client.modePaiement === "twint" && (
                <TwintQrCode amount={order.grandTotal} orderId={order.orderId} />
              )}

              {order.client.modePaiement === "iban" && (
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gold/10 rounded-full shrink-0">
                    <Building2 className="h-6 w-6 text-gold-dark" />
                  </div>
                  <div className="space-y-2 text-sm flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif text-lg text-primary">Règlement par Virement Bancaire</h4>
                      <button
                        onClick={() => handleCopy("CH76 0000 0000 0000 0000 0", "IBAN")}
                        className="bg-gold/15 hover:bg-gold/30 text-gold-dark px-3 py-1 text-xs uppercase tracking-wider font-medium transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Copy className="h-3 w-3" /> Copier IBAN
                      </button>
                    </div>
                    <p className="text-muted-foreground">
                      Veuillez effectuer un virement de <strong className="text-primary">{formatCHF(order.grandTotal)}</strong> vers le compte :
                    </p>
                    <div className="bg-background p-3 border border-border mt-2 font-sans text-xs space-y-1 font-medium">
                      <p>Titulaire : <strong>El Shaddai Fragrances</strong></p>
                      <p>IBAN : <strong className="text-gold-dark tracking-wider">CH76 0000 0000 0000 0000 0</strong></p>
                      <p>Motif : <strong>Commande #{order.orderId}</strong></p>
                    </div>
                  </div>
                </div>
              )}

              {order.client.modePaiement === "carte" && (
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gold/10 rounded-full shrink-0">
                    <ShieldCheck className="h-6 w-6 text-gold-dark" />
                  </div>
                  <div className="space-y-1 text-sm">
                    <h4 className="font-serif text-lg text-primary">Paiement par Carte bancaire</h4>
                    <p className="text-muted-foreground">
                      Coordonnées enregistrées avec succès. Votre paiement de <strong className="text-primary">{formatCHF(order.grandTotal)}</strong> a été validé sous chiffrement SSL 256-bits.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Order details grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Shipping address */}
              <div className="bg-card border border-border p-6 space-y-2 text-sm">
                <h4 className="font-serif text-lg text-primary border-b border-border pb-2">Adresse de livraison</h4>
                <p className="font-medium text-primary">{order.client.nom}</p>
                <p className="text-muted-foreground">{order.client.adresse}</p>
                <p className="text-muted-foreground">{order.client.codePostal} {order.client.ville}, {order.client.pays}</p>
                <p className="text-xs text-muted-foreground pt-2">Tél : {order.client.telephone} • Email : {order.client.email}</p>
              </div>

              {/* Order breakdown */}
              <div className="bg-card border border-border p-6 space-y-3 text-sm">
                <h4 className="font-serif text-lg text-primary border-b border-border pb-2">Résumé financier</h4>
                <div className="flex justify-between text-muted-foreground text-xs">
                  <span>Sous-total articles</span>
                  <span>{formatCHF(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground text-xs">
                  <span>Frais de livraison (Suisse)</span>
                  <span>{order.shipping === 0 ? <strong className="text-gold-dark uppercase tracking-wider text-[10px]">Offerte</strong> : formatCHF(order.shipping)}</span>
                </div>
                <div className="flex justify-between font-serif text-lg font-medium text-primary pt-2 border-t border-border">
                  <span>Total récapitulatif</span>
                  <span>{formatCHF(order.grandTotal)}</span>
                </div>
              </div>
            </div>

            {/* Item list */}
            <div className="bg-card border border-border p-6">
              <h4 className="font-serif text-lg text-primary border-b border-border pb-4 mb-4">Articles commandés</h4>
              <ul className="divide-y divide-border">
                {order.items.map((item) => (
                  <li key={item.slug} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img src={item.image} alt={item.name} className="h-14 w-12 object-cover bg-secondary" />
                      <div>
                        <p className="font-serif text-base text-primary">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.size} × {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-serif font-medium">{formatCHF(item.price * item.quantity)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="mt-12 text-center flex flex-wrap justify-center gap-4">
          <button
            onClick={handlePrint}
            className="border border-gold text-gold-dark font-medium px-6 py-4 text-xs uppercase tracking-[0.2em] hover:bg-gold/10 transition-colors inline-flex items-center gap-2 cursor-pointer"
          >
            <Printer className="h-4 w-4" /> Imprimer / PDF
          </button>
          {mailto && (
            <a
              href={mailto}
              className="bg-gold text-primary font-medium px-8 py-4 text-xs uppercase tracking-[0.2em] hover:bg-gold-light transition-colors inline-flex items-center gap-2"
            >
              <Mail className="h-4 w-4" /> Envoyer par e-mail
            </a>
          )}
          <Link to="/boutique" className="bg-primary text-primary-foreground px-8 py-4 text-xs uppercase tracking-[0.2em] hover:bg-primary/90 transition-colors">
            Continuer mes achats
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

