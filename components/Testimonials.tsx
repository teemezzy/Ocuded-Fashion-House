"use client";

import { useEffect, useState } from "react";
import Reveal from "./Reveal";
import { testimonials } from "@/lib/data";

export default function Testimonials() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIdx((i) => (i + 1) % testimonials.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const active = testimonials[idx];

  return (
    <Reveal className="bg-[linear-gradient(155deg,#A85D34,#7E4526_70%,#5C3418)] text-bg py-[clamp(64px,9vw,120px)] px-[clamp(24px,7vw,80px)]">
      <div className="max-w-[780px] mx-auto text-center">
        <div className="font-serif text-[clamp(2.5rem,5vw,3.6rem)] text-[rgba(251,246,238,0.7)] leading-[0.5] mb-[18px]">
          &ldquo;
        </div>
        <p className="font-serif italic text-[clamp(1.35rem,2.6vw,1.9rem)] leading-[1.5] mt-0 mb-[26px] min-h-[clamp(96px,10vw,140px)] transition-opacity duration-500">
          {active.quote}
        </p>
        <div className="text-[12px] tracking-[0.18em] uppercase text-[rgba(251,246,238,0.75)] mb-[28px]">
          {active.attribution}
        </div>
        <div className="flex justify-center gap-[10px]">
          {testimonials.map((_, i) => (
            <button
              key={i}
              aria-label={`Show testimonial ${i + 1}`}
              onClick={() => setIdx(i)}
              className={`w-[8px] h-[8px] p-0 rounded-full border-none cursor-pointer transition-colors duration-300 ${
                i === idx ? "bg-bg" : "bg-[rgba(251,246,238,0.4)]"
              }`}
            />
          ))}
        </div>
      </div>
    </Reveal>
  );
}
