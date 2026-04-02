import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { AdminShell } from "../components/AdminShell";
import { ShieldX } from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: isAdmin } = await supabase.rpc("is_project_admin", {
    check_project_slug: "merch",
  });

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto">
            <ShieldX className="w-8 h-8 text-red-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Access Denied</h1>
            <p className="text-sm text-slate-500 mt-1 max-w-xs">
              You don&apos;t have admin permissions for the merch store.
              Contact an ESN Porto admin if you need access.
            </p>
          </div>
          <p className="text-xs text-slate-400">{user.email}</p>
        </div>
      </div>
    );
  }

  return <AdminShell email={user.email ?? ""}>{children}</AdminShell>;
}
