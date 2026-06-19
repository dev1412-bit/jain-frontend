"use client";

import { useEffect, useState } from "react";
import { Eye, ChevronDown, Download, X, RotateCcw, Search } from "lucide-react";
import { useOrderStore, Order } from "@/store/orderStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import OrderDrawer from "@/components/OrderDrawer";
// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn(
      "px-2 py-0.5 rounded-full text-xs font-medium",
      status === "completed"  && "bg-green-100  text-green-600",
      status === "pending"    && "bg-yellow-100 text-yellow-600",
      status === "refunded"   && "bg-pink-100   text-pink-500",
      status === "failed"     && "bg-red-100    text-red-500",
      status === "cancelled"  && "bg-muted      text-muted-foreground",
      status === "paid"       && "bg-green-100  text-green-600",
    )}>
      {status}
    </span>
  );
}


function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ─── Orders Page ──────────────────────────────────────────────────────────────

export default function OrdersPage() {
  const { orders, loading, total, currentPage, fetchOrders, refundOrder } = useOrderStore();
  const [search, setSearch]       = useState("");
  const [statusFilter, setStatus] = useState("");
  const [selected, setSelected]   = useState<Order | null>(null);

  useEffect(() => {
    if (orders.length === 0 && total === 0) fetchOrders(1);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchOrders(1, search, statusFilter), 400);
    return () => clearTimeout(t);
  }, [search, statusFilter]);

  const totalPages = Math.ceil(total / 10);

  const handleRefund = async (id: string) => {
    await refundOrder(id);
    // update drawer if still open
    setSelected((prev) =>
      prev?.id === id ? { ...prev, status: "refunded", payment_status: "refunded" } : prev
    );
  };

  return (
    <div className="p-6 space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Orders</h1>
          <p className="text-sm text-muted-foreground">{total} total orders</p>
        </div>
        <Button variant="outline" className="gap-2 text-sm">
          <Download className="h-4 w-4" /> Export
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by order ID or customer..."
            className="pl-9 h-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatus(e.target.value)}
            className="h-10 pl-3 pr-8 text-sm rounded-md border border-input bg-background text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-brand/30"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="refunded">Refunded</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>

        <div className="relative">
          <select className="h-10 pl-3 pr-8 text-sm rounded-md border border-input bg-background text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-brand/30">
            <option>Sort</option>
            <option>Newest</option>
            <option>Oldest</option>
            <option>Amount: High to Low</option>
            <option>Amount: Low to High</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border bg-background overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground text-xs uppercase">
              <th className="px-4 py-3 text-left">Order ID</th>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-left">Product</th>
              <th className="px-4 py-3 text-left">Amount</th>
              <th className="px-4 py-3 text-left">Payment</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Invoice</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="border-b border-border">
                  <td colSpan={8} className="px-4 py-3">
                    <div className="h-4 bg-muted animate-pulse rounded" />
                  </td>
                </tr>
              ))
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-12 text-muted-foreground">
                  No orders found
                </td>
              </tr>
            ) : orders.map((order) => {
              const itemCount = order.items?.length ?? 0;
              const firstItem = order.items?.[0];
              const productLabel = firstItem
                ? itemCount > 1
                  ? `${firstItem.product_title} +${itemCount - 1} more`
                  : firstItem.product_title
                : "—";

              return (
                <tr
                  key={order.id}
                  className={cn(
                    "border-b border-border hover:bg-muted/30 transition-colors cursor-pointer",
                    selected?.id === order.id && "bg-muted/40"
                  )}
                  onClick={() => setSelected(order)}
                >
                  <td className="px-4 py-3 font-medium text-brand">{order.orderId}</td>

                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground">{order.billing?.name ?? "—"}</p>
                    <p className="text-xs text-muted-foreground">{order.billing?.email ?? "—"}</p>
                  </td>

                  <td className="px-4 py-3 text-foreground max-w-[180px] truncate">
                    {productLabel}
                  </td>

                  <td className="px-4 py-3 font-medium text-foreground">
                    ₹{Number(order.total).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </td>

                  <td className="px-4 py-3">
                    <StatusBadge status={order.paymentStatus} />
                  </td>

                  <td className="px-4 py-3 text-muted-foreground text-xs">
                  {order.createdAt ? formatDate(order.createdAt) : "—"}
                  </td>

                  <td className="px-4 py-3 text-brand text-xs font-medium">
                      {order.invoiceNumber ?? "—"}
                  </td>

                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setSelected(order)}
                      className="text-muted-foreground hover:text-foreground"
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Showing 1–{Math.min(10, orders.length)} of {total}
          </p>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm"
              disabled={currentPage === 1}
              onClick={() => fetchOrders(currentPage - 1, search, statusFilter)}
            >
              Prev
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button key={p} size="sm"
                variant={p === currentPage ? "default" : "outline"}
                className={p === currentPage ? "bg-brand text-white" : ""}
                onClick={() => fetchOrders(p, search, statusFilter)}
              >
                {p}
              </Button>
            ))}
            <Button variant="outline" size="sm"
              disabled={currentPage === totalPages}
              onClick={() => fetchOrders(currentPage + 1, search, statusFilter)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

    {selected && (
  <OrderDrawer
    order={selected}
    onClose={() => setSelected(null)}
    onRefund={handleRefund}
    isAdmin={true}
  />
)}
    </div>
  );
}