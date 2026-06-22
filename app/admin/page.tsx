"use client";
import { useEffect } from "react";
import { DollarSign, ShoppingCart, Users, Package, Download } from "lucide-react";
import AdminStatCard from "@/components/admin/AdminStatCard";
import RevenueChart from "@/components/admin/RevenueChart";
import SalesByCategoryChart from "@/components/admin/SalesByCategoryChart";
import RecentOrdersTable from "@/components/admin/RecentOrdersTable";
import TopProductsList from "@/components/admin/TopProductList";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAdminDashboardStore } from "@/store/adminDashboardStore";
import { useOrderStore } from "@/store/orderStore";
import { useProductStore } from "@/store/productStore";


export default function AdminOverviewPage() {
  const { stats, loading, fetchStats, fetchRevenue, fetchCategories,exportDashboard } = useAdminDashboardStore();
  const { fetchOrders } = useOrderStore();
  const { fetchProducts } = useProductStore();
   useEffect(() => {
    fetchStats();
    fetchRevenue();
    fetchCategories();
    fetchOrders(1);        // 👈 recent orders uses orderStore
    fetchProducts(1);      // 👈 top products uses productStore
  }, []);

  const formatRevenue = (v: number) => {
    if (v >= 10000000) return `₹${(v / 10000000).toFixed(2)}Cr`;
    if (v >= 100000)   return `₹${(v / 100000).toFixed(2)}L`;
    if (v >= 1000)     return `₹${(v / 1000).toFixed(1)}K`;
    return `₹${v}`;
  };

   const formatGrowth = (g: number) => `${g >= 0 ? "+" : ""}${g}%`;

   const statCards = stats ? [
    {
      icon:     <DollarSign className="h-5 w-5" />,
      value:    formatRevenue(stats.totalRevenue),
      label:    "Total Revenue",
      growth:   formatGrowth(stats.revenueGrowth),
      positive: stats.revenueGrowth >= 0,
    },
    {
      icon:     <ShoppingCart className="h-5 w-5" />,
      value:    stats.totalOrders.toLocaleString("en-IN"),
      label:    "Total Orders",
      growth:   formatGrowth(stats.ordersGrowth),
      positive: stats.ordersGrowth >= 0,
    },
    {
      icon:     <Users className="h-5 w-5" />,
      value:    stats.activeUsers.toLocaleString("en-IN"),
      label:    "Active Users",
      growth:   formatGrowth(stats.usersGrowth),
      positive: stats.usersGrowth >= 0,
    },
    {
      icon:     <Package className="h-5 w-5" />,
      value:    String(stats.totalProducts),
      label:    "Products",
      growth:   formatGrowth(stats.productsGrowth),
      positive: stats.productsGrowth >= 0,
    },
  ] : [];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Overview</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Welcome back, Admin. Here&apos;s what&apos;s happening.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5 rounded-lg text-xs h-8" onClick={()=>exportDashboard()}>
            <Download className="h-3.5 w-3.5" />
            Export
          </Button>
        <Link href="/admin/analytics">
          <Button 
            size="sm" 
            className="gap-1.5 rounded-lg text-xs h-8 bg-brand hover:bg-brand-hover text-white"
          >
            View Report
          </Button>
        </Link>
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
          {statCards.map((stat) => (
            <AdminStatCard key={stat.label} {...stat} />
          ))}
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
        <RevenueChart />
        <SalesByCategoryChart />
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RecentOrdersTable />
        <TopProductsList />
      </div>
    </div>
  );
}