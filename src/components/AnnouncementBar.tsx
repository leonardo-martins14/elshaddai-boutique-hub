const MESSAGES = [
  "Livraison offerte dès 80 CHF en Suisse",
  "Échantillons offerts à chaque commande",
  "Artisanat de parfumerie d'exception",
];

export function AnnouncementBar() {
  const loop = [...MESSAGES, ...MESSAGES, ...MESSAGES, ...MESSAGES];
  return (
    <div className="overflow-hidden bg-primary text-primary-foreground py-2.5 text-xs tracking-[0.18em] uppercase">
      <div className="flex animate-marquee whitespace-nowrap">
        {loop.map((m, i) => (
          <span key={i} className="mx-8 inline-flex items-center gap-8">
            {m}
            <span className="text-gold">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
