import { getSettings, getAllowedAdmins } from "@/lib/queries";
import SettingsEditor from "@/components/admin/SettingsEditor";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const [settings, admins] = await Promise.all([
    getSettings(),
    getAllowedAdmins(),
  ]);
  return <SettingsEditor initialSettings={settings} initialAdmins={admins} />;
}
