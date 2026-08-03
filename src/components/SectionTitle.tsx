export function SectionTitle({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}) {
  const alignCls = align === "center" ? "text-center mx-auto" : "text-left";
  return (
    <div className={`${alignCls} max-w-2xl mb-12`}>
      {eyebrow && (
        <p className="text-[11px] tracking-[0.3em] uppercase text-gold mb-3">{eyebrow}</p>
      )}
      <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-primary">{title}</h2>
      {subtitle && <p className="mt-4 text-muted-foreground leading-relaxed">{subtitle}</p>}
      <div className={`gold-rule mt-6 ${align === "center" ? "max-w-[80px] mx-auto" : "max-w-[80px]"}`} />
    </div>
  );
}
