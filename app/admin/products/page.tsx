import { getProducts } from "@/lib/queries";
import ProductsManager from "@/components/admin/ProductsManager";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await getProducts();
  return <ProductsManager initial={products} />;
}
