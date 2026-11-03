"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { PHOTO_QUALITY } from "@/lib/photos";

export type Look = {
  src: string;
  /** Describe the garment — it's all a screen reader or a failed load has. */
  alt: string;
};

/**
 * LOOKBOOK STACK — the mobile lookbook.
 *
 * Each look is a full-viewport sticky panel; the panels are siblings, so each
 * one pins and the next slides up over it. As a look is covered it scales down
 * slightly and dims, which is what makes it read as depth rather than images
 * stacked. Scrolling snaps to one look per flick.
 *
 * Only transform/opacity are animated (compositor-only). The dim is an overlay
 * div's opacity, not filter: brightness(), which would repaint a full-screen
 * image every frame.
 */

const SCALE = 0.06; // how much a covered look shrinks
const DIM = 0.45; // max opacity of the dimming veil

export default function LookbookStack({ looks }: { looks: Look[] }) {
  const panels = useRef<(HTMLElement | null)[]>([]);
  const pins = useRef<(HTMLDivElement | null)[]>([]);
  const veils = useRef<(HTMLDivElement | null)[]>([]);

  // Snap to each look. Set on <html> (the scroller) only while this is
  // mounted, i.e. only on mobile. proximity, not mandatory: mandatory would
  // yank the page toward the nearest look from anywhere on the page.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("lookbook-snap");
    return () => root.classList.remove("lookbook-snap");
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let queued = false;

    const paint = () => {
      queued = false;
      const vh = window.innerHeight;

      panels.current.forEach((_, i) => {
        const next = panels.current[i + 1];
        const pin = pins.current[i];
        const veil = veils.current[i];
        if (!pin || !veil) return;
        if (!next) {
          pin.style.transform = "";
          veil.style.opacity = "0";
          return;
        }

        // How far the next panel has climbed over this one, 0 → 1. Until it
        // pins it sits in normal flow, so its top is a reliable measure.
        const top = next.getBoundingClientRect().top;
        const progress = Math.min(1, Math.max(0, 1 - top / vh));
        // Ramps late, so a look stays full-strength until it's really covered.
        const eased = progress * progress;
        pin.style.transform = eased ? `scale(${(1 - eased * SCALE).toFixed(4)})` : "";
        veil.style.opacity = (eased * DIM).toFixed(3);
      });
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(paint);
    };

    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [looks]);

  return (
    <div className="relative bg-[#14100e]">
      {/* Snap points. On in-flow markers rather than the sticky panels: once a
          panel is stuck, browsers measure snap positions from where it sits. */}
      {looks.map((look, i) => (
        <div
          key={`snap-${look.src}`}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 h-[100svh] w-full snap-start snap-always"
          style={{ top: `${i * 100}svh` }}
        />
      ))}

      {looks.map((look, i) => (
        <section
          key={look.src}
          ref={(el) => void (panels.current[i] = el)}
          className="sticky top-0 h-[100svh] overflow-hidden"
        >
          <div
            ref={(el) => void (pins.current[i] = el)}
            className="relative h-full origin-[50%_40%] overflow-hidden bg-[#14100e] will-change-transform"
          >
            {/* Blurred backfill for the space a 4:5 photo leaves on a tall
                screen. A tiny copy of the same image; scale-110 hides the
                feathered edges the blur leaves. */}
            <Image
              src={look.src}
              alt=""
              aria-hidden="true"
              fill
              sizes="48px"
              quality={30}
              loading={i < 2 ? "eager" : "lazy"}
              className="scale-110 object-cover blur-3xl saturate-150"
            />
            {/* contain, not cover — cover would crop ~40% of the gown's width. */}
            <Image
              src={look.src}
              alt={look.alt}
              fill
              sizes="100vw"
              quality={PHOTO_QUALITY}
              loading={i < 2 ? "eager" : "lazy"}
              className="object-contain"
            />
            <div
              ref={(el) => void (veils.current[i] = el)}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[#14100e] opacity-0"
            />
          </div>
        </section>
      ))}
    </div>
  );
}
