import { redirect } from "next/navigation";
import { getProductById } from "@/lib/queries";
import EditProductForm from "@/components/admin/EditProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProductById(params.id);
  if (!product) redirect("/admin/products");
  return <EditProductForm product={product} />;
}
