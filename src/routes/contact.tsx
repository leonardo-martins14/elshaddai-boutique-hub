import { createFileRoute } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SectionTitle } from "@/components/SectionTitle";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — El Shaddai Fragrances" },
      { name: "description", content: "Contactez El Shaddai Fragrances via notre formulaire : conseils parfums, commandes et suivi." },
      { property: "og:title", content: "Contact — El Shaddai" },
      { property: "og:description", content: "Nous joindre par téléphone ou par email." },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    const body = encodeURIComponent(`Bonjour,\n\n${message}\n\nCordialement,\n${name}\n${email}`);
    const subject = encodeURIComponent(`Contact site — ${name}`);
    window.location.href = `mailto:contact@elshaddai-boutique.ch?subject=${subject}&body=${body}`;
    toast.success("Votre client mail va s'ouvrir.");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar />
      <Header />
      <main className="flex-1 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16">
        <SectionTitle
          eyebrow="Nous joindre"
          title="Contact"
          subtitle="Une question, un conseil, une commande personnalisée ? Nous sommes à votre écoute."
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-5 border border-border bg-card p-6">
              <MapPin className="h-7 w-7 text-gold" strokeWidth={1.2} />
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Localisation</p>
                <p className="font-serif text-xl">Suisse</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Écrivez-nous via le formulaire ci-contre : nous vous répondons personnellement sous
              24 à 48 heures.
            </p>
          </div>


          <form onSubmit={handleSubmit} className="bg-card border border-border p-8 space-y-5">
            <h3 className="font-serif text-2xl">Envoyez-nous un message</h3>
            <div>
              <label className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Nom</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 w-full border border-border bg-background px-4 py-3 focus:border-gold focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full border border-border bg-background px-4 py-3 focus:border-gold focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Message</label>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-2 w-full border border-border bg-background px-4 py-3 focus:border-gold focus:outline-none resize-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-4 text-xs uppercase tracking-[0.2em] hover:bg-primary/90 transition-colors"
            >
              Envoyer le message
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
