"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { PHOTO_QUALITY } from "@/lib/photos";
import { useMediaQuery } from "@/lib/useMediaQuery";

const INTERVAL_MS = 5000;
const STAGGER_MS = INTERVAL_MS / 3;
const FADE_MS = 1200;

// Width + vertical offset per frame. The middle frame is slightly larger.
const FRAMES = [
  { width: "w-[30%]", offset: "translate-y-6" },
  { width: "w-[34%]", offset: "" },
  { width: "w-[30%]", offset: "-translate-y-4" },
];

type Steps = [number, number, number];

// Frame i at step k shows photos[(start + 3k + i - 1) mod n]. The three frames
// always cover three consecutive indices, so a photo never shows twice at once,
// and the center frame starts on photos[start] (the mobile hero photo).
function photoAt(photos: string[], start: number, i: number, k: number) {
  const n = photos.length;
  return photos[(((start + 3 * k + i - 1) % n) + n) % n];
}

// Desktop-only. Renders nothing below lg, so those images are never requested
// on mobile.
export default function HeroTriptych({
  photos,
  start,
}: {
  photos: string[];
  start: number;
}) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [steps, setSteps] = useState<Steps>([0, 0, 0]);
  const [shown, setShown] = useState(false);

  // Entrance fade once the triptych mounts.
  useEffect(() => {
    if (!isDesktop) {
      setShown(false);
      return;
    }
    const raf = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(raf);
  }, [isDesktop]);

  // Staggered rotation: frame i starts after INTERVAL_MS + i * STAGGER_MS, then
  // ticks every INTERVAL_MS.
  useEffect(() => {
    if (!isDesktop) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const intervals: ReturnType<typeof setInterval>[] = [];

    const advance = (i: number) => {
      if (document.hidden) return;
      setSteps((prev) => {
        const next: Steps = [...prev];
        next[i] += 1;
        return next;
      });
    };

    FRAMES.forEach((_, i) => {
      timeouts.push(
        setTimeout(() => {
          advance(i);
          intervals.push(setInterval(() => advance(i), INTERVAL_MS));
        }, INTERVAL_MS + i * STAGGER_MS)
      );
    });

    return () => {
      timeouts.forEach(clearTimeout);
      intervals.forEach(clearInterval);
    };
  }, [isDesktop]);

  if (!isDesktop) return null;

  return (
    <div
      className={`flex items-center justify-between w-full transition-opacity duration-1000 ease-out ${
        shown ? "opacity-100" : "opacity-0"
      }`}
    >
      {FRAMES.map((frame, i) => {
        const k = steps[i];
        const current = photoAt(photos, start, i, k);
        // Layers are keyed by src: the previous photo stays underneath while the
        // current one fades in over it, and the next one is preloaded at
        // opacity 0.
        const layers = [
          ...(k > 0 ? [{ src: photoAt(photos, start, i, k - 1), hidden: false }] : []),
          { src: current, hidden: false },
          { src: photoAt(photos, start, i, k + 1), hidden: true },
        ];

        return (
          <div key={i} className={`${frame.width} ${frame.offset}`}>
            <div className="relative aspect-[4/5] overflow-hidden">
              {layers.map((layer) => (
                <Image
                  key={layer.src}
                  src={layer.src}
                  alt=""
                  fill
                  sizes="30vw"
                  quality={PHOTO_QUALITY}
                  style={{ transitionDuration: `${FADE_MS}ms` }}
                  className={`object-cover object-top animate-kenburns transition-opacity ${
                    layer.hidden ? "opacity-0" : "opacity-100"
                  }`}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
