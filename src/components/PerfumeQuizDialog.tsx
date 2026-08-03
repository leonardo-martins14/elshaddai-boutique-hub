import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Sparkles, ArrowRight, RotateCcw, ShoppingBag, X, ChevronLeft, Star } from "lucide-react";
import { PRODUCTS, type Product, type Collection, type Gender } from "@/data/products";
import { formatCHF, useCart } from "@/lib/cart-store";
import { toast } from "sonner";

type QuizStep = 1 | 2 | 3 | "results";

type Answers = {
  family: Collection | "all" | null;
  gender: Gender | "all" | null;
  intensity: "daily" | "intense" | "bestseller" | null;
};

const INITIAL_ANSWERS: Answers = {
  family: null,
  gender: null,
  intensity: null,
};

export function PerfumeQuizDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [step, setStep] = useState<QuizStep>(1);
  const [answers, setAnswers] = useState<Answers>(INITIAL_ANSWERS);
  const add = useCart((s) => s.add);

  // Always reset answers & step to step 1 when modal is opened
  useEffect(() => {
    if (open) {
      setStep(1);
      setAnswers({ family: null, gender: null, intensity: null });
    }
  }, [open]);

  if (!open) return null;

  const resetQuiz = () => {
    setAnswers(INITIAL_ANSWERS);
    setStep(1);
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  // Recommendations Algorithm
  const getRecommendations = (): { product: Product; matchScore: number }[] => {
    return PRODUCTS.map((p) => {
      let score = 70; // Base score

      // Family match
      if (answers.family && answers.family !== "all") {
        if (p.collection === answers.family) score += 20;
      } else {
        score += 10;
      }

      // Gender match
      if (answers.gender && answers.gender !== "all") {
        if (p.gender === answers.gender) score += 10;
      } else {
        score += 5;
      }

      // Intensity / Preference match
      if (answers.intensity === "bestseller" && p.isBestSeller) score += 8;
      if (answers.intensity === "intense" && (p.collection === "oriental" || p.collection === "boise")) score += 7;
      if (answers.intensity === "daily" && (p.collection === "frais" || p.collection === "floral")) score += 7;
      if (p.isNew) score += 2;

      // Cap match score between 88% and 99%
      const matchScore = Math.min(99, Math.max(88, score));
      return { product: p, matchScore };
    })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 3);
  };

  const handleAddToCart = (product: Product) => {
    add(product);
    toast.success(`${product.name} ajouté au panier !`);
  };

  const recommendations = getRecommendations();

  return (
    <div
      className="fixed inset-0 z-50 bg-primary/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-3xl bg-background border border-gold/40 shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gold Bar */}
        <div className="h-1.5 bg-gradient-to-r from-gold via-gold-light to-gold-dark" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          aria-label="Fermer"
          className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-gold transition-colors z-10"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Body */}
        <div className="p-6 sm:p-10">
          {/* Header Badge */}
          <div className="flex items-center gap-2 text-gold-dark text-[11px] uppercase tracking-[0.25em] mb-2 font-medium">
            <Sparkles className="h-4 w-4" />
            <span>Assistant Olfactif sur Mesure</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl text-primary">
            Trouvez votre signature olfactive
          </h2>

          {/* Progress Bar */}
          {step !== "results" && (
            <div className="mt-6 mb-8">
              <div className="flex justify-between text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">
                <span>Étape {step} sur 3</span>
                <span>
                  {step === 1 && "Univers olfactif"}
                  {step === 2 && "Profil & Ambiance"}
                  {step === 3 && "Intensité & Occasion"}
                </span>
              </div>
              <div className="w-full bg-border h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-gold h-full transition-all duration-500 ease-out"
                  style={{ width: `${(step / 3) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* STEP 1: Univers Olfactif */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <p className="text-sm text-muted-foreground">
                Quelle famille de fragrances vous attire le plus ?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: "gourmand",
                    title: "Gourmand & Vanillé",
                    desc: "Notes sucrées, miel, caramel et vanille bourbon",
                  },
                  {
                    id: "oriental",
                    title: "Oriental & Oud",
                    desc: "Notes chaudes, oud noble, ambre et safran précieux",
                  },
                  {
                    id: "floral",
                    title: "Floral & Élégant",
                    desc: "Bouquets raffinés, rose de Taïf, jasmin et pivoine",
                  },
                  {
                    id: "boise",
                    title: "Boisé & Profond",
                    desc: "Santal de Mysore, cèdre, patchouli et cuir",
                  },
                  {
                    id: "frais",
                    title: "Frais & Lumineux",
                    desc: "Agrumes pétillants, notes marines et musc propre",
                  },
                  {
                    id: "all",
                    title: "Surprenez-moi !",
                    desc: "Explorer toutes les familles olfactives",
                  },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setAnswers({ ...answers, family: opt.id as Collection | "all" });
                      setStep(2);
                    }}
                    className={`text-left p-4 border transition-all hover:border-gold hover:shadow-md flex items-start gap-3.5 group cursor-pointer ${
                      answers.family === opt.id
                        ? "border-gold bg-gold/10 shadow-sm"
                        : "border-border bg-card hover:bg-gold/5"
                    }`}
                  >
                    <div>
                      <h4 className="font-serif text-base text-primary group-hover:text-gold-dark transition-colors font-medium">
                        {opt.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        {opt.desc}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Profil & Gender */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <p className="text-sm text-muted-foreground">
                À qui est destinée cette création parfumée ?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    id: "femme",
                    title: "Pour Elle",
                    subtitle: "Féminité & Sillage Raffiné",
                  },
                  {
                    id: "homme",
                    title: "Pour Lui",
                    subtitle: "Caractère & Présence Virile",
                  },
                  {
                    id: "all",
                    title: "Unisexe / Sans genre",
                    subtitle: "Signature Parfumée Universelle",
                  },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setAnswers({ ...answers, gender: opt.id as Gender | "all" });
                      setStep(3);
                    }}
                    className={`p-6 border text-center transition-all hover:border-gold hover:shadow-md flex flex-col items-center justify-center gap-2 group cursor-pointer ${
                      answers.gender === opt.id
                        ? "border-gold bg-gold/10 shadow-sm"
                        : "border-border bg-card hover:bg-gold/5"
                    }`}
                  >
                    <div>
                      <h4 className="font-serif text-lg text-primary group-hover:text-gold-dark transition-colors font-medium">
                        {opt.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">{opt.subtitle}</p>
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-gold transition-colors pt-2 cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" /> Retour à l'étape précédente
              </button>
            </div>
          )}

          {/* STEP 3: Intensité & Occasion */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <p className="text-sm text-muted-foreground">
                Quel style de parfum recherchez-vous en priorité ?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    id: "daily",
                    title: "Quotidien & Équilibre",
                    desc: "Un sillage élégant, agréable au bureau comme en journée.",
                  },
                  {
                    id: "intense",
                    title: "Soirée & Sillage Intense",
                    desc: "Une fragrance captivante qui ne passe pas inaperçue.",
                  },
                  {
                    id: "bestseller",
                    title: "Incontournables Best-Sellers",
                    desc: "Les compositions coup de cœur plébiscitées par nos clients.",
                  },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setAnswers({ ...answers, intensity: opt.id as Answers["intensity"] });
                      setStep("results");
                    }}
                    className={`p-6 border text-left transition-all hover:border-gold hover:shadow-md flex flex-col justify-between gap-3 group cursor-pointer ${
                      answers.intensity === opt.id
                        ? "border-gold bg-gold/10 shadow-sm"
                        : "border-border bg-card hover:bg-gold/5"
                    }`}
                  >
                    <div>
                      <h4 className="font-serif text-base text-primary group-hover:text-gold-dark transition-colors font-medium">
                        {opt.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                        {opt.desc}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-gold transition-colors pt-2 cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" /> Retour à l'étape précédente
              </button>
            </div>
          )}

          {/* RESULTS SCREEN */}
          {step === "results" && (
            <div className="space-y-8 animate-fade-in">
              <div className="bg-gold/10 border border-gold/30 p-4 text-center space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-dark">
                  Recommandations personnalisées
                </p>
                <p className="text-xs text-muted-foreground">
                  Sélection ajustée selon vos préférences olfactives.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {recommendations.map(({ product, matchScore }) => (
                  <div
                    key={product.slug}
                    className="group border border-border bg-card p-4 flex flex-col justify-between relative hover:border-gold transition-all"
                  >
                    <div className="absolute top-2 right-2 bg-gold/90 text-primary text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 z-10 flex items-center gap-1">
                      <Star className="h-3 w-3 fill-primary" /> {matchScore}%
                    </div>

                    <div className="aspect-[3/4] bg-secondary/40 mb-4 overflow-hidden relative">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <div className="space-y-1 flex-1 flex flex-col justify-between text-center">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                          {product.collectionLabel}
                        </p>
                        <h4 className="font-serif text-lg text-primary group-hover:text-gold-dark transition-colors font-medium">
                          {product.name}
                        </h4>
                        <p className="text-xs text-muted-foreground truncate">{product.subtitle}</p>
                      </div>

                      <p className="font-serif font-semibold text-primary text-base pt-2">
                        {formatCHF(product.price)}
                      </p>

                      <div className="pt-3 space-y-2">
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="w-full bg-primary text-primary-foreground text-[11px] uppercase tracking-[0.18em] py-2.5 hover:bg-primary/90 transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <ShoppingBag className="h-3.5 w-3.5" /> Ajouter
                        </button>

                        <Link
                          to="/boutique/$slug"
                          params={{ slug: product.slug }}
                          onClick={handleClose}
                          className="block text-center text-[10px] uppercase tracking-[0.18em] text-muted-foreground hover:text-gold transition-colors py-1"
                        >
                          Voir détails →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between border-t border-border pt-6 gap-4">
                <button
                  onClick={resetQuiz}
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-gold transition-colors cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4" /> Recommencer le test
                </button>
                <Link
                  to="/boutique"
                  onClick={handleClose}
                  className="bg-primary text-primary-foreground px-6 py-3 text-xs uppercase tracking-[0.2em] hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
                >
                  Explorer toute la boutique <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
