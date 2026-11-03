"use client";

import { useEffect, useState } from "react";

function timeGreeting(h: number): string {
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function Greeting({ firstName }: { firstName: string }) {
  // Compute after mount so it uses the viewer's local time (avoids SSR mismatch).
  const [greeting, setGreeting] = useState<string | null>(null);
  useEffect(() => {
    setGreeting(timeGreeting(new Date().getHours()));
  }, []);

  return (
    <>
      {greeting ?? "Welcome"}, {firstName}
    </>
  );
}
