import Link from "next/link";
import Reveal from "./Reveal";
import { getActiveProducts } from "@/lib/queries";
import { formatMoney, isSoldOut } from "@/lib/adminData";

const FALLBACK_BG = [
  "linear-gradient(155deg,#F1E7D3,#D7A568)",
  "linear-gradient(150deg,#E0A96A,#995230)",
  "linear-gradient(160deg,#E7CFA6,#B07434)",
];

export default async function ShopPreview() {
  const products = await getActiveProducts();

  return (
    <Reveal
      id="shop-preview"
      className="bg-offwhite text-ink py-[clamp(64px,9vw,120px)] px-[clamp(24px,7vw,80px)]"
    >
      <div className="max-w-[1240px] mx-auto">
        <div className="text-center mb-[clamp(28px,4vw,48px)]">
          <div className="text-[11px] tracking-[0.3em] uppercase text-label mb-[14px]">
            From the Shop
          </div>
          <h2 className="font-serif font-medium text-[clamp(1.9rem,3.6vw,2.8rem)] m-0">
            Bring a Piece of O_Cubed Home
          </h2>
        </div>

        {products.length === 0 ? (
          <p className="text-center text-[14px] text-muted">
            New pieces coming soon.
          </p>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-[clamp(20px,3vw,32px)]">
            {products.map((prod, i) => {
              const soldOut = isSoldOut(prod);
              return (
                <div
                  key={prod.id}
                  className="bg-white border border-[rgba(46,33,26,0.1)]"
                >
                  <div
                    className="h-[clamp(220px,26vw,320px)] bg-cover bg-center relative"
                    style={{
                      backgroundImage: prod.imageUrl
                        ? `url(${prod.imageUrl})`
                        : FALLBACK_BG[i % FALLBACK_BG.length],
                    }}
                  >
                    {soldOut && (
                      <span className="absolute top-[12px] left-[12px] text-[10px] tracking-[0.14em] uppercase bg-ink/70 text-bg rounded-[99px] py-[5px] px-[12px]">
                        Sold out
                      </span>
                    )}
                  </div>
                  <div className="p-[24px]">
                    <div className="font-serif text-[22px] font-semibold mb-[6px]">
                      {prod.title}
                    </div>
                    <div className="text-[13px] leading-[1.6] text-muted mb-[14px]">
                      {prod.description}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-[15px] text-ink">
                        {formatMoney(prod.price)}
                      </div>
                      {soldOut ? (
                        <span className="text-[12px] tracking-[0.14em] uppercase text-muted">
                          Sold out
                        </span>
                      ) : (
                        <Link
                          href={`/shop/${prod.id}`}
                          className="text-[12px] tracking-[0.14em] uppercase border-b border-rust text-rust pb-[2px] transition-colors hover:text-rust-dark hover:border-rust-dark"
                        >
                          Shop Now
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Reveal>
  );
}
