"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { PHOTO_QUALITY } from "@/lib/photos";

/**
 * LOOKBOOK GRID — the desktop lookbook (md+).
 *
 * Offset columns (every other one dropped, echoing the hero triptych). Hovering
 * a photo brings it a little closer and softly dims the rest; clicking flies it
 * from its slot to a large centered view. Leaving it with the cursor, clicking
 * outside, Esc or scrolling flies it back.
 */

export type GridItem = { src: string; alt: string; caption: string };

const GRID_SIZES = "(min-width: 1024px) 25vw, 33vw";
const EASE = "cubic-bezier(.2,.7,.2,1)";
const FLY_MS = 550;
const FADE_MS = 400;

// Middle column of 3 (md) / columns 2 and 4 of 4 (lg) drop by --off.
const offset = (i: number) =>
  [
    i % 3 === 1 ? "md:translate-y-[var(--off)]" : "",
    (i % 4) % 2 === 1 ? "lg:translate-y-[var(--off)]" : "lg:translate-y-0",
  ].join(" ");

export default function LookbookGrid({ items }: { items: GridItem[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  return (
    <>
      <ul className="grid grid-cols-3 lg:grid-cols-4 gap-[14px] pb-[var(--off)] [--off:clamp(40px,6vw,96px)] [&:has(>li:hover)>li:not(:hover)]:opacity-75">
        {items.map((item, i) => (
          <li
            key={`${i}-${item.src}`}
            className={`relative transition-opacity duration-500 hover:z-10 ${offset(i)}`}
          >
            <button
              ref={(el) => void (buttons.current[i] = el)}
              type="button"
              aria-label={`Enlarge: ${item.alt}`}
              onClick={() => setOpen(i)}
              className="relative block w-full aspect-[4/5] overflow-hidden rounded-[2px] cursor-zoom-in transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(.2,.7,.2,1)] motion-safe:hover:scale-[1.05] hover:shadow-[0_24px_50px_-18px_rgba(46,33,26,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rust"
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes={GRID_SIZES}
                quality={PHOTO_QUALITY}
                className="object-cover"
              />
              {item.caption && (
                <span className="absolute bottom-[12px] left-[12px] text-[10px] tracking-[0.1em] uppercase text-bg bg-ink/40 backdrop-blur-sm rounded-[99px] py-[4px] px-[10px]">
                  {item.caption}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>

      {open !== null && buttons.current[open] && (
        <Zoom
          item={items[open]}
          origin={buttons.current[open] as HTMLButtonElement}
          onClosed={() => setOpen(null)}
        />
      )}
    </>
  );
}

type Box = { x: number; y: number; w: number; h: number };

// Large, centered, 4:5 — as big as fits in 86% of the height / 90% of the width.
function targetBox(): Box {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const h = Math.min(vh * 0.86, (vw * 0.9) / 0.8);
  const w = h * 0.8;
  return { x: (vw - w) / 2, y: (vh - h) / 2, w, h };
}

// The transform that lays the target box exactly over `from` (both are 4:5).
const flip = (from: DOMRect, to: Box) =>
  `translate(${from.left - to.x}px, ${from.top - to.y}px) scale(${from.width / to.w})`;

function Zoom({
  item,
  origin,
  onClosed,
}: {
  item: GridItem;
  origin: HTMLButtonElement;
  onClosed: () => void;
}) {
  const figRef = useRef<HTMLDivElement>(null);
  const [box] = useState(targetBox);
  const [from, setFrom] = useState(() => origin.getBoundingClientRect());
  const [shown, setShown] = useState(false);
  const [hiRes, setHiRes] = useState(false);
  const [reduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const closing = useRef(false);
  const settled = useRef(false); // finished flying in
  const armed = useRef(false); // cursor has been on the zoomed photo

  const close = () => {
    if (closing.current) return;
    closing.current = true;
    setFrom(origin.getBoundingClientRect()); // fly back to wherever the slot is now
    setShown(false);
    window.setTimeout(onClosed, reduced ? FADE_MS : FLY_MS);
  };
  const closeRef = useRef(close);
  closeRef.current = close;

  useEffect(() => {
    // The photo leaves its slot while zoomed.
    origin.style.visibility = "hidden";
    figRef.current?.focus({ preventScroll: true });

    // Two frames so the starting transform is painted before it's cleared.
    let raf = requestAnimationFrame(() => {
      raf = requestAnimationFrame(() => setShown(true));
    });
    const settle = window.setTimeout(
      () => void (settled.current = true),
      reduced ? FADE_MS : FLY_MS
    );

    const shut = () => closeRef.current();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && shut();
    window.addEventListener("keydown", onKey);
    window.addEventListener("wheel", shut, { passive: true });
    window.addEventListener("scroll", shut, { passive: true });
    window.addEventListener("resize", shut);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(settle);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("wheel", shut);
      window.removeEventListener("scroll", shut);
      window.removeEventListener("resize", shut);
      origin.style.visibility = "";
      origin.focus({ preventScroll: true });
    };
  }, [origin, reduced]);

  return createPortal(
    <>
      <div
        aria-hidden="true"
        onClick={close}
        className="fixed inset-0 z-[100] bg-ink/60 cursor-zoom-out"
        style={{
          opacity: shown ? 1 : 0,
          transition: `opacity ${FADE_MS}ms ease`,
        }}
      />
      <div
        ref={figRef}
        role="dialog"
        aria-modal="true"
        aria-label={item.alt}
        tabIndex={-1}
        // Only arm "leave to close" once it has landed and the cursor is on it;
        // otherwise a photo flying away from a still cursor would close itself.
        onPointerMove={() => {
          if (settled.current) armed.current = true;
        }}
        onPointerLeave={() => {
          if (armed.current) close();
        }}
        className="fixed z-[101] overflow-hidden rounded-[2px] shadow-[0_40px_120px_-30px_rgba(0,0,0,0.7)] outline-none"
        style={{
          left: box.x,
          top: box.y,
          width: box.w,
          height: box.h,
          transformOrigin: "top left",
          transform: reduced || shown ? "none" : flip(from, box),
          opacity: reduced && !shown ? 0 : 1,
          transition: reduced
            ? `opacity ${FADE_MS}ms ease`
            : `transform ${FLY_MS}ms ${EASE}`,
        }}
      >
        {/* Same image the grid already loaded — instant. */}
        <Image
          src={item.src}
          alt=""
          fill
          sizes={GRID_SIZES}
          quality={PHOTO_QUALITY}
          loading="eager"
          className="object-cover"
        />
        {/* Full resolution, faded in once it arrives. */}
        <Image
          src={item.src}
          alt={item.alt}
          fill
          sizes="70vh"
          quality={PHOTO_QUALITY}
          loading="eager"
          onLoad={() => setHiRes(true)}
          className="object-cover transition-opacity duration-300"
          style={{ opacity: hiRes ? 1 : 0 }}
        />
      </div>
    </>,
    document.body
  );
}
