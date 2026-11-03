export type YesNo = "" | "YES" | "NO";

export type ConsultationData = {
  // Step 1 — About you
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  residence: string;
  source: string;
  // Step 2 — Your wedding
  weddingDate: string;
  ceremonyTypes: string[];
  colors: string;
  // Step 3 — Your vision
  vision: string;
  visionOther: string;
  fabrics: string[];
  fabricsOther: string;
  styles: string[];
  stylesOther: string;
  inspiration: string[]; // file names (no upload yet)
  // Step 4 — Budget & final
  budget: string;
  exceptional: string;
  awareness: YesNo;
  interested: YesNo;
};

export const initialData: ConsultationData = {
  name: "",
  email: "",
  phone: "",
  whatsapp: "",
  residence: "",
  source: "",
  weddingDate: "",
  ceremonyTypes: [],
  colors: "",
  vision: "",
  visionOther: "",
  fabrics: [],
  fabricsOther: "",
  styles: [],
  stylesOther: "",
  inspiration: [],
  budget: "",
  exceptional: "",
  awareness: "",
  interested: "",
};

export const SOURCE_OPTIONS = ["Referral", "Social Media", "Online Ads"];

export const CEREMONY_OPTIONS = [
  "Traditional",
  "White wedding",
  "Registry",
  "Reception / Second Gown",
  "Garden / Destination",
];

export const VISION_OPTIONS = [
  { value: "Luxury, Majestic, Regal", desc: "Opulent, statement-making grandeur." },
  {
    value: "Elegant, Timeless & Chic",
    desc: "Refined, classic, effortlessly beautiful.",
  },
  {
    value: "Bold, Extra & Glamorous",
    desc: "Dramatic, dazzling, unforgettable.",
  },
  { value: "Simple & Cute", desc: "Understated, sweet, and graceful." },
];

export const FABRIC_OPTIONS = [
  "Satin",
  "Mikado",
  "Crepe",
  "Tulle",
  "Organza",
  "Lace",
  "Chiffon",
  "Silk",
  "Not Sure",
];

export const STYLE_OPTIONS = [
  "Ball Gown",
  "Mermaid / Flowing Silhouette",
  "Traditionally Inspired",
];

export const BUDGET_OPTIONS = [
  "₦300,000 – ₦500,000",
  "₦500,000 – ₦1,000,000",
  "₦1,000,000 – ₦1,500,000",
  "₦2M+",
];

export type StepMeta = { title: string; subtitle: string };
export const STEPS: StepMeta[] = [
  { title: "About You", subtitle: "So we know who we're designing for" },
  { title: "Your Wedding", subtitle: "The day we're dressing you for" },
  { title: "Your Vision", subtitle: "The gown you've been dreaming of" },
  { title: "Budget & Details", subtitle: "The finishing touches" },
];
