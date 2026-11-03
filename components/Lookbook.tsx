"use client";

import { useMediaQuery } from "@/lib/useMediaQuery";
import LookbookStack, { type Look } from "./LookbookStack";

// Mobile only (< md): the sticky stack. Desktop has the masonry grid in
// Gallery, so nothing mounts there and none of these photos are requested. The
// section is far below the fold, so the pre-hydration placeholder is swapped
// long before anyone reaches it.
export default function Lookbook({ looks }: { looks: Look[] }) {
  const isMobile = useMediaQuery("(max-width: 767px)");

  if (isMobile === null) {
    return <div className="h-[100svh] bg-[#14100e] md:hidden" />;
  }
  return isMobile ? <LookbookStack looks={looks} /> : null;
}
