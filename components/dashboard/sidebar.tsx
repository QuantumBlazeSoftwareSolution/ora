"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ShoppingBag,
  Calendar,
  Settings,
  LogOut,
  Sparkles,
} from "lucide-react";
import { logoutAction } from "@/app/actions/auth";
import { useRouter } from "next/navigation";

const sidebarItems = [
  { href: "/business/dashboard", icon: LayoutDashboard, label: "Overview" },
  {
    href: "/business/dashboard/products",
    icon: ShoppingBag,
    label: "Products",
  },
  { href: "/business/dashboard/services", icon: Sparkles, label: "Services" },
  { href: "/business/dashboard/bookings", icon: Calendar, label: "Bookings" },
  { href: "/business/dashboard/settings", icon: Settings, label: "Settings" },
];

interface SidebarProps {
  businessName?: string;
  businessLogo?: string;
}

export function Sidebar({ businessName, businessLogo }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAction();
    router.push("/business/login");
  };

  return (
    <aside className="w-64 bg-card border-r h-screen fixed inset-y-0 left-0 hidden md:flex flex-col">
      <div className="h-auto flex flex-col gap-4 p-6 border-b">
        {/* Ora Logo */}
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-primary">
          <div className="w-6 h-6 bg-black rounded text-white flex items-center justify-center text-sm">
            O
          </div>
          ra.
        </div>

        {/* Business Profile */}
        {businessName && (
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl border border-border/50">
            {businessLogo ? (
              <img
                src={businessLogo}
                alt={businessName}
                className="w-10 h-10 rounded-lg object-cover border border-border"
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-lg border border-primary/20">
                {businessName.substring(0, 1).toUpperCase()}
              </div>
            )}
            <div className="flex flex-col overflow-hidden">
              <span className="font-bold text-sm truncate">{businessName}</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                Business
              </span>
            </div>
          </div>
        )}
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-destructive hover:bg-destructive/10 w-full transition-colors"
        >
          <LogOut size={18} />
          Log Out
        </button>
      </div>
    </aside>
  );
}
