// Auto-imported cropped flacons from catalog
const perfumeImages = import.meta.glob("../assets/perfumes/*.jpg", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const imgBySlug: Record<string, string> = {};
const hoverImgBySlug: Record<string, string> = {};
for (const [path, url] of Object.entries(perfumeImages)) {
  const name = path.split("/").pop()!.replace(/\.jpg$/, "");
  if (name.endsWith("-box")) {
    hoverImgBySlug[name.replace(/-box$/, "")] = url;
  } else {
    imgBySlug[name] = url;
  }
}

import fallbackImg from "@/assets/perfume-1.jpg";

export type Collection =
  | "gourmand"
  | "floral"
  | "oriental"
  | "boise"
  | "frais"
  | "decouverte";

export type Brand = "lattafa" | "alwataniah";
export type Gender = "femme" | "homme";

export type Product = {
  slug: string;
  name: string;
  brand: Brand;
  brandLabel: string;
  gender: Gender;
  subtitle: string; // mood / sub-category, e.g. "Vanillé & doux"
  price: number; // CHF
  size: string;
  collection: Collection;
  collectionLabel: string;
  image: string;
  imageHover?: string;
  description: string;
  notes: { tete: string[]; coeur: string[]; fond: string[] };
  isNew?: boolean;
  isBestSeller?: boolean;
};

export const COLLECTIONS: { slug: Collection; label: string; description: string }[] = [
  { slug: "gourmand",   label: "Gourmand",   description: "Sillages sucrés et enveloppants : vanille, miel, caramel et notes lactées." },
  { slug: "floral",     label: "Floral",     description: "Bouquets élégants : rose, jasmin, fleur d'oranger et muguet." },
  { slug: "oriental",   label: "Oriental",   description: "Notes chaudes et envoûtantes : oud, ambre, encens et épices précieuses." },
  { slug: "boise",      label: "Boisé",      description: "Profondeur du santal, du cèdre et du patchouli." },
  { slug: "frais",      label: "Frais",      description: "Agrumes lumineux, notes marines et vertes pour un quotidien aérien." },
  { slug: "decouverte", label: "Découverte", description: "Créations confidentielles et signatures à découvrir." },
];

export const BRANDS: { slug: Brand; label: string }[] = [
  { slug: "lattafa",    label: "Lattafa" },
  { slug: "alwataniah", label: "Al Wataniah" },
];

const familyLabel = (c: Collection) =>
  COLLECTIONS.find((x) => x.slug === c)?.label ?? c;

// Real flacon image per slug, with graceful fallback
const imageForSlug = (slug: string): string => imgBySlug[slug] ?? fallbackImg;

// Generic olfactory notes per family (used when source catalog gives only a mood)
const notesFor = (c: Collection) =>
  ({
    gourmand:   { tete: ["Mandarine", "Amande"],            coeur: ["Miel", "Fleur d'oranger"],   fond: ["Vanille bourbon", "Fève tonka", "Musc"] },
    floral:     { tete: ["Bergamote", "Litchi"],            coeur: ["Rose", "Jasmin", "Pivoine"], fond: ["Musc blanc", "Santal", "Ambre"] },
    oriental:   { tete: ["Safran", "Poivre noir"],          coeur: ["Oud", "Rose", "Cuir"],       fond: ["Ambre", "Patchouli", "Musc"] },
    boise:      { tete: ["Pamplemousse", "Poivre rose"],    coeur: ["Iris", "Cèdre"],             fond: ["Santal", "Vétiver", "Patchouli"] },
    frais:      { tete: ["Bergamote", "Citron"],            coeur: ["Muguet", "Lavande"],         fond: ["Musc blanc", "Bois flotté"] },
    decouverte: { tete: ["Notes vertes", "Agrumes"],        coeur: ["Iris", "Fleurs blanches"],   fond: ["Bois précieux", "Musc"] },
  }[c] ?? { tete: ["Bergamote"], coeur: ["Fleurs"], fond: ["Musc"] });

type Seed = {
  slug: string;
  name: string;
  brand: Brand;
  gender: Gender;
  subtitle: string;
  price: number;
  collection: Collection;
  size?: string;
  description?: string;
  isNew?: boolean;
  isBestSeller?: boolean;
};

const SEEDS: Seed[] = [
  // ───────────────────────────── LATTAFA — FEMME ─────────────────────────────
  // Gourmand / Sucré
  { slug: "eclaire",            name: "Eclaire",            brand: "lattafa", gender: "femme", subtitle: "Vanillé & doux",     price: 45.90, collection: "gourmand", isBestSeller: true },
  { slug: "dalal",              name: "Dalal",              brand: "lattafa", gender: "femme", subtitle: "Agrume & sucré",     price: 54.90, collection: "gourmand" },
  { slug: "sakeena",            name: "Sakeena",            brand: "lattafa", gender: "femme", subtitle: "Floral & sucré",     price: 39.90, collection: "gourmand" },
  { slug: "layaan",             name: "Layaan",             brand: "lattafa", gender: "femme", subtitle: "Floral & frais",     price: 49.90, collection: "floral" },
  { slug: "victoria",           name: "Victoria",           brand: "lattafa", gender: "femme", subtitle: "Frais & citronné",   price: 49.90, collection: "frais" },

  // Floral / Frais
  { slug: "ameerat-al-arab",    name: "Ameerat Al Arab",    brand: "lattafa", gender: "femme", subtitle: "Floral élégant",     price: 27.90, collection: "floral" },
  { slug: "ameerat-al-prive",   name: "Ameerat Al Prive",   brand: "lattafa", gender: "femme", subtitle: "Floral intense",     price: 33.90, collection: "floral" },
  { slug: "haya",               name: "Haya",               brand: "lattafa", gender: "femme", subtitle: "Floral frais",       price: 33.90, collection: "floral" },
  { slug: "angham",             name: "Angham",             brand: "lattafa", gender: "femme", subtitle: "Doux & floral",      price: 49.90, collection: "floral" },
  { slug: "pure-crystal",       name: "Pure Crystal",       brand: "lattafa", gender: "femme", subtitle: "Propre & léger",     price: 54.90, collection: "frais" },

  // Oriental / Intense
  { slug: "fakhar-pose",        name: "Fakhar Pose",        brand: "lattafa", gender: "femme", subtitle: "Floral puissant",    price: 36.90, collection: "floral" },
  { slug: "teriaq-intense",     name: "Teriaq Intense",     brand: "lattafa", gender: "femme", subtitle: "Ambré intense",      price: 54.90, collection: "oriental", isBestSeller: true },
  { slug: "musaman-white",      name: "Musaman White",      brand: "lattafa", gender: "femme", subtitle: "Boisé & doux",       price: 49.90, collection: "boise" },
  { slug: "affef",              name: "Affef",              brand: "lattafa", gender: "femme", subtitle: "Oriental chaud",     price: 54.90, collection: "oriental" },
  { slug: "her-confession",     name: "Her Confession",     brand: "lattafa", gender: "femme", subtitle: "Sensuel & sucré",    price: 49.90, collection: "gourmand" },

  // Découverte
  { slug: "ana-a-scarlet",      name: "Ana.A Scarlet",      brand: "lattafa", gender: "femme", subtitle: "Fruité élégant",     price: 31.90, collection: "decouverte", isNew: true },
  { slug: "atheeri",            name: "Atheeri",            brand: "lattafa", gender: "femme", subtitle: "Floral doux",        price: 41.90, collection: "floral", isNew: true },
  { slug: "angham-second-song", name: "Angham Second Song", brand: "lattafa", gender: "femme", subtitle: "Floral musqué",      price: 43.90, collection: "floral", isNew: true },

  // Best-sellers Yara
  { slug: "yara",               name: "Yara",               brand: "lattafa", gender: "femme", subtitle: "Doux & poudré",      price: 33.90, collection: "floral",   isBestSeller: true },
  { slug: "yara-elixir",        name: "Yara Elixir",        brand: "lattafa", gender: "femme", subtitle: "Gourmand sucré",     price: 44.90, collection: "gourmand", isBestSeller: true },
  { slug: "yara-tous",          name: "Yara Tous",          brand: "lattafa", gender: "femme", subtitle: "Fruité tropical",    price: 33.90, collection: "gourmand", isBestSeller: true },
  { slug: "nebras",             name: "Nebras",             brand: "lattafa", gender: "femme", subtitle: "Gourmand intense",   price: 49.90, collection: "gourmand", isBestSeller: true },
  { slug: "kamrah",             name: "Kamrah",             brand: "lattafa", gender: "femme", subtitle: "Gourmand",           price: 44.90, collection: "gourmand", isBestSeller: true },

  // ───────────────────────────── LATTAFA — HOMME ─────────────────────────────
  // Oriental / Intense
  { slug: "qaed-al-fursan",         name: "Qaed Al Fursan",         brand: "lattafa", gender: "homme", subtitle: "Floral puissant",   price: 34.90, collection: "decouverte" },
  { slug: "musaman-black",          name: "Musaman Black",          brand: "lattafa", gender: "homme", subtitle: "Boisé & doux",      price: 56.90, collection: "boise" },
  { slug: "qaed-al-fursan-untamed", name: "Qaed Al Fursan Untamed", brand: "lattafa", gender: "homme", subtitle: "Oriental chaud",    price: 29.90, collection: "oriental" },
  { slug: "his-confession",         name: "His Confession",         brand: "lattafa", gender: "homme", subtitle: "Sensuel & sucré",   price: 49.90, collection: "gourmand" },

  // Asad
  { slug: "asad",                   name: "Asad",                   brand: "lattafa", gender: "homme", subtitle: "Épicé & ambré",     price: 33.90, collection: "oriental" },
  { slug: "asad-bourbon",           name: "Asad Bourbon",           brand: "lattafa", gender: "homme", subtitle: "Boisé & chaleureux",price: 39.90, collection: "boise", isBestSeller: true },
  { slug: "asad-elixir",            name: "Asad Elixir",            brand: "lattafa", gender: "homme", subtitle: "Ambré intense",     price: 44.90, collection: "oriental", isNew: true },

  // Frais / Quotidien
  { slug: "fakhar-gold",            name: "Fakhar Gold",            brand: "lattafa", gender: "homme", subtitle: "Floral puissant",   price: 36.90, collection: "floral" },
  { slug: "fakhar-black",           name: "Fakhar Black",           brand: "lattafa", gender: "homme", subtitle: "Frais & élégant",   price: 36.90, collection: "frais" },
  { slug: "maahir-legacy",          name: "Maahir Legacy",          brand: "lattafa", gender: "homme", subtitle: "Citrus & frais",    price: 44.90, collection: "frais" },

  // Boisé + Pommé
  { slug: "vintage-radio",          name: "Vintage Radio",          brand: "lattafa", gender: "homme", subtitle: "Boisé & moderne",   price: 44.90, collection: "boise", isNew: true },
  { slug: "dynasty",                name: "Dynasty",                brand: "lattafa", gender: "homme", subtitle: "Élégant & épicé",   price: 42.90, collection: "boise" },
  { slug: "mashrabya",              name: "Mashrabya",              brand: "lattafa", gender: "homme", subtitle: "Gourmand & sucré",  price: 41.90, collection: "gourmand" },

  // ─────────────────────────── AL WATANIAH — FEMME ───────────────────────────
  { slug: "lilly",                  name: "Lilly",                  brand: "alwataniah", gender: "femme", subtitle: "Floral & doux",     price: 37.90, collection: "floral" },
  { slug: "sabad-al-sugar",         name: "Sabad Al Sugar",         brand: "alwataniah", gender: "femme", subtitle: "Sucré & gourmand",  price: 34.90, collection: "gourmand" },
  { slug: "amnia",                  name: "Amnia",                  brand: "alwataniah", gender: "femme", subtitle: "Poudré & élégant",  price: 39.90, collection: "frais" },
  { slug: "sabad-al-ward",          name: "Sabad Al Ward",          brand: "alwataniah", gender: "femme", subtitle: "Floral puissant",   price: 29.90, collection: "floral" },
  { slug: "tibyan",                 name: "Tibyan",                 brand: "alwataniah", gender: "femme", subtitle: "Boisé & chaleureux",price: 31.90, collection: "boise" },
  { slug: "baraa",                  name: "Baraa",                  brand: "alwataniah", gender: "femme", subtitle: "Sensuel & sucré",   price: 37.90, collection: "gourmand" },
  { slug: "watani-femme",           name: "Watani",                 brand: "alwataniah", gender: "femme", subtitle: "Frais & quotidien", price: 29.90, collection: "frais" },

  // ─────────────────────────── AL WATANIAH — HOMME ───────────────────────────
  { slug: "oud-mystere",            name: "Oud Mystère",            brand: "alwataniah", gender: "homme", subtitle: "Ambré intense",     price: 39.90, collection: "oriental", isBestSeller: true },
  { slug: "al-layl",                name: "Al Layl",                brand: "alwataniah", gender: "homme", subtitle: "Musqué & sombre",   price: 34.90, collection: "oriental" },
  { slug: "al-daiem-elixir",        name: "Al Daiem Elixir",        brand: "alwataniah", gender: "homme", subtitle: "Vanillé & ambré",   price: 40.90, collection: "oriental" },
  { slug: "al-daiem",               name: "Al Daiem",               brand: "alwataniah", gender: "homme", subtitle: "Boisé raffiné",     price: 40.90, collection: "boise" },
];

const brandLabelOf = (b: Brand) => BRANDS.find((x) => x.slug === b)?.label ?? b;

const describe = (s: Seed) =>
  s.description ??
  `${s.name} — signature ${s.subtitle.toLowerCase()} de la maison ${brandLabelOf(s.brand)}. Une eau de parfum ${familyLabel(s.collection).toLowerCase()} aux matières nobles, pour un sillage élégant et longue tenue.`;

export const PRODUCTS: Product[] = SEEDS.map((s) => ({
  slug: s.slug,
  name: s.name,
  brand: s.brand,
  brandLabel: brandLabelOf(s.brand),
  gender: s.gender,
  subtitle: s.subtitle,
  price: s.price,
  size: s.size ?? "100 ml",
  collection: s.collection,
  collectionLabel: familyLabel(s.collection),
  image: imageForSlug(s.slug),
  imageHover: hoverImgBySlug[s.slug],
  description: describe(s),
  notes: notesFor(s.collection),
  isNew: s.isNew,
  isBestSeller: s.isBestSeller,
}));

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function productsByCollection(slug: Collection): Product[] {
  return PRODUCTS.filter((p) => p.collection === slug);
}

export function productsByBrand(slug: Brand): Product[] {
  return PRODUCTS.filter((p) => p.brand === slug);
}

export function productsByGender(g: Gender): Product[] {
  return PRODUCTS.filter((p) => p.gender === g);
}
