import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  Users,
  ShoppingBag,
  ShieldAlert,
  Grid3X3,
  LineChart,
  CreditCard,
} from "lucide-react";

import { getCurrentUser } from "@/app/actions/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user || (user.role !== "admin" && user.role !== "super_admin")) {
    redirect("/ora-owners/auth/login");
  }

  return (
    <div className="min-h-screen bg-background flex dark">
      {/* Admin Sidebar */}
      <aside className="w-64 border-r border-border bg-card p-6 flex flex-col">
        <div className="flex items-center gap-2 mb-10 text-primary">
          <ShieldAlert size={28} />
          <span className="font-bold text-xl tracking-tight font-heading">
            Ora Owners
          </span>
        </div>

        <nav className="space-y-1 flex-1">
          <Link
            href="/ora-owners/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
          >
            <LayoutDashboard size={18} />
            Dashboard
          </Link>
          <Link
            href="/ora-owners/applications"
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
          >
            <FileText size={18} />
            Applications
          </Link>
          <Link
            href="/ora-owners/users"
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
          >
            <Users size={18} />
            Users
          </Link>
          <Link
            href="/ora-owners/stores"
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
          >
            <ShoppingBag size={18} />
            Stores
          </Link>
          <div className="h-px bg-border my-2 mx-3" />
          <Link
            href="/ora-owners/categories"
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
          >
            <Grid3X3 size={18} />
            Categories
          </Link>
          <div className="h-px bg-border my-2 mx-3" />
          <Link
            href="/ora-owners/subscriptions"
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
          >
            <CreditCard size={18} />
            Subscriptions
          </Link>
          <div className="h-px bg-border my-2 mx-3" />
          <Link
            href="/ora-owners/analytics"
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
          >
            <LineChart size={18} />
            Analytics
          </Link>
          <div className="h-px bg-border my-2 mx-3" />
          <Link
            href="/ora-owners/reports"
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
          >
            <FileText size={18} />
            Reports
          </Link>

          {/* Super Admin Only */}
          {user.role === "super_admin" && (
            <>
              <div className="h-px bg-border my-2 mx-3" />
              <Link
                href="/ora-owners/admins"
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
              >
                <Users size={18} />
                Admins
              </Link>
            </>
          )}
        </nav>

        <div className="text-xs text-muted-foreground border-t border-border pt-4">
          Super Admin View
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background">{children}</main>
    </div>
  );
}
