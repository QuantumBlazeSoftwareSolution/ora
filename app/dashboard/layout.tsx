import { Sidebar } from "@/components/dashboard/sidebar";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/business/login");
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <Sidebar />
      <main className="md:pl-64 min-h-screen">
        <div className="p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
