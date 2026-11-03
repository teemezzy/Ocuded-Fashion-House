"use client";

import { useEffect, useRef, useState } from "react";

export default function Reveal({
  id,
  className = "",
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            obs.unobserve(entry.target);
          }
        });
      },
      // Reveal as soon as any part enters (a bit early). threshold 0 avoids
      // tall sections — like the Lookbook on mobile — never crossing a % gate.
      { threshold: 0, rootMargin: "0px 0px -10% 0px" }
    );
    obs.observe(el);

    // Safety net: if it's already on screen at mount, reveal immediately.
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) setInView(true);

    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id={id}
      data-reveal
      className={`${className} transition-all duration-1000 ease-out ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-7"
      }`}
    >
      {children}
    </section>
  );
}
