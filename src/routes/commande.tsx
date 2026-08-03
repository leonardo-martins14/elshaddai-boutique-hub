import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SectionTitle } from "@/components/SectionTitle";
import { formatCHF, useCart } from "@/lib/cart-store";
import { toast } from "sonner";
import { CreditCard, Banknote, Building2, Smartphone } from "lucide-react";
import { TwintQrCode } from "@/components/TwintQrCode";

export const Route = createFileRoute("/commande")({
  head: () => ({
    meta: [
      { title: "Commande — El Shaddai Fragrances" },
      { name: "description", content: "Finaliser votre commande El Shaddai Fragrances." },
    ],
  }),
  component: CommandePage,
});

const schema = z.object({
  nom: z.string().min(2, "Nom requis").max(80),
  email: z.string().min(3, "Email requis").refine((val) => val.includes("@"), "Email invalide"),
  telephone: z.string().min(6, "Téléphone requis").max(30),
  adresse: z.string().min(3, "Adresse requise").max(160),
  codePostal: z.string().min(2, "Code postal requis").max(15),
  ville: z.string().min(2, "Ville requise").max(80),
  pays: z.string().min(2).max(60),
  modePaiement: z.enum(["twint", "iban", "carte"]),
  notes: z.string().max(500).optional(),
});

type FormData = z.infer<typeof schema>;

