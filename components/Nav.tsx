"use client";

import { useEffect, useState } from "react";
import Logo from "./Logo";

const linkClass =
  "opacity-[0.85] transition-[opacity,color] duration-200 hover:opacity-100 hover:text-rust";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setNavOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-[background,box-shadow] duration-500 ease-out ${
          scrolled
            ? "bg-[rgba(251,246,238,0.96)] shadow-[0_2px_20px_rgba(46,33,26,0.12)]"
            : "bg-transparent shadow-none"
        }`}
      >
        <div className="flex items-center justify-between py-[23px] px-[clamp(20px,4vw,56px)]">
          {/* hamburger — mobile only */}
          <button
            aria-label="Open menu"
            onClick={() => setNavOpen(true)}
            className="flex md:hidden flex-col gap-[5px] bg-none border-none p-[8px] cursor-pointer"
          >
            <span className="w-[22px] h-[1.5px] bg-ink block" />
            <span className="w-[22px] h-[1.5px] bg-ink block" />
          </button>

          {/* left nav — desktop */}
          <nav className="hidden md:flex gap-[clamp(20px,3vw,44px)] text-[12.5px] tracking-[0.18em] uppercase font-normal">
            <a href="#home" className={linkClass}>
              Home
            </a>
            <a href="#booking-cta" className={linkClass}>
              Book a Consultation
            </a>
          </nav>

          {/* brand lock — centered */}
          <a
            href="#home"
            className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-[5px]"
          >
            <Logo size={26} />
            <div className="text-center">
              <div className="font-serif text-[clamp(17px,2vw,23px)] font-medium tracking-[0.24em] leading-none">
                O_CUBED
              </div>
              <div className="text-[clamp(6px,0.65vw,8px)] tracking-[0.46em] mt-[3px] text-brown-soft">
                FASHION HOUSE
              </div>
            </div>
          </a>

          {/* right nav — desktop */}
          <nav className="hidden md:flex gap-[clamp(20px,3vw,44px)] text-[12.5px] tracking-[0.18em] uppercase font-normal">
            <a href="#shop-preview" className={linkClass}>
              Shop
            </a>
          </nav>

          {/* spacer — mobile only, balances the hamburger */}
          <div className="block md:hidden w-[38px]" />
        </div>
      </header>

      {/* mobile nav overlay */}
      {navOpen && (
        <div className="fixed inset-0 z-[200] bg-bg flex flex-col items-center justify-center gap-9">
          <button
            aria-label="Close menu"
            onClick={() => setNavOpen(false)}
            className="absolute top-5 right-[22px] bg-none border-none p-[10px] cursor-pointer"
          >
            <div className="w-[20px] h-[1.5px] bg-ink rotate-45 relative top-[5px]" />
            <div className="w-[20px] h-[1.5px] bg-ink -rotate-45" />
          </button>
          <Logo size={46} />
          <a
            href="#home"
            onClick={() => setNavOpen(false)}
            className="font-serif text-[30px]"
          >
            Home
          </a>
          <a
            href="#booking-cta"
            onClick={() => setNavOpen(false)}
            className="font-serif text-[30px]"
          >
            Book a Consultation
          </a>
          <a
            href="#shop-preview"
            onClick={() => setNavOpen(false)}
            className="font-serif text-[30px]"
          >
            Shop
          </a>
        </div>
      )}
    </>
  );
}
