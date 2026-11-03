import Image from "next/image";
import Reveal from "./Reveal";
import { TIMELESS_PHOTO, PHOTO_QUALITY } from "@/lib/photos";

export default function Timeless() {
  return (
    <Reveal className="bg-offwhite text-ink py-[clamp(64px,9vw,120px)] px-[clamp(24px,7vw,80px)]">
      <div className="max-w-[1240px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-[clamp(32px,5vw,72px)] items-center">
        <div className="relative h-[clamp(280px,40vw,500px)] overflow-hidden">
          <Image
            src={TIMELESS_PHOTO}
            alt=""
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            quality={PHOTO_QUALITY}
            className="object-cover object-center"
          />
        </div>
        <div>
          <div className="text-[11px] tracking-[0.3em] uppercase text-label mb-[14px]">
            The Philosophy
          </div>
          <h2 className="font-serif font-medium text-[clamp(2rem,4vw,3.2rem)] leading-[1.18] mt-0 mb-[22px]">
            Timeless by Design
          </h2>
          <p className="text-[clamp(14px,1.1vw,17px)] leading-[1.85] m-0 text-muted max-w-[520px]">
            Your wedding gown should be more than beautiful—it should become part
            of your story. Inspired by the belief that true elegance never fades,
            we create bridal pieces that transcend trends and are treasured for
            generations. Every silhouette, every detail, and every finish is
            thoughtfully crafted to ensure your gown remains as memorable as the
            day you wear it.
          </p>
        </div>
      </div>
    </Reveal>
  );
}
