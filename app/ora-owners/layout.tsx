import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  Users,
  ShoppingBag,
  ShieldAlert,
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-rose-500/30 flex">
      {/* Admin Sidebar */}
      <aside className="w-64 border-r border-neutral-800 p-6 flex flex-col">
        <div className="flex items-center gap-2 mb-10 text-rose-500">
          <ShieldAlert size={24} />
          <span className="font-bold text-lg tracking-tight">Ora Owners</span>
        </div>

        <nav className="space-y-1 flex-1">
          <Link
            href="/ora-owners/dashboard"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-neutral-300 hover:text-white hover:bg-neutral-900 rounded-md transition-colors"
          >
            <LayoutDashboard size={18} />
            Dashboard
          </Link>
          <Link
            href="/ora-owners/applications"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-neutral-300 hover:text-white hover:bg-neutral-900 rounded-md transition-colors"
          >
            <FileText size={18} />
            Applications
          </Link>
          <Link
            href="/ora-owners/users"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-neutral-300 hover:text-white hover:bg-neutral-900 rounded-md transition-colors"
          >
            <Users size={18} />
            Users
          </Link>
          <Link
            href="/ora-owners/stores"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-neutral-300 hover:text-white hover:bg-neutral-900 rounded-md transition-colors"
          >
            <ShoppingBag size={18} />
            Stores
          </Link>
        </nav>

        <div className="text-xs text-neutral-600 border-t border-neutral-900 pt-4">
          Super Admin View
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-neutral-950">{children}</main>
    </div>
  );
}
