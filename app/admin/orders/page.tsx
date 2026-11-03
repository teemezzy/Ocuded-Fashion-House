import { getOrders } from "@/lib/queries";
import OrdersTable from "@/components/admin/OrdersTable";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const orders = await getOrders();
  return <OrdersTable initial={orders} />;
}
