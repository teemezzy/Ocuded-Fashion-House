import Reveal from "./Reveal";
import Lookbook from "./Lookbook";
import LookbookGrid from "./LookbookGrid";
import { getActiveGallery } from "@/lib/queries";
import { LOOKBOOK_PHOTOS } from "@/lib/photos";

// Lookbook fallback photos (used only here) until the admin adds gallery items.
const FALLBACK_PHOTOS = LOOKBOOK_PHOTOS.map((imageUrl, i) => ({
  id: `f-${i}`,
  imageUrl,
  caption: "",
}));

// Desktop (md+): offset grid with hover/zoom. Mobile: sticky stack with depth.
export default async function Gallery() {
  const dbItems = await getActiveGallery();
  const dbPhotos = dbItems.filter((g) => g.imageUrl);
  const photos = dbPhotos.length > 0 ? dbPhotos : FALLBACK_PHOTOS;

  const looks = photos.map((g, i) => ({
    src: g.imageUrl as string,
    alt: g.caption || `O_Cubed bridal gown, look ${i + 1}`,
  }));

  return (
    <>
      <Reveal className="bg-bg text-ink pt-[clamp(64px,9vw,120px)] pb-[clamp(28px,4vw,48px)] md:pb-[clamp(64px,9vw,120px)] px-[clamp(24px,7vw,80px)]">
        <div className="max-w-[1320px] mx-auto">
          <div className="text-center md:mb-[clamp(28px,4vw,48px)]">
            <div className="text-[11px] tracking-[0.3em] uppercase text-label mb-[14px]">
              The Lookbook
            </div>
            <h2 className="font-serif font-medium text-[clamp(1.9rem,3.6vw,2.8rem)] m-0">
              Gowns We&rsquo;ve Loved Creating
            </h2>
          </div>

          {/* Lazy-loaded, so these aren't fetched while hidden on mobile. */}
          <div className="hidden md:block">
            <LookbookGrid
              items={looks.map((l, i) => ({ ...l, caption: photos[i].caption }))}
            />
          </div>
        </div>
      </Reveal>

      <Lookbook looks={looks} />
    </>
  );
}
