import Link from "next/link";
import Reveal from "./Reveal";

export default function ClosingCTA() {
  return (
    <Reveal
      id="booking-cta"
      className="relative overflow-hidden py-[clamp(80px,10vw,150px)] px-[clamp(24px,7vw,64px)] text-center"
    >
      <div className="absolute inset-0 bg-[linear-gradient(150deg,#8C5A2E,#5A3418_62%,#33200F)]" />
      <div className="absolute inset-0 bg-[radial-gradient(80%_70%_at_50%_30%,rgba(200,138,74,0.22),rgba(200,138,74,0)_70%)]" />
      <div className="relative">
        <div className="text-[11px] tracking-[0.3em] uppercase text-clay-light mb-[18px]">
          Begin Your Bridal Journey
        </div>
        <h2 className="font-serif font-medium text-[clamp(2rem,4.5vw,3.6rem)] leading-[1.2] mt-0 mb-[22px] text-bg">
          Begin Your{" "}
          <span className="font-script font-normal text-clay-light text-[1.15em]">
            Bridal Journey
          </span>
        </h2>
        <p className="text-[clamp(14px,1.2vw,17px)] leading-[1.8] text-[rgba(251,246,238,0.85)] font-light mx-auto mt-0 mb-[clamp(28px,4vw,40px)] max-w-[520px]">
          Whether you&rsquo;ve envisioned your wedding gown for years or are just
          beginning to dream, we&rsquo;d be honoured to bring your vision to life.
        </p>
        <Link
          href="/consultation"
          className="inline-block text-[#3A2213] bg-clay text-[clamp(11.5px,1vw,14px)] font-medium tracking-[0.2em] uppercase py-[clamp(16px,1.8vw,20px)] px-[clamp(30px,4vw,44px)] transition-colors hover:bg-clay-hover"
        >
          Book Your Consultation
        </Link>
      </div>
    </Reveal>
  );
}
