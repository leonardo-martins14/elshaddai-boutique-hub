import logoImg from "@/assets/logo.png";

export function Logo({ className = "h-12 w-12" }: { className?: string }) {
  return (
    <img
      src={logoImg}
      alt="El Shaddai Fragrances"
      className={`${className} object-contain rounded-full border border-gold/30`}
      width={120}
      height={120}
    />
  );
}

