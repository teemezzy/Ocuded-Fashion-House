"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { PHOTO_QUALITY } from "@/lib/photos";
import { useMediaQuery } from "@/lib/useMediaQuery";

/**
 * LOOKBOOK TUNNEL — scroll flies the camera through a line of photos.
 * Mobile only (< md): hidden by CSS on desktop, and no photos are mounted or
 * requested there.
 *
 * One tall section holds a pinned, perspective stage. Scroll progress is the
 * camera position along the z axis: upcoming looks hang in the distance, off to
 * alternating sides; as you scroll each one swings toward the center, fills the
 * frame, then flies past the camera and fades while the next arrives. Progress
 * is eased toward the scroll position each frame so it glides rather than
 * stepping with the wheel.
 *
 * All per-frame work writes styles directly (no React renders); React only
 * re-renders when the nearest look changes, to mount/unmount the few photos
 * near the camera.
 */

export type Look = {
  src: string;
  /** Describe the garment — it's all a screen reader or a failed load has. */
  alt: string;
};

const STEP_SVH = 65; // scroll distance per look, in svh
const DEPTH = 800; // z distance between looks, px
const PERSPECTIVE = 1000; // px
const EASE = 0.13; // fraction of the gap closed per frame
const BEHIND = 2; // looks kept mounted behind the camera
const AHEAD = 3; // looks kept mounted (and preloaded) ahead

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

export default function LookbookTunnel({ looks }: { looks: Look[] }) {
  const n = looks.length;
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [active, setActive] = useState(0);

  const outerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cur = useRef(0); // eased progress, in looks (0..n-1)
  const target = useRef(0); // raw progress from scroll
  const raf = useRef(0);
  const reduced = useRef(false);
  const lastActive = useRef(0);

  // Place every mounted card for the current eased progress.
  const apply = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const p = cur.current;

    // Card size and side/vertical drift.
    const ch = Math.min(vw * 1.08, vh * 0.62);
    const cw = ch * 0.8;
    const driftX = vw * 0.12;
    const driftY = vh * 0.12;
    stage.style.setProperty("--cw", `${cw}px`);
    stage.style.setProperty("--ch", `${ch}px`);

    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      const t = i - p; // >0 ahead of the camera, <0 already passed
      if (t < -1 || t > AHEAD) {
        el.style.opacity = "0";
        return;
      }
      const side = i % 2 === 0 ? -1 : 1;
      const tc = clamp(t, -1.6, 1.8);
      const z = reduced.current ? 0 : -t * DEPTH;
      const x = reduced.current ? 0 : side * driftX * tc;
      const y = reduced.current ? 0 : side * driftY * tc;
      const rot = reduced.current ? 0 : -side * 7 * tc;
      // Ahead: ghostly in the distance, solid at the focus. Passed: flies
      // toward the camera and dissolves.
      const opacity =
        t >= 0 ? clamp(1 - t * 0.55, 0, 1) : clamp(1 + t / 0.55, 0, 1);

      el.style.opacity = String(opacity);
      el.style.zIndex = String(Math.round(1000 - t * 100));
      el.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${y}px, ${z}px) rotateY(${rot}deg)`;
    });
  }, []);

  const progressFromScroll = useCallback(() => {
    const outer = outerRef.current;
    if (!outer) return 0;
    const rect = outer.getBoundingClientRect();
    const travel = rect.height - window.innerHeight;
    if (travel <= 0) return 0;
    return clamp(-rect.top / travel, 0, 1) * (n - 1);
  }, [n]);

  const tick = useCallback(() => {
    raf.current = 0;
    const diff = target.current - cur.current;
    cur.current =
      reduced.current || Math.abs(diff) < 0.0005
        ? target.current
        : cur.current + diff * EASE;
    apply();

    const nearest = Math.round(cur.current);
    if (nearest !== lastActive.current) {
      lastActive.current = nearest;
      setActive(nearest);
    }
    if (cur.current !== target.current) raf.current = requestAnimationFrame(tick);
  }, [apply]);

  useEffect(() => {
    if (!isMobile) return;
    reduced.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const onScroll = () => {
      target.current = progressFromScroll();
      if (!raf.current) raf.current = requestAnimationFrame(tick);
    };
    const onResize = () => {
      apply();
      onScroll();
    };

    // Start where the page already is (reloads mid-scroll).
    target.current = cur.current = progressFromScroll();
    lastActive.current = Math.round(cur.current);
    setActive(lastActive.current);
    apply();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (raf.current) cancelAnimationFrame(raf.current);
      raf.current = 0;
    };
  }, [isMobile, apply, progressFromScroll, tick]);

  // Newly mounted cards need their transform/opacity before they paint.
  useLayoutEffect(() => {
    apply();
  }, [active, apply]);

  const from = Math.max(0, active - BEHIND);
  const to = Math.min(n - 1, active + AHEAD);

  return (
    <div
      ref={outerRef}
      className="relative md:hidden"
      style={{ height: `calc(100svh + ${(n - 1) * STEP_SVH}svh)` }}
    >
      <div
        ref={stageRef}
        className="sticky top-0 h-[100svh] overflow-hidden bg-[radial-gradient(ellipse_at_center,#2b221d_0%,#14100e_70%)]"
        style={{ perspective: `${PERSPECTIVE}px` }}
      >
        {isMobile &&
          looks.slice(from, to + 1).map((look, k) => {
            const i = from + k;
            return (
              <div
                key={look.src}
                ref={(el) => void (cardRefs.current[i] = el)}
                className="absolute left-1/2 top-1/2 will-change-transform shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]"
                style={{
                  width: "var(--cw, 80vw)",
                  height: "var(--ch, 100vw)",
                  opacity: i === 0 ? 1 : 0,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <Image
                  src={look.src}
                  alt={look.alt}
                  fill
                  loading="eager"
                  sizes="100vw"
                  quality={PHOTO_QUALITY}
                  className="object-cover rounded-[2px]"
                />
              </div>
            );
          })}

        {/* Orientation: counter + thin progress line. */}
        <div className="pointer-events-none absolute bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-6 z-[2000] text-[11px] tracking-[0.3em] text-white/70">
          {String(active + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2000] h-[2px] bg-white/15">
          <div
            className="h-full bg-white/70 transition-[width] duration-300"
            style={{ width: `${((active + 1) / n) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
