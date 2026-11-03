import Logo from "./Logo";

// Social / contact links. Update these hrefs to the real O_Cubed handles.
const SOCIALS = [
  {
    name: "Instagram",
    icon: "/icon/instagram-2-1-logo-svgrepo-com.svg",
    href: "https://instagram.com/o_cubed",
  },
  {
    name: "WhatsApp",
    icon: "/icon/whatsapp-color-svgrepo-com.svg",
    href: "https://wa.me/2348000000000",
  },
  {
    name: "Facebook",
    icon: "/icon/facebook-svgrepo-com.svg",
    href: "https://facebook.com/ocubed",
  },
  {
    name: "TikTok",
    icon: "/icon/tiktok-svgrepo-com.svg",
    href: "https://tiktok.com/@ocubed",
  },
  {
    name: "Pinterest",
    icon: "/icon/pinterest-color-svgrepo-com.svg",
    href: "https://pinterest.com/ocubed",
  },
  {
    name: "X",
    icon: "/icon/x-social-media-black-icon.svg",
    href: "https://x.com/ocubed",
  },
  {
    name: "LinkedIn",
    icon: "/icon/linkedin-color-svgrepo-com.svg",
    href: "https://linkedin.com/company/ocubed",
  },
];

export default function Footer() {
  return (
    <footer className="bg-footer-bg py-[clamp(48px,6vw,72px)] px-[clamp(24px,7vw,64px)] pb-[clamp(28px,4vw,40px)] text-[#F3E9DC]">
      <div className="max-w-[1240px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr] gap-[clamp(32px,5vw,48px)]">
        <div>
          <div className="flex items-center gap-[12px] mb-[18px]">
            <Logo size={34} color="#C08A4A" />
            <div>
              <div className="font-serif text-[20px] font-medium tracking-[0.22em] leading-none">
                O_CUBED
              </div>
              <div className="text-[8px] tracking-[0.4em] text-clay mt-[3px]">
                FASHION HOUSE
              </div>
            </div>
          </div>
          <p className="text-[13px] leading-[1.8] text-[rgba(243,233,220,0.6)] font-light max-w-[280px] m-0">
            Bespoke bridal gowns, thoughtfully designed and meticulously
            handcrafted in Lagos, Nigeria.
          </p>
        </div>
        <div>
          <div className="text-[11px] tracking-[0.2em] uppercase text-clay mb-[16px]">
            Connect
          </div>
          <div className="flex flex-wrap gap-[10px] mb-[18px]">
            {SOCIALS.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.name}
                title={s.name}
                className="w-[38px] h-[38px] rounded-full bg-[#F3E9DC] flex items-center justify-center transition-transform hover:scale-110"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.icon} alt={s.name} className="w-[19px] h-[19px]" />
              </a>
            ))}
          </div>
          <div className="text-[13px] leading-[1.8] text-[rgba(243,233,220,0.6)] font-light">
            12 Kingsway Road
            <br />
            Ikoyi, Lagos, Nigeria
          </div>
        </div>
        <div>
          <div className="text-[11px] tracking-[0.2em] uppercase text-clay mb-[16px]">
            Explore
          </div>
          <div className="flex flex-col gap-[12px] text-[13px]">
            <a
              href="#home"
              className="text-[rgba(243,233,220,0.75)] transition-colors hover:text-clay"
            >
              Home
            </a>
            <a
              href="#booking-cta"
              className="text-[rgba(243,233,220,0.75)] transition-colors hover:text-clay"
            >
              Book a Consultation
            </a>
            <a
              href="#shop-preview"
              className="text-[rgba(243,233,220,0.75)] transition-colors hover:text-clay"
            >
              Shop
            </a>
          </div>
        </div>
      </div>
      <div className="max-w-[1240px] mx-auto mt-[clamp(40px,5vw,56px)] pt-[20px] border-t border-[rgba(243,233,220,0.1)] text-[11.5px] text-[rgba(243,233,220,0.4)] text-center">
        © 2026 O_Cubed Fashion House. All rights reserved.
      </div>
    </footer>
  );
}
