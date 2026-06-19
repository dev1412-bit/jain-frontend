import {
  LayoutDashboard, Package, ShoppingCart,
  Tags, TicketPercent, BarChart3, Settings,
  Users, Image, DollarSign, FileText,
  Headphones, MonitorPlay, Activity,
  Bell,
} from "lucide-react";

export const adminMenu = [
  { label: "Overview",          href: "/admin",              icon: LayoutDashboard },
  { label: "Products",          href: "/admin/products",     icon: Package         },
  { label: "Orders",            href: "/admin/orders",       icon: ShoppingCart    },
  { label: "Customers",         href: "/admin/customers",    icon: Users           },
  { label: "Blogs",             href: "/admin/blogs",         icon: MonitorPlay           },
  { label: "Analytics",         href: "/admin/analytics",    icon: BarChart3       },
  { label: "Activity Logs",     href: "/admin/activities",   icon: Activity       },
  { label: "Support",           href: "/admin/support",         icon: Headphones     },
  { label: "Discounts",         href: "/admin/discounts",    icon: TicketPercent   },
  { label: "Categories",        href: "/admin/categories",   icon: Tags            },
  { label: "Media Library",     href: "/admin/media",        icon: Image           },
  { label: "Pricing Management", href: "/admin/pricing",      icon: DollarSign      },
  { label: "Notifications",     href: "/admin/notifications",  icon: Bell      },
  { label: "CMS",               href: "/admin/website-cms",   icon: FileText        },
  { label: "Settings",          href: "/admin/settings",     icon: Settings        },
];
