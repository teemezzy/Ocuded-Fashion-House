"use client";

import { useEffect, useState } from "react";

/**
 * Reveals text one character at a time as if it's being handwritten,
 * using per-character CSS animation delays. Calls onDone when finished.
 */
export default function AnimatedScript({
  text,
  className = "",
  charDelay = 60,
  startDelay = 0,
  showCaret = true,
  onDone,
}: {
  text: string;
  className?: string;
  charDelay?: number;
  startDelay?: number;
  showCaret?: boolean;
  onDone?: () => void;
}) {
  const [done, setDone] = useState(false);
  const chars = Array.from(text);
  const total = startDelay + chars.length * charDelay + 400;

  useEffect(() => {
    const t = setTimeout(() => {
      setDone(true);
      onDone?.();
    }, total);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <span className={className} aria-label={text}>
      {chars.map((ch, i) => (
        <span
          key={i}
          aria-hidden="true"
          style={{
            display: "inline-block",
            whiteSpace: "pre",
            opacity: 0,
            animation: "handwrite 0.45s ease forwards",
            animationDelay: `${startDelay + i * charDelay}ms`,
          }}
        >
          {ch}
        </span>
      ))}
      {showCaret && !done && (
        <span
          aria-hidden="true"
          style={{
            display: "inline-block",
            animation: "caretBlink 0.9s step-end infinite",
          }}
        >
          |
        </span>
      )}
    </span>
  );
}
