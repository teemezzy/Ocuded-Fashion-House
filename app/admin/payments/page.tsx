import { formatDate, formatMoney } from "@/lib/adminData";
import { getPayments } from "@/lib/queries";
import { PageHeader, Card, Badge } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function PaymentsPage() {
  const payments = await getPayments();
  const total = payments
    .filter((p) => p.status === "success")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div>
      <PageHeader
        title="Payments"
        subtitle={`${payments.length} transactions via Paystack`}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-[16px] mb-[24px]">
        <Card className="p-[20px]">
          <div className="text-[11px] tracking-[0.18em] uppercase text-label mb-[8px]">
            Total collected
          </div>
          <div className="font-serif text-[30px] text-ink leading-none">
            {formatMoney(total)}
          </div>
        </Card>
        <Card className="p-[20px]">
          <div className="text-[11px] tracking-[0.18em] uppercase text-label mb-[8px]">
            Successful
          </div>
          <div className="font-serif text-[30px] text-ink leading-none">
            {payments.filter((p) => p.status === "success").length}
          </div>
        </Card>
        <Card className="p-[20px]">
          <div className="text-[11px] tracking-[0.18em] uppercase text-label mb-[8px]">
            Refunded
          </div>
          <div className="font-serif text-[30px] text-ink leading-none">
            {payments.filter((p) => p.status === "refunded").length}
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-cream2 text-label text-[11px] tracking-[0.14em] uppercase">
                <th className="px-[16px] py-[13px] font-medium">Client</th>
                <th className="px-[16px] py-[13px] font-medium">Amount</th>
                <th className="px-[16px] py-[13px] font-medium">Date</th>
                <th className="px-[16px] py-[13px] font-medium">Reference</th>
                <th className="px-[16px] py-[13px] font-medium">Appointment</th>
                <th className="px-[16px] py-[13px] font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="text-[13.5px] text-ink">
              {payments.map((p) => (
                <tr
                  key={p.id}
                  className="border-t border-ink/10 hover:bg-cream2/50 transition-colors"
                >
                  <td className="px-[16px] py-[13px]">{p.name}</td>
                  <td className="px-[16px] py-[13px]">{formatMoney(p.amount)}</td>
                  <td className="px-[16px] py-[13px]">{formatDate(p.date)}</td>
                  <td className="px-[16px] py-[13px] font-mono text-[12.5px] text-muted">
                    {p.reference}
                  </td>
                  <td className="px-[16px] py-[13px] text-muted">
                    {p.appointmentId}
                  </td>
                  <td className="px-[16px] py-[13px]">
                    <Badge
                      className={
                        p.status === "success"
                          ? "bg-rust/10 text-rust-dark border border-rust/40"
                          : "bg-ink/[0.05] text-muted border border-ink/15"
                      }
                    >
                      {p.status === "success" ? "Success" : "Refunded"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
