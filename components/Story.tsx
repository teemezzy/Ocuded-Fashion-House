import Image from "next/image";
import Reveal from "./Reveal";
import { STORY_PHOTO, PHOTO_QUALITY } from "@/lib/photos";

export default function Story() {
  return (
    <Reveal className="bg-offwhite py-[clamp(64px,9vw,120px)] px-[clamp(24px,7vw,80px)]">
      <div className="max-w-[1240px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-[clamp(32px,5vw,72px)] items-center">
        <div>
          <div className="text-[11px] tracking-[0.3em] uppercase text-label mb-[14px]">
            Our Story
          </div>
          <p className="font-serif italic text-[clamp(1.3rem,2.4vw,1.85rem)] leading-[1.5] mt-0 mb-[22px] text-ink">
            At O_Cubed Fashion House, we believe every bride deserves to feel
            extraordinary.
          </p>
          <p className="text-[clamp(14px,1.1vw,16.5px)] leading-[1.85] mt-0 mb-[34px] text-muted font-light">
            Founded on the desire to help women create memories that last a
            lifetime, we design bridal gowns that celebrate confidence,
            femininity, and timeless beauty. Every gown is thoughtfully created
            to honour your story, complement your individuality, and become a
            cherished part of your wedding journey.
          </p>
          <p className="font-script text-[clamp(2rem,3.6vw,2.9rem)] leading-[1.25] m-0 text-rust">
            Because while weddings last a day,
            <br />
            the memories last forever.
          </p>
        </div>
        <div className="relative h-[clamp(300px,42vw,520px)] overflow-hidden">
          <Image
            src={STORY_PHOTO}
            alt=""
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            quality={PHOTO_QUALITY}
            className="object-cover object-center"
          />
        </div>
      </div>
    </Reveal>
  );
}
