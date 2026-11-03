import Link from "next/link";
import Logo from "@/components/Logo";
import { getOrderByRef, confirmOrderByRef } from "@/lib/queries";
import { verifyTransaction } from "@/lib/paystack";
import { isPaystackConfigured } from "@/lib/env";
import { formatMoney } from "@/lib/adminData";

export const dynamic = "force-dynamic";

export default async function ShopConfirmedPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const ref =
    typeof searchParams.ref === "string" ? searchParams.ref : undefined;

  if (ref && isPaystackConfigured) {
    try {
      const v = await verifyTransaction(ref);
      if (v && v.status === "success") await confirmOrderByRef(ref);
    } catch {
      // webhook is the source of truth
    }
  }

  const order = ref ? await getOrderByRef(ref) : null;

  return (
    <div className="relative min-h-screen flex items-center justify-center text-center px-[24px] py-[48px] overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(160deg,#A85D34,#7E4526_62%,#3F2413)]" />
      <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_30%,rgba(214,168,116,0.25),rgba(214,168,116,0)_70%)]" />

      <div className="relative max-w-[520px] text-bg w-full">
        <div className="flex justify-center mb-[20px]">
          <Logo size={50} color="#F1E7D3" />
        </div>
        <div className="font-script text-clay-light text-[clamp(2.4rem,6vw,3.6rem)] leading-[1.15]">
          Thank you{order ? `, ${order.customerName.split(" ")[0]}` : ""}!
        </div>
        <p className="text-[15px] leading-[1.8] text-[rgba(251,246,238,0.85)] font-light mt-[14px] mb-[26px]">
          Your order has been received. We&rsquo;ll email you the details and
          get it on its way to you.
        </p>

        {order && (
          <div className="bg-bg/10 border border-bg/20 rounded-[14px] p-[20px] text-left backdrop-blur-sm mb-[8px]">
            <div className="flex items-center justify-between py-[6px]">
              <span className="text-[12px] tracking-[0.1em] uppercase text-[rgba(251,246,238,0.6)]">
                Item
              </span>
              <span className="text-[14px] text-bg">{order.productTitle}</span>
            </div>
            <div className="flex items-center justify-between py-[6px]">
              <span className="text-[12px] tracking-[0.1em] uppercase text-[rgba(251,246,238,0.6)]">
                Amount
              </span>
              <span className="text-[14px] text-bg">
                {formatMoney(order.amount)}
              </span>
            </div>
          </div>
        )}

        <Link
          href="/"
          className="inline-block mt-[26px] bg-clay text-[#3A2213] text-[13px] tracking-[0.18em] uppercase px-[30px] py-[15px] rounded-[10px] hover:bg-clay-hover transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
