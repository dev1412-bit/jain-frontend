"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, ShoppingBag, Download, Key,
  RefreshCw, Heart, Headphones, Bell, CreditCard,
  User, Settings, Store, LogOut, Activity
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";

const menuItems = [
  { label: "Overview",       href: "/dashboard",                    icon: LayoutDashboard },
  { label: "My Orders",      href: "/dashboard/orders",             icon: ShoppingBag     },
  { label: "Downloads",      href: "/dashboard/downloads",          icon: Download        },
  { label: "Subscriptions",  href: "/dashboard/subscriptions",      icon: RefreshCw       },
  { label: "Wishlist",       href: "/dashboard/wishlist",           icon: Heart,  badge: 3 },
  { label: "Support",        href: "/dashboard/support",            icon: Headphones, badge: 1 },
  { label: "Notifications",  href: "/dashboard/notifications",      icon: Bell,   badge: 4 },
  { label: "Billing History",href: "/dashboard/billing-history",    icon: CreditCard      },
  { label: "Activity Log",   href: "/dashboard/activities",    icon: Activity },
  { label: "Profile",        href: "/dashboard/profile",            icon: User            },
  { label: "Settings",       href: "/dashboard/settings",           icon: Settings        },
];

export default function UserSidebar() {
  const pathname  = usePathname();
  const router    = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  // member since year
  const memberSince = user ? "Jan 2026" : "";

  return (
    <aside className="w-52 shrink-0 flex flex-col">
      {/* User info */}
      <div className="bg-background border border-border rounded-2xl p-4 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center text-white font-bold text-sm shrink-0">
            {user?.name?.charAt(0).toUpperCase() ?? "U"}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{user?.name ?? "User"}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email ?? ""}</p>
          </div>
        </div>
        <div className="mt-2.5 flex items-center gap-2">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand/10 text-brand">
            Pro Member
          </span>
          <span className="text-[10px] text-muted-foreground">Since {memberSince}</span>
        </div>
      </div>

      {/* Nav */}
      <div className="bg-background border border-border rounded-2xl p-2 flex-1">
        <nav className="space-y-0.5">
          {menuItems.map((item) => {
            const Icon   = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between gap-2.5 rounded-xl px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-brand/10 text-brand font-semibold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </div>
                {item.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-brand text-white min-w-[18px] text-center">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="mt-3 pt-3 border-t border-border space-y-0.5">
          <Link
            href="/store"
            className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Store className="h-4 w-4" />
            Browse Store
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}