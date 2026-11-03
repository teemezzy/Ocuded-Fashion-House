import Image from "next/image";
import HeroTriptych from "./HeroTriptych";
import { HERO_PHOTOS, PHOTO_QUALITY } from "@/lib/photos";

function HeroCopy({ align }: { align: "center" | "left" }) {
  const left = align === "left";
  return (
    <>
      <div className="text-[clamp(10px,1vw,14px)] tracking-[0.34em] uppercase text-label mb-[clamp(14px,2vw,24px)]">
        Bespoke Bridal · Lagos
      </div>
      <h1
        className={`font-serif font-medium leading-[1.08] mt-0 mb-[clamp(14px,2vw,24px)] ${
          left
            ? "text-[clamp(2.2rem,3.6vw,4.4rem)]"
            : "text-[clamp(2.6rem,7.2vw,6rem)]"
        }`}
      >
        Made for Your{" "}
        <span className="font-script font-normal text-rust text-[1.18em]">
          &ldquo;I Do&rdquo;
        </span>{" "}
        Moment
      </h1>
      <p
        className={`text-[clamp(13.5px,1.4vw,19px)] leading-[1.7] font-light mt-0 mb-[clamp(24px,3vw,38px)] max-w-[560px] text-muted2 ${
          left ? "" : "mx-auto"
        }`}
      >
        Every love story deserves a gown as unforgettable as the moment it
        celebrates.
      </p>
      <a
        href="#booking-cta"
        className="inline-block text-bg bg-rust text-[clamp(11.5px,1vw,14px)] font-medium tracking-[0.2em] uppercase py-[clamp(15px,1.6vw,19px)] px-[clamp(26px,3vw,40px)] transition-colors hover:bg-rust-dark"
      >
        Begin Your Bridal Journey
      </a>
    </>
  );
}

// A random start photo is chosen on each page load (server-side, so it only
// changes on reload). Mobile shows it full-bleed; desktop (lg+) starts the
// rotating triptych on it. These images are used only here.
export default function Hero() {
  const start = Math.floor(Math.random() * HERO_PHOTOS.length);
  const src = HERO_PHOTOS[start];

  return (
    <section
      id="home"
      className="relative h-[min(84vh,940px)] min-h-[600px] overflow-hidden"
    >
      {/* Mobile / tablet: full-bleed photo */}
      <div className="absolute inset-0 lg:hidden">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={src}
            alt=""
            fill
            priority
            sizes="(min-width: 1024px) 30vw, 100vw"
            quality={PHOTO_QUALITY}
            className="object-cover object-top animate-kenburns"
          />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(251,246,238,0.10)_0%,rgba(251,246,238,0)_26%,rgba(251,246,238,0.55)_68%,rgba(251,246,238,0.95)_100%)]" />
        <div className="absolute left-0 right-0 bottom-[clamp(48px,8vh,90px)] px-[clamp(24px,8vw,64px)] text-center text-ink">
          <HeroCopy align="center" />
        </div>
      </div>

      {/* Desktop: copy left, offset triptych right */}
      <div className="hidden lg:grid grid-cols-[2fr_3fr] items-center gap-[clamp(32px,4vw,72px)] h-full px-[clamp(48px,6vw,96px)] bg-bg">
        <div className="text-left text-ink">
          <HeroCopy align="left" />
        </div>
        <HeroTriptych photos={HERO_PHOTOS} start={start} />
      </div>
    </section>
  );
}
