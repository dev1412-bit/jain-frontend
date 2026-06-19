"use client";

import { useEffect } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, PieChart, Pie, Cell,
  LineChart, Line, BarChart, Bar, Legend,
} from "recharts";
import {
  DollarSign, ShoppingCart, Users, Package, ChevronDown,
} from "lucide-react";
import {
  useAdminDashboardStore,
  type AnalyticsPeriod,
} from "@/store/adminDashboardStore";
import AdminStatCard from "@/components/admin/AdminStatCard";
import { cn } from "@/lib/utils";

const PERIOD_OPTIONS: { label: string; value: AnalyticsPeriod }[] = [
  { label: "Last 1 Month",  value: "1m" },
  { label: "Last 3 Months", value: "3m" },
  { label: "Last 6 Months", value: "6m" },
  { label: "Last 1 Year",   value: "1y" },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-background border border-border rounded-lg px-3 py-2 shadow-md text-xs space-y-1">
      <p className="font-semibold text-foreground">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {p.dataKey === "revenue"
            ? `₹${Number(p.value).toLocaleString("en-IN")}`
            : p.value}
        </p>
      ))}
    </div>
  );
};

export default function AnalyticsPage() {
  const {
    stats, loading,
    analyticsPeriod, setAnalyticsPeriod, fetchAnalytics,
    revenueTrend, trafficSources, conversionData,
    deviceStats, monthlyPerformance, analyticsLoading,
    fetchStats,
  } = useAdminDashboardStore();

  useEffect(() => {
    fetchStats();
    fetchAnalytics();
  }, []);

  const formatRevenue = (v: number) => {
    if (v >= 10000000) return `₹${(v / 10000000).toFixed(2)}Cr`;
    if (v >= 100000)   return `₹${(v / 100000).toFixed(2)}L`;
    if (v >= 1000)     return `₹${(v / 1000).toFixed(1)}K`;
    return `₹${v}`;
  };

  const formatGrowth = (g: number) => `${g >= 0 ? "+" : ""}${g}%`;

  const selectedLabel = PERIOD_OPTIONS.find((o) => o.value === analyticsPeriod)?.label ?? "Last 3 Months";

  // date range label
  const dateRange = revenueTrend.length >= 2
    ? `${revenueTrend[0].month} - ${revenueTrend[revenueTrend.length - 1].month}`
    : "";

  const statCards = stats ? [
    { icon: <DollarSign className="h-5 w-5" />, value: formatRevenue(stats.totalRevenue),              label: "Total Revenue", growth: formatGrowth(stats.revenueGrowth),  positive: stats.revenueGrowth  >= 0 },
    { icon: <ShoppingCart className="h-5 w-5" />, value: stats.totalOrders.toLocaleString("en-IN"),   label: "Total Orders",  growth: formatGrowth(stats.ordersGrowth),   positive: stats.ordersGrowth   >= 0 },
    { icon: <Users className="h-5 w-5" />, value: stats.activeUsers.toLocaleString("en-IN"),          label: "Unique Users",  growth: formatGrowth(stats.usersGrowth),    positive: stats.usersGrowth    >= 0 },
    { icon: <Package className="h-5 w-5" />, value: `${stats.totalProducts}`,                         label: "Products",      growth: formatGrowth(stats.productsGrowth), positive: stats.productsGrowth >= 0 },
  ] : [];

  const maxDeviceVal = Math.max(...deviceStats.map((d) => d.value), 1);

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">Analytics</h1>
          {dateRange && (
            <p className="text-xs text-muted-foreground mt-0.5">{dateRange}</p>
          )}
        </div>

        {/* Period dropdown */}
        <div className="relative">
          <select
            value={analyticsPeriod}
            onChange={(e) => setAnalyticsPeriod(e.target.value as AnalyticsPeriod)}
            className="h-9 pl-3 pr-8 text-sm rounded-lg border border-input bg-background appearance-none focus:outline-none focus:ring-2 focus:ring-brand/30"
          >
            {PERIOD_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Stat cards */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((s) => <AdminStatCard key={s.label} {...s} />)}
        </div>
      )}

      {/* Revenue & Orders Trend */}
      <div className="bg-background border border-border rounded-2xl p-5">
        <div className="mb-4">
          <h3 className="font-semibold text-foreground text-sm">Revenue & Orders Trend</h3>
        </div>
        {analyticsLoading ? (
          <div className="h-48 bg-muted animate-pulse rounded-xl" />
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={revenueTrend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#d4006e" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#d4006e" stopOpacity={0}   />
                </linearGradient>
                <linearGradient id="ordGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#7c3aed" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
              />
              <Area type="monotone" dataKey="revenue" name="Revenue"
                stroke="#d4006e" strokeWidth={2} fill="url(#revGrad)" dot={false}
                activeDot={{ r: 4, fill: "#d4006e" }} />
              <Area type="monotone" dataKey="orders" name="Orders"
                stroke="#7c3aed" strokeWidth={2} fill="url(#ordGrad)" dot={false}
                activeDot={{ r: 4, fill: "#7c3aed" }} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Traffic + Conversion + Device */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Traffic Sources */}
        <div className="bg-background border border-border rounded-2xl p-5">
          <h3 className="font-semibold text-foreground text-sm mb-3">Traffic Sources</h3>
          {analyticsLoading ? (
            <div className="h-40 bg-muted animate-pulse rounded-xl" />
          ) : (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={trafficSources} cx="50%" cy="50%"
                    innerRadius={40} outerRadius={65}
                    paddingAngle={2} dataKey="value">
                    {trafficSources.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(v: any) => [`${v}%`]}
                    contentStyle={{ fontSize: 12, borderRadius: 8 }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {trafficSources.map((s) => (
                  <div key={s.name} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: s.color }} />
                    <span className="text-xs text-muted-foreground flex-1">{s.name}</span>
                    <span className="text-xs font-semibold text-foreground">{s.value}%</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Conversion Rate */}
        <div className="bg-background border border-border rounded-2xl p-5">
          <h3 className="font-semibold text-foreground text-sm mb-3">Conversion Rate</h3>
          {analyticsLoading ? (
            <div className="h-40 bg-muted animate-pulse rounded-xl" />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={conversionData} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  axisLine={false} tickLine={false}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip formatter={(v: any) => [`${v}%`, "Conversion"]}
                  contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Line type="monotone" dataKey="rate" stroke="#10b981"
                  strokeWidth={2} dot={{ r: 3, fill: "#10b981" }}
                  activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Sessions by Device */}
        <div className="bg-background border border-border rounded-2xl p-5">
          <h3 className="font-semibold text-foreground text-sm mb-3">Sessions by Device</h3>
          {analyticsLoading ? (
            <div className="h-40 bg-muted animate-pulse rounded-xl" />
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={deviceStats} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="device" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                  axisLine={false} tickLine={false}
                  tickFormatter={(v) => `${v}%`} />
                <Tooltip formatter={(v: any) => [`${v}%`, "Sessions"]}
                  contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                <Bar dataKey="value" fill="#d4006e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Monthly Performance Table */}
      <div className="bg-background border border-border rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="font-semibold text-foreground text-sm">Monthly Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase text-muted-foreground">
                <th className="px-5 py-3 text-left">Month</th>
                <th className="px-5 py-3 text-left">Visitors</th>
                <th className="px-5 py-3 text-left">Orders</th>
                <th className="px-5 py-3 text-left">Revenue</th>
                <th className="px-5 py-3 text-left">Conversion Rate</th>
              </tr>
            </thead>
            <tbody>
              {analyticsLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b border-border">
                    <td colSpan={5} className="px-5 py-3">
                      <div className="h-4 bg-muted animate-pulse rounded" />
                    </td>
                  </tr>
                ))
              ) : monthlyPerformance.map((row, i) => (
                <tr key={i}
                  className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-3 font-medium text-foreground text-sm">{row.month}</td>
                  <td className="px-5 py-3 text-muted-foreground">
                    {row.visitors.toLocaleString("en-IN")}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{row.orders}</td>
                  <td className="px-5 py-3 font-semibold text-brand">
                    ₹{Number(row.revenue).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {/* Progress bar */}
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden max-w-[120px]">
                        <div
                          className="h-full bg-brand rounded-full"
                          style={{ width: `${Math.min(row.conversionRate * 20, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {row.conversionRate}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}