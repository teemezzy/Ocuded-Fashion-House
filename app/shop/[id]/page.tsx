import Link from "next/link";
import { redirect } from "next/navigation";
import Logo from "@/components/Logo";
import BuyForm from "@/components/shop/BuyForm";
import { getProductById } from "@/lib/queries";
import { formatMoney, isSoldOut } from "@/lib/adminData";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProductById(params.id);
  if (!product || !product.active) redirect("/#shop-preview");
  const soldOut = isSoldOut(product);

  return (
    <div className="min-h-screen bg-cream2/40 px-[clamp(20px,5vw,64px)] py-[clamp(28px,5vw,56px)]">
      <div className="max-w-[900px] mx-auto">
        <div className="flex items-center justify-between mb-[28px]">
          <Link href="/" className="flex items-center gap-[10px]">
            <Logo size={26} />
            <span className="font-serif text-[16px] tracking-[0.2em] text-ink">
              O_CUBED
            </span>
          </Link>
          <Link
            href="/#shop-preview"
            className="text-[12px] tracking-[0.1em] uppercase text-muted hover:text-rust transition-colors"
          >
            ← Shop
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-[clamp(24px,4vw,48px)] items-start">
          <div
            className="aspect-square rounded-[14px] border border-ink/10 bg-cover bg-center bg-[linear-gradient(155deg,#F1E7D3,#D7A568)]"
            style={
              product.imageUrl
                ? { backgroundImage: `url(${product.imageUrl})` }
                : undefined
            }
          />
          <div>
            <h1 className="font-serif text-[clamp(1.7rem,3vw,2.4rem)] text-ink leading-tight">
              {product.title}
            </h1>
            <div className="font-serif text-[22px] text-rust mt-[6px] mb-[16px]">
              {formatMoney(product.price)}
            </div>
            <p className="text-[14px] leading-[1.8] text-muted font-light mb-[24px]">
              {product.description}
            </p>
            {soldOut ? (
              <div className="rounded-[10px] border border-ink/15 bg-cream2/60 px-[18px] py-[16px] text-[14px] text-ink">
                This piece is currently{" "}
                <span className="font-medium">sold out</span>. Please check back
                soon.
              </div>
            ) : (
              <BuyForm
                productId={product.id}
                priceLabel={formatMoney(product.price)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
