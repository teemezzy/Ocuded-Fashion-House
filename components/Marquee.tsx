import { Fragment } from "react";
import { marquee } from "@/lib/data";

export default function Marquee() {
  const words = [...marquee, ...marquee];
  return (
    <div
      className="bg-rust text-bg py-[14px] overflow-hidden whitespace-nowrap"
      aria-hidden="true"
    >
      <div className="inline-flex gap-9 font-serif italic text-[clamp(15px,1.5vw,20px)] tracking-[0.04em] pl-9 will-change-transform animate-ocmarquee">
        {words.map((word, i) => (
          <Fragment key={i}>
            <span>{word}</span>
            <span className="opacity-50">·</span>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
