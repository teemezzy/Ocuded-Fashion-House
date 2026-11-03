import { pillars } from "@/lib/data";

export default function WhyOCubed() {
  return (
    <section className="bg-cream2 text-ink py-[clamp(64px,9vw,120px)] px-[clamp(24px,7vw,80px)]">
      <div className="max-w-[1240px] mx-auto">
        <div className="text-center mb-[clamp(28px,4vw,48px)]">
          <div className="text-[11px] tracking-[0.3em] uppercase text-label mb-[14px]">
            The Difference
          </div>
          <h2 className="font-serif font-medium text-[clamp(1.9rem,3.6vw,2.8rem)] m-0">
            Why O_Cubed
          </h2>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))]">
          {pillars.map((p) => (
            <div
              key={p.num}
              className="flex gap-[16px] py-[22px] px-[18px] border-t border-[rgba(46,33,26,0.15)]"
            >
              <div className="font-serif text-[15px] text-rust min-w-[24px] pt-[2px]">
                {p.num}
              </div>
              <div>
                <div className="font-serif text-[20px] font-semibold mb-[6px]">
                  {p.title}
                </div>
                <div className="text-[13.5px] leading-[1.65] text-muted">
                  {p.body}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
