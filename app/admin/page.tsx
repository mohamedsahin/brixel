import { isAdminAuthed } from "@/lib/admin-auth";
import { getDashboard, getPackages } from "@/lib/data";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin", robots: { index: false } };

export default async function AdminPage() {
  if (!isAdminAuthed()) return <AdminLogin />;
  const [data, packages] = await Promise.all([getDashboard(), getPackages()]);
  // Serialize Dates → strings for the client component.
  return <AdminDashboard data={JSON.parse(JSON.stringify(data))} packages={packages} />;
}
