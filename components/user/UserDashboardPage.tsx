"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useUserDashboardStore } from "@/store/userDashboardStore";
import {
  ShoppingBag, Key, Download, CreditCard,
  Package, RefreshCw, Star, Headphones,
  Ticket, ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { cn } from "@/lib/utils";

const activityMeta: Record<string, { icon: any; color: string }> = {
  order_placed:    { icon: ShoppingBag, color: "bg-pink-100 text-pink-500"    },
  download:        { icon: Download,    color: "bg-blue-100 text-blue-500"    },
  license_renewed: { icon: RefreshCw,   color: "bg-green-100 text-green-500"  },
  ticket_resolved: { icon: Headphones,  color: "bg-orange-100 text-orange-500"},
  review_left:     { icon: Star,        color: "bg-purple-100 text-purple-500"},
  ticket_raised:   { icon: Ticket,      color: "bg-yellow-100 text-yellow-500"},
};

export default function UserDashboardPage() {
  const { user } = useAuthStore();
  const {
    stats, spendingData, activity,
    recentOrders, loading, fetchDashboard,
  } = useUserDashboardStore();

  const firstName = user?.name?.split(" ")[0] ?? "there";

  useEffect(() => { fetchDashboard(); }, []);

  const formatAmount = (v: number) => {
    if (v >= 100000) return `₹${(v / 100000).toFixed(2)}L`;
    if (v >= 1000)   return `₹${(v / 1000).toFixed(1)}K`;
    return `₹${v}`;
  };

  const statCards = stats ? [
    {
      icon:     ShoppingBag,
      label:    "Total Orders",
      value:    String(stats.totalOrders),
      sub:      `+${stats.ordersThisMonth} this month`,
      subColor: "text-brand",
      color:    "bg-pink-50 text-pink-500",
    },
    {
      icon:     Key,
      label:    "Active Items",
      value:    String(stats.activeItems),
      sub:      "Purchased products",
      subColor: "text-green-500",
      color:    "bg-green-50 text-green-500",
    },
    {
      icon:     Download,
      label:    "Downloads",
      value:    String(stats.downloads),
      sub:      "Total downloads",
      subColor: "text-blue-500",
      color:    "bg-blue-50 text-blue-500",
    },
    {
      icon:     CreditCard,
      label:    "Total Spent",
      value:    formatAmount(stats.totalSpent),
      sub:      `${formatAmount(stats.spentThisMonth)} this month`,
      subColor: "text-orange-500",
      color:    "bg-orange-50 text-orange-500",
    },
  ] : [];

  return (
    <div className="space-y-5">

      {/* Welcome */}
      <div className="bg-background border border-border rounded-2xl px-6 py-5">
        <h1 className="text-xl font-bold text-foreground">
          Welcome back, {firstName} 👋
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Here's what's happening with your account
        </p>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-muted animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map(({ icon: Icon, label, value, sub, subColor, color }) => (
            <div key={label} className="bg-background border border-border rounded-2xl p-4 space-y-2">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <p className="text-2xl font-bold text-foreground">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className={`text-xs font-medium ${subColor}`}>{sub}</p>
            </div>
          ))}
        </div>
      )}

      {/* Chart + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">

        {/* Spending chart */}
        <div className="bg-background border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground text-sm">Spending Overview</h2>
            <span className="text-xs text-muted-foreground">Last 6 months</span>
          </div>
          {loading ? (
            <div className="h-44 bg-muted animate-pulse rounded-xl" />
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={spendingData}>
                <defs>
                  <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#d4006e" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#d4006e" stopOpacity={0}    />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 11 }}
                  axisLine={false} tickLine={false} />
                <YAxis
                  tickFormatter={(v) => `₹${v / 1000}K`}
                  tick={{ fontSize: 11 }}
                  axisLine={false} tickLine={false} width={45}
                />
                <Tooltip
                  formatter={(v) => [`₹${Number(v).toLocaleString("en-IN")}`, "Spent"]}
                  contentStyle={{ fontSize: 12, borderRadius: 8 }}
                />
                <Area type="monotone" dataKey="amount"
                  stroke="#d4006e" strokeWidth={2}
                  fill="url(#spendGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-background border border-border rounded-2xl p-5">
         <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground text-sm">Recent Activity</h2>
            <Link 
              href="/dashboard/activities"
              className="text-xs text-brand hover:underline flex items-center gap-0.5 font-medium"
            >
              View all <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-8 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : activity.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-8">
              No activity yet
            </p>
          ) : (
            <div className="space-y-3">
              {activity.map((item, i) => {
                const meta = activityMeta[item.type] ?? {
                  icon: Package, color: "bg-muted text-muted-foreground",
                };
                const Icon = meta.icon;
                return (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${meta.color}`}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground leading-snug">
                        {item.title}
                      </p>
                      {item.description && (
                        <p className="text-[11px] text-muted-foreground">{item.description}</p>
                      )}
                      <p className="text-[11px] text-muted-foreground/60">{item.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-background border border-border rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-semibold text-foreground text-sm">Recent Orders</h2>
          <Link href="/dashboard/orders"
            className="text-xs text-brand hover:underline flex items-center gap-0.5 font-medium">
            View all <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="p-5 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-8 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="py-10 text-center text-sm text-muted-foreground">
            No orders yet.{" "}
            <Link href="/store" className="text-brand hover:underline">Browse store</Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase text-muted-foreground">
                <th className="px-5 py-3 text-left">Order ID</th>
                <th className="px-5 py-3 text-left">Product</th>
                <th className="px-5 py-3 text-left">Amount</th>
                <th className="px-5 py-3 text-left">Status</th>
                <th className="px-5 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3">
                    <span className="text-brand font-mono text-xs font-semibold">
                      {order.id}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <p className="font-medium text-foreground text-sm">{order.product}</p>
                    <p className="text-xs text-muted-foreground">{order.plan}</p>
                  </td>
                  <td className="px-5 py-3 font-medium">
                    ₹{order.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-5 py-3">
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-medium capitalize",
                      order.status === "completed" && "bg-green-100 text-green-600",
                      order.status === "pending"   && "bg-yellow-100 text-yellow-600",
                      order.status === "cancelled" && "bg-red-100 text-red-600",
                      order.status === "refunded"  && "bg-blue-100 text-blue-600",
                      order.status === "failed"    && "bg-red-100 text-red-600",
                    )}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground text-xs">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}