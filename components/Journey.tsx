import Link from "next/link";
import Reveal from "./Reveal";
import { journey } from "@/lib/data";

export default function Journey() {
  return (
    <Reveal className="bg-cream2 py-[clamp(64px,9vw,120px)] px-[clamp(24px,7vw,80px)]">
      <div className="max-w-[1240px] mx-auto text-center">
        <div className="text-[11px] tracking-[0.3em] uppercase text-label mb-[14px]">
          The Process
        </div>
        <h2 className="font-serif font-medium text-[clamp(1.9rem,3.6vw,2.8rem)] mt-0 mb-[16px]">
          The O_Cubed Bridal Experience
        </h2>
        <p className="font-serif italic text-[clamp(1.05rem,1.6vw,1.35rem)] text-muted2 mt-0 mb-[20px]">
          Creating your wedding gown should be just as memorable as wearing it.
        </p>
        <p className="text-[clamp(13.5px,1.1vw,16px)] leading-[1.8] text-muted font-light max-w-[700px] mx-auto mt-0 mb-[clamp(44px,6vw,72px)]">
          Our bespoke experience begins with understanding your vision and
          continues through thoughtful design, expert craftsmanship, and
          personalized fittings—ensuring every detail comes together beautifully
          for your walk down the aisle.
        </p>
        {/* Mobile: vertical timeline */}
        <ol className="sm:hidden flex flex-col max-w-[300px] mx-auto text-left">
          {journey.map((j, i) => (
            <li key={j.num} className="relative flex items-center gap-[16px] pb-[24px] last:pb-0">
              {i < journey.length - 1 && (
                <span className="absolute left-[27px] top-[56px] bottom-0 w-[1px] bg-[rgba(168,93,52,0.3)]" />
              )}
              <div className="w-[56px] h-[56px] shrink-0 rounded-full border border-[rgba(168,93,52,0.5)] flex items-center justify-center font-serif text-[19px] text-rust bg-cream2">
                {j.num}
              </div>
              <div className="text-[15px] tracking-[0.04em] text-ink">
                {j.title}
              </div>
            </li>
          ))}
        </ol>

        {/* Desktop: horizontal row */}
        <div className="hidden sm:flex flex-wrap justify-center gap-[clamp(20px,3vw,8px)]">
          {journey.map((j, i) => (
            <div key={j.num} className="flex items-center gap-[clamp(8px,1vw,10px)]">
              <div className="flex flex-col items-center gap-[14px] w-[130px]">
                <div className="w-[56px] h-[56px] rounded-full border border-[rgba(168,93,52,0.5)] flex items-center justify-center font-serif text-[19px] text-rust">
                  {j.num}
                </div>
                <div className="text-[14px] tracking-[0.04em]">{j.title}</div>
              </div>
              {i < journey.length - 1 && (
                <div className="w-[36px] h-[1px] bg-[rgba(168,93,52,0.35)] mb-[34px]" />
              )}
            </div>
          ))}
        </div>
        <Link
          href="/consultation"
          className="inline-block mt-[clamp(40px,5vw,64px)] text-bg bg-rust text-[clamp(11.5px,1vw,14px)] font-medium tracking-[0.2em] uppercase py-[clamp(15px,1.6vw,18px)] px-[clamp(26px,3vw,36px)] transition-colors hover:bg-rust-dark"
        >
          Reserve Your Bridal Consultation
        </Link>
      </div>
    </Reveal>
  );
}
