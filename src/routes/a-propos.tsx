import { createFileRoute, Link } from "@tanstack/react-router";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SectionTitle } from "@/components/SectionTitle";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/a-propos")({
  head: () => ({
    meta: [
      { title: "À propos — El Shaddai Fragrances" },
      { name: "description", content: "L'histoire de la maison El Shaddai, parfumerie artisanale d'inspiration orientale en Suisse." },
      { property: "og:title", content: "À propos — El Shaddai" },
      { property: "og:description", content: "Notre histoire, notre savoir-faire." },
    ],
    links: [{ rel: "canonical", href: "/a-propos" }],
  }),
  component: About,
});

function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <section className="bg-secondary/40 py-20">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-block bg-background p-4 mb-6">
              <Logo className="h-20 w-20" />
            </div>
            <p className="text-[11px] tracking-[0.3em] uppercase text-gold mb-3">Notre Maison</p>
            <h1 className="font-serif text-4xl sm:text-5xl text-primary">
              L'art du parfum, transmis avec passion.
            </h1>
            <div className="gold-rule max-w-[80px] mx-auto mt-8" />
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16 space-y-8 text-primary/85 leading-relaxed text-lg">
          <p>
            <span className="font-display text-2xl text-gold-dark">E</span>l Shaddai Fragrances est née d'une conviction simple : un parfum est un voyage, une mémoire, une signature. Inspirée des plus belles traditions de la parfumerie orientale, notre maison compose des sillages qui racontent une histoire et accompagnent les moments précieux de votre vie.
          </p>
          <p>
            Chaque création est élaborée avec des matières premières d'exception : oud noble, rose de Taïf, safran, santal de Mysore, ambre gris. Nous sélectionnons rigoureusement chaque ingrédient pour offrir des parfums riches, persistants et profondément singuliers.
          </p>
          <p>
            Notre démarche est artisanale. Nous travaillons en petites séries, dans le respect du savoir-faire transmis de génération en génération, et avec le souci constant de l'élégance et de la qualité.
          </p>
          <div className="gold-rule my-12" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center pt-4">
            {[
              { n: "12+", l: "Créations exclusives" },
              { n: "5", l: "Familles olfactives" },
              { n: "100%", l: "Artisanat suisse" },
            ].map((s) => (
              <div key={s.l}>
                <p className="font-display text-4xl text-gold-dark">{s.n}</p>
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mt-2">{s.l}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-primary text-primary-foreground py-16">
          <div className="mx-auto max-w-2xl px-4 text-center">
            <p className="font-serif text-2xl italic">« Composer un parfum, c'est sculpter dans l'invisible. »</p>
            <Link
              to="/boutique"
              className="mt-8 inline-block border border-gold text-gold px-8 py-3 text-xs uppercase tracking-[0.2em] hover:bg-gold hover:text-primary transition-colors"
            >
              Découvrir nos parfums
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