function CommandePage() {
  const navigate = useNavigate();
  const items = useCart((s) => s.items);
  const subtotal = useCart((s) => s.totalPrice)();
  const shipping = useCart((s) => s.shippingFee)();
  const grandTotal = useCart((s) => s.grandTotal)();
  const discount = useCart((s) => s.discountAmount)();
  const appliedCoupon = useCart((s) => s.appliedCoupon);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copié dans le presse-papier !`);
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { pays: "Suisse", modePaiement: "twint" },
  });

  const selectedPayment = watch("modePaiement");

  const onSubmit = async (data: FormData) => {
    if (items.length === 0) {
      toast.error("Votre panier est vide.");
      return;
    }

    toast.loading("Confirmation de votre commande...", { id: "checkout" });

    const orderData = {
      orderId: `ELS-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toISOString(),
      client: data,
      items,
      subtotal,
      shipping,
      grandTotal,
    };

    // Guardar o resumo da encomenda para mostrar na página de confirmação
    localStorage.setItem("elshaddai-last-order", JSON.stringify(orderData));

    const lines = items
      .map(
        (i) =>
          `  • ${i.name} (${i.size}) — ${i.quantity} × ${formatCHF(i.price)} = ${formatCHF(i.price * i.quantity)}`,
      )
      .join("\n");

    const paymentLabel =
      data.modePaiement === "twint"
        ? "TWINT (077 234 23 23)"
        : data.modePaiement === "iban"
          ? "Virement Bancaire (IBAN)"
          : "Carte de Crédit (Visa / Mastercard)";

    const body = `Bonjour,

Nouvelle commande #${orderData.orderId} passée sur El Shaddai Fragrances.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CLIENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Nom        : ${data.nom}
Email      : ${data.email}
Téléphone  : ${data.telephone}

Adresse    : ${data.adresse}
             ${data.codePostal} ${data.ville}
             ${data.pays}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MODE DE PAIEMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${paymentLabel}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ARTICLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${lines}

Sous-total: ${formatCHF(subtotal)}
Livraison : ${shipping === 0 ? "Offerte (Suisse)" : formatCHF(shipping)}
TOTAL: ${formatCHF(grandTotal)}

${data.notes ? `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\nNOTES DU CLIENT\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n${data.notes}\n\n` : ""}Merci de confirmer la commande.

— ${data.nom}`;

    const subject = `Commande #${orderData.orderId} — ${data.nom} (${formatCHF(grandTotal)})`;
    const mailto = `mailto:contact@elshaddai-boutique.ch?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    try {
      localStorage.setItem("elshaddai-last-order", JSON.stringify(orderData));
      localStorage.setItem("elshaddai-last-mailto", mailto);
    } catch (e) {
      console.error("Storage error:", e);
    }

    toast.dismiss("checkout");
    toast.success("Commande enregistrée avec succès !");

    // Rediriger directement vers la page de confirmation
    navigate({ to: "/commande/confirmation" }).catch(() => {
      window.location.href = "/commande/confirmation";
    });
  };

  const onError = (errors: any) => {
    toast.dismiss("checkout");
    console.warn("Validation errors:", errors);
    toast.error("Veuillez remplir tous les champs obligatoires (*)");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar />
      <Header />
      <main className="flex-1 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
        <SectionTitle eyebrow="Étape finale" title="Finaliser la commande" />

        {items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-6">Votre panier est vide.</p>
            <Link to="/boutique" className="bg-primary text-primary-foreground px-8 py-4 text-xs uppercase tracking-[0.2em]">
              Découvrir la boutique
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit, onError)} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">
              {/* Coordonnées */}
              <div className="bg-card border border-border p-6 sm:p-8 space-y-5">
                <h3 className="font-serif text-2xl border-b border-border pb-3">1. Vos coordonnées</h3>

                <Field label="Nom complet *" error={errors.nom?.message}>
                  <input type="text" {...register("nom")} className={inputCls} placeholder="Jean Dupont" />
                </Field>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Email *" error={errors.email?.message}>
                    <input type="email" {...register("email")} className={inputCls} placeholder="jean.dupont@example.com" />
                  </Field>
                  <Field label="Téléphone *" error={errors.telephone?.message}>
                    <input type="tel" {...register("telephone")} className={inputCls} placeholder="077 328 23 23" />
                  </Field>
                </div>

                <Field label="Adresse de livraison *" error={errors.adresse?.message}>
                  <input type="text" {...register("adresse")} className={inputCls} placeholder="Rue de la Gare 12" />
                </Field>

                <div className="grid sm:grid-cols-3 gap-4">
                  <Field label="Code postal *" error={errors.codePostal?.message}>
                    <input type="text" {...register("codePostal")} className={inputCls} placeholder="1000" />
                  </Field>
                  <Field label="Ville *" error={errors.ville?.message}>
                    <input type="text" {...register("ville")} className={inputCls} placeholder="Lausanne" />
                  </Field>
                  <Field label="Pays *" error={errors.pays?.message}>
                    <input type="text" {...register("pays")} className={inputCls} />
                  </Field>
                </div>

                <Field label="Notes de livraison (optionnel)" error={errors.notes?.message}>
                  <textarea rows={2} {...register("notes")} className={inputCls + " resize-none"} placeholder="Code porte, étage..." />
                </Field>
              </div>

              {/* Mode de paiement */}
              <div className="bg-card border border-border p-6 sm:p-8 space-y-5">
                <h3 className="font-serif text-2xl border-b border-border pb-3">2. Mode de paiement</h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  {/* TWINT */}
                  <label
                    onClick={() => setValue("modePaiement", "twint")}
                    className={`cursor-pointer border p-5 flex flex-col justify-between transition-all ${
                      selectedPayment === "twint"
                        ? "border-gold bg-gold/5 shadow-sm"
                        : "border-border hover:border-gold/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Smartphone className="h-5 w-5 text-gold-dark" />
                        <span className="font-medium text-sm">TWINT</span>
                      </div>
                      <input
                        type="radio"
                        value="twint"
                        {...register("modePaiement")}
                        className="accent-gold"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">
                      Paiement instantané au <strong>077 234 23 23</strong>.
                    </p>
                  </label>

                  {/* IBAN */}
                  <label
                    onClick={() => setValue("modePaiement", "iban")}
                    className={`cursor-pointer border p-5 flex flex-col justify-between transition-all ${
                      selectedPayment === "iban"
                        ? "border-gold bg-gold/5 shadow-sm"
                        : "border-border hover:border-gold/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Building2 className="h-5 w-5 text-gold-dark" />
                        <span className="font-medium text-sm">Virement</span>
                      </div>
                      <input
                        type="radio"
                        value="iban"
                        {...register("modePaiement")}
                        className="accent-gold"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">
                      Coordonnées bancaires IBAN pour transfert.
                    </p>
                  </label>

                  {/* Carte / Stripe */}
                  <label
                    onClick={() => setValue("modePaiement", "carte")}
                    className={`cursor-pointer border p-5 flex flex-col justify-between transition-all ${
                      selectedPayment === "carte"
                        ? "border-gold bg-gold/5 shadow-sm"
                        : "border-border hover:border-gold/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-5 w-5 text-gold-dark" />
                        <span className="font-medium text-sm">Carte bancaire</span>
                      </div>
                      <input
                        type="radio"
                        value="carte"
                        {...register("modePaiement")}
                        className="accent-gold"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">
                      Formulaire sécurisé SSL (Visa, Mastercard).
                    </p>
                  </label>
                </div>

                {/* Formulaire dynamique Carte bancaire */}
                {selectedPayment === "carte" && (
                  <div className="mt-6 p-6 border border-gold/30 bg-gold/5 space-y-4 rounded-none transition-all">
                    <div className="flex items-center justify-between border-b border-gold/20 pb-3">
                      <h4 className="font-serif text-base text-primary flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-gold-dark" /> Coordonnées de carte bancaire
                      </h4>
                      <span className="text-[10px] uppercase tracking-widest bg-gold/20 text-gold-dark px-2 py-0.5 font-medium">Crypté SSL</span>
                    </div>

                    <div>
                      <label className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Numéro de carte *</label>
                      <div className="relative mt-2">
                        <input
                          type="text"
                          placeholder="4532 •••• •••• 8892"
                          maxLength={19}
                          className={inputCls}
                        />
                        <CreditCard className="absolute right-3 top-3.5 h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Expiration (MM/AA) *</label>
                        <input
                          type="text"
                          placeholder="08/28"
                          maxLength={5}
                          className={inputCls}
                        />
                      </div>
                      <div>
                        <label className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Code CVC / CVV *</label>
                        <input
                          type="text"
                          placeholder="123"
                          maxLength={4}
                          className={inputCls}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Nom sur la carte *</label>
                      <input
                        type="text"
                        placeholder="Jean Dupont"
                        className={inputCls}
                      />
                    </div>
                  </div>
                )}

                {/* Coordonnées bancaires pour Virement */}
                {selectedPayment === "iban" && (
                  <div className="mt-6 p-6 border border-gold/30 bg-gold/5 space-y-4 rounded-none transition-all">
                    <div className="flex items-center justify-between border-b border-gold/20 pb-3">
                      <h4 className="font-serif text-base text-primary flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-gold-dark" /> Coordonnées bancaires pour virement
                      </h4>
                      <button
                        type="button"
                        onClick={() => handleCopy("CH76 0000 0000 0000 0000 0", "IBAN")}
                        className="text-[10px] uppercase tracking-widest bg-gold/20 hover:bg-gold/30 text-gold-dark px-2.5 py-1 font-medium transition-colors cursor-pointer"
                      >
                        Copier IBAN
                      </button>
                    </div>

                    <div className="bg-background border border-border p-4 space-y-2 font-sans text-xs text-primary">
                      <p><span className="text-muted-foreground">Banque :</span> Raiffeisen / Banque Cantonale (Suisse)</p>
                      <p><span className="text-muted-foreground">Titulaire du compte :</span> <strong>El Shaddai Fragrances</strong></p>
                      <p><span className="text-muted-foreground">IBAN :</span> <strong className="text-gold-dark text-sm tracking-wider">CH76 0000 0000 0000 0000 0</strong></p>
                      <p><span className="text-muted-foreground">BIC / SWIFT :</span> RAIFCH22</p>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Effectuez le virement de <strong className="text-primary">{formatCHF(grandTotal)}</strong> après validation en indiquant votre nom en motif.
                    </p>
                  </div>
                )}

                {/* TWINT */}
                {selectedPayment === "twint" && (
                  <div className="mt-6">
                    <TwintQrCode amount={grandTotal} />
                  </div>
                )}
              </div>
            </div>

            {/* Récapitulatif commande */}
            <aside className="bg-card border border-border p-6 h-fit lg:sticky lg:top-28 space-y-6">
              {/* Delivery Estimate Box */}
              <div className="bg-gold/10 border border-gold/30 p-3.5 text-xs space-y-1">
                <p className="font-medium text-gold-dark flex items-center gap-1.5">
                  🇨🇭 Livraison Express Suisse
                </p>
                <p className="text-muted-foreground text-[11px]">
                  Expédition sous 24h via <strong>La Poste Suisse</strong>. Réception estimée sous 24h à 48h.
                </p>
              </div>

              <h3 className="font-serif text-xl border-b border-border pb-3">Récapitulatif</h3>
              <ul className="space-y-3 text-sm border-b border-border pb-4 max-h-72 overflow-y-auto pr-1">
                {items.map((i) => (
                  <li key={i.slug} className="flex gap-3 items-center">
                    <img src={i.image} alt={i.name} className="h-14 w-12 object-cover bg-secondary" />
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-medium">{i.name}</p>
                      <p className="text-xs text-muted-foreground">{i.size} × {i.quantity}</p>
                    </div>
                    <p className="text-sm whitespace-nowrap font-serif">{formatCHF(i.price * i.quantity)}</p>
                  </li>
                ))}
              </ul>

              <div className="space-y-2 text-sm border-b border-border pb-4">
                <div className="flex justify-between text-muted-foreground">
                  <span>Sous-total</span>
                  <span>{formatCHF(subtotal)}</span>
                </div>
                {appliedCoupon && discount > 0 && (
                  <div className="flex justify-between text-gold-dark font-medium text-xs">
                    <span>Remise ({appliedCoupon.code})</span>
                    <span>-{formatCHF(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-muted-foreground">
                  <span>Livraison (Suisse)</span>
                  <span>{shipping === 0 ? <strong className="text-gold-dark uppercase tracking-wider text-xs">Offerte</strong> : formatCHF(shipping)}</span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-serif font-medium">
                <span>Total</span>
                <span className="text-primary">{formatCHF(grandTotal)}</span>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit(onSubmit, onError)();
                }}
                disabled={isSubmitting}
                className="mt-6 block text-center w-full bg-primary text-primary-foreground py-4 text-xs uppercase tracking-[0.2em] hover:bg-primary/90 active:scale-[0.99] disabled:opacity-50 transition-all cursor-pointer relative z-10"
              >
                {isSubmitting ? "Validation en cours…" : "Confirmer la commande"}
              </button>
            </aside>
          </form>
        )}
      </main>
      <Footer />
    </div>
  );
}

const inputCls =
  "mt-2 w-full border border-border bg-background px-4 py-3 focus:border-gold focus:outline-none text-sm transition-colors";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</label>
      <div className={error ? "[&>input]:border-destructive [&>input]:bg-destructive/5" : ""}>
        {children}
      </div>
      {error && <p className="text-xs text-destructive mt-1 font-medium">{error}</p>}
    </div>
  );
}

