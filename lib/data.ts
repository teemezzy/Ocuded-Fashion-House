export const marquee: string[] = [
  "Timeless",
  "Crafted",
  "Refined",
  "Elegant",
  "Intentional",
  "Bespoke",
  "Atelier",
  "Heirloom",
  "Forever",
  "Celebrate",
  "Feminine",
  "Considered",
];

export type Pillar = { num: string; title: string; body: string };
export const pillars: Pillar[] = [
  {
    num: "01",
    title: "Timeless Elegance",
    body: "Classic designs created to remain beautiful for years to come.",
  },
  {
    num: "02",
    title: "Crafted Around You",
    body: "Every gown is designed to reflect your personality, style, and vision.",
  },
  {
    num: "03",
    title: "Couture Craftsmanship",
    body: "Meticulous attention to detail, exceptional finishing, and uncompromising quality.",
  },
  {
    num: "04",
    title: "A Thoughtful Experience",
    body: "From consultation to final fitting, every step is guided with care, professionalism, and intention.",
  },
];

export type GalleryItem = { h: number; bg: string; label: string };
export const galleryItems: GalleryItem[] = [
  {
    h: 340,
    bg: "linear-gradient(155deg,#EBD8B8,#D7A568 75%,#B07434)",
    label: "Gown — full silhouette",
  },
  { h: 240, bg: "linear-gradient(155deg,#F1E7D3,#D7A568)", label: "Detail — beadwork" },
  {
    h: 300,
    bg: "linear-gradient(160deg,#E0A96A,#995230)",
    label: "Gown — train detail",
  },
  {
    h: 260,
    bg: "linear-gradient(150deg,#C89158,#8C5A2E)",
    label: "Editorial — bridal portrait",
  },
  {
    h: 320,
    bg: "linear-gradient(155deg,#F3DFB8,#C79052)",
    label: "Detail — hand-stitching",
  },
  { h: 220, bg: "linear-gradient(160deg,#E7CFA6,#B07434)", label: "Gown — bodice" },
  {
    h: 280,
    bg: "linear-gradient(150deg,#DDBE8A,#9A6A3A)",
    label: "Studio — fitting session",
  },
];

export type JourneyStep = { num: string; title: string };
export const journey: JourneyStep[] = [
  { num: "01", title: "Consultation" },
  { num: "02", title: "Design" },
  { num: "03", title: "Craftsmanship" },
  { num: "04", title: "Fitting" },
  { num: "05", title: "Your Day" },
];

export type Testimonial = { quote: string; attribution: string };
export const testimonials: Testimonial[] = [
  {
    quote:
      "“From my very first consultation, I knew I was in the right hands. My gown was everything I dreamed of and more.”",
    attribution: "O_Cubed Bride",
  },
  {
    quote:
      "“Every detail was beautifully executed. I felt confident, elegant, and completely myself.”",
    attribution: "O_Cubed Bride",
  },
];

export type ShopProduct = {
  title: string;
  desc: string;
  price: string;
  bg: string;
  imgLabel: string;
};
export const shopProducts: ShopProduct[] = [
  {
    title: "Sketch Book",
    desc: "Original dress sketches and design concepts from our atelier.",
    price: "₦25,000",
    bg: "linear-gradient(155deg,#F1E7D3,#D7A568)",
    imgLabel: "Image — sketch book",
  },
  {
    title: "Bridal Collections Book",
    desc: "A curated lookbook of our bridal collections and photography.",
    price: "₦40,000",
    bg: "linear-gradient(150deg,#E0A96A,#995230)",
    imgLabel: "Image — collections book",
  },
];
