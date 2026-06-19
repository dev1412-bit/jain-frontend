import {
  LayoutDashboard, ShoppingBag, Download, Key,
  RefreshCw, Heart, Headphones, Bell, CreditCard,
  User, Settings, Store, LogOut, Activity
} from "lucide-react";

export const userMenu = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Orders", href: "/dashboard/orders", icon: ShoppingBag },
  { label: "Downloads", href: "/dashboard/downloads", icon: Download },
  { label: "Subscriptions", href: "/dashboard/subscriptions", icon: RefreshCw },
  { label: "Wishlist", href: "/dashboard/wishlist", icon: Heart },
  { label: "Support", href: "/dashboard/support", icon: Headphones },
  { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { label: "Billing History", href: "/dashboard/billing-history", icon: CreditCard },
  { label: "Profile", href: "/dashboard/profile", icon: User },
  { label: "Activity Log", href: "/dashboard/activities", icon: Activity },
  { label: "Settings", href: "/dashboard/settings", icon: Settings }
];
