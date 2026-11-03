import { getGallery } from "@/lib/queries";
import GalleryManager from "@/components/admin/GalleryManager";

export const dynamic = "force-dynamic";

export default async function GalleryAdminPage() {
  const items = await getGallery();
  return <GalleryManager initial={items} />;
}
