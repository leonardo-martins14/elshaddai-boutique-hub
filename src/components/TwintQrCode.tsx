import { Smartphone, Copy, Check, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { formatCHF } from "@/lib/cart-store";

export function TwintQrCode({
  amount,
  orderId,
  phoneNumber = "077 234 23 23",
}: {
  amount: number;
  orderId?: string;
  phoneNumber?: string;
}) {
  const [copiedNum, setCopiedNum] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);

  const rawPhone = phoneNumber.replace(/\s+/g, "");
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    `tel:+41${rawPhone.replace(/^0/, "")}`,
  )}&margin=10&color=111111&bgcolor=ffffff`;

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(phoneNumber);
    setCopiedNum(true);
    toast.success("Numéro TWINT copié dans le presse-papier !");
    setTimeout(() => setCopiedNum(false), 2500);
  };

  const handleCopyAmount = () => {
    navigator.clipboard.writeText(amount.toFixed(2));
    setCopiedAmount(true);
    toast.success("Montant copié dans le presse-papier !");
    setTimeout(() => setCopiedAmount(false), 2500);
  };

  return (
    <div className="bg-gradient-to-br from-card to-secondary/30 border border-gold/40 p-6 sm:p-8 space-y-6 relative overflow-hidden">
      {/* Decorative TWINT Banner Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gold/20 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gold/15 rounded-lg text-gold-dark shrink-0">
            <Smartphone className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-serif text-lg text-primary font-medium flex items-center gap-2">
              Paiement instantané TWINT
            </h4>
            <p className="text-xs text-muted-foreground">
              Scannez le QR Code ou utilisez le numéro ci-dessous
            </p>
          </div>
        </div>

        <div className="bg-gold/15 text-gold-dark border border-gold/30 text-[10px] uppercase tracking-[0.2em] px-3 py-1.5 font-bold flex items-center gap-1.5 self-start sm:self-auto">
          <ShieldCheck className="h-3.5 w-3.5" /> Sécurisé Suisse
        </div>
      </div>

      {/* QR Code & Details Layout */}
      <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 bg-background/80 border border-border p-5">
        {/* QR Code Display Container */}
        <div className="shrink-0 text-center">
          <div className="relative inline-block p-3 bg-white border-2 border-gold/60 shadow-md">
            <img
              src={qrUrl}
              alt="QR Code TWINT"
              className="h-36 w-36 object-contain"
              loading="eager"
            />
            {/* Center TWINT mini badge */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="bg-primary text-gold text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm border border-gold">
                TWINT
              </span>
            </div>
          </div>
        </div>

        {/* Payment Transfer Information */}
        <div className="flex-1 space-y-4 w-full">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground block">
              Numéro TWINT officiel
            </span>
            <div className="flex items-center justify-between gap-2 mt-1">
              <span className="font-sans text-xl font-bold text-gold-dark tracking-wider">
                {phoneNumber}
              </span>
              <button
                type="button"
                onClick={handleCopyPhone}
                className="bg-gold/15 hover:bg-gold/30 text-gold-dark border border-gold/30 px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                {copiedNum ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedNum ? "Copié !" : "Copier numéro"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border/60">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground block">
                Montant exact
              </span>
              <div className="flex items-center justify-between gap-2 mt-0.5">
                <span className="font-sans text-lg font-bold text-primary">
                  {formatCHF(amount)}
                </span>
                <button
                  type="button"
                  onClick={handleCopyAmount}
                  className="text-xs text-muted-foreground hover:text-gold underline cursor-pointer"
                >
                  {copiedAmount ? "Copié !" : "Copier montant"}
                </button>
              </div>
            </div>

            {orderId && (
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground block">
                  Communication
                </span>
                <span className="font-sans text-sm font-semibold text-primary mt-0.5 block tracking-wide">
                  #{orderId}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Helper Note */}
      <p className="text-xs text-muted-foreground leading-relaxed">
        <strong>Instruction :</strong> Effectuez le transfert de <strong className="text-primary">{formatCHF(amount)}</strong> via votre application TWINT. Indiquez le número de commande {orderId ? <strong className="text-primary">#{orderId}</strong> : ""} en communication pour validation rapide.
      </p>
    </div>
  );
}
