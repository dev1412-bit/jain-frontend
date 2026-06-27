"use client";

import { useEffect, useState } from "react";
import { Search, Download, ExternalLink, Headphones, ChevronDown, ChevronUp, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useOrderStore, type Order } from "@/store/orderStore";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import CancelOrderModal from "@/components/user/CancelOrderModal";
import LicenseModal from "@/components/user/LicenseModal";
import SupportModal from "@/components/user/SupportModal";

const SORT_OPTIONS = [
  { label: "Date",      value: "newest"      },
  { label: "Oldest",    value: "oldest"      },
  { label: "Amount ↑",  value: "amount_asc"  },
  { label: "Amount ↓",  value: "amount_desc" },
];

const STATUS_OPTIONS = ["All Status", "pending", "completed", "cancelled", "refunded", "failed"];

export default function MyOrdersPage() {
  const { myOrders, myOrdersLoading, myOrdersTotal, myOrdersPage, fetchMyOrders } = useOrderStore();

  const [search,      setSearch]      = useState("");
  const [status,      setStatus]      = useState("");
  const [sort,        setSort]        = useState("newest");
  const [expandedId,  setExpandedId]  = useState<string | null>(null);
  const [cancelModal, setCancelModal] = useState<{ open: boolean; order: Order | null }>({
    open: false, order: null,
  });

  // ─── FIXED: Added missing local state variables ───────────────────────────
  const [activeLicenseOrder, setActiveLicenseOrder] = useState<Order | null>(null);
  const [activeSupportOrder, setActiveSupportOrder] = useState<Order | null>(null);

  // Keep original fetching logic
  useEffect(() => {
    fetchMyOrders(1, "", "", "newest");
  }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchMyOrders(1, search, status, sort), 400);
    return () => clearTimeout(t);
  }, [search, status, sort]);

  const totalPages = Math.ceil(myOrdersTotal / 10);

  // Cancellation logic remains critical
  const canCancel = (order: Order): boolean => {
    if (!order.createdAt) return false;
    if (["cancelled", "refunded", "failed"].includes(order.status)) return false;
    const orderDate  = new Date(order.createdAt);
    const diffInDays = Math.floor((Date.now() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
    return diffInDays < 10;
  };

  const handleCancelClick = (order: Order) => {
    if (!canCancel(order)) {
      if (["cancelled", "refunded"].includes(order.status)) {
        toast.info(`Order is already ${order.status}`);
      } else {
        toast.error("Cancellation period expired", { description: "Orders can only be cancelled within 10 days of purchase." });
      }
      return;
    }
    setCancelModal({ open: true, order });
  };

  const statusColor = (s: string) => ({
    completed: "bg-green-100 text-green-600",
    refunded:  "bg-blue-100 text-blue-600",
    failed:    "bg-orange-100 text-orange-600",
    cancelled: "bg-red-100 text-red-600",
    pending:   "bg-yellow-100 text-yellow-600",
  }[s] ?? "bg-muted text-muted-foreground");

  return (
    <div className="space-y-5">
      <div className="bg-background border border-border rounded-2xl px-6 py-5">
        <h1 className="text-xl font-bold text-foreground">My Orders</h1>
      </div>

      {/* Filters */}
      <div className="bg-background border border-border rounded-2xl p-4 flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search orders..." className="pl-9 h-9 text-sm" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="h-9 px-3 text-sm rounded-lg border border-input bg-background focus:outline-none">
          {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value === "All Status" ? "" : e.target.value)} className="h-9 px-3 text-sm rounded-lg border border-input bg-background focus:outline-none">
          {STATUS_OPTIONS.map((s) => <option key={s} value={s === "All Status" ? "" : s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-background border border-border rounded-2xl overflow-hidden">
        {/* Header Grid */}
        <div className="grid grid-cols-[1.5fr_2fr_1fr_1fr_1fr_40px] gap-4 px-5 py-3 border-b border-border text-xs uppercase text-muted-foreground font-semibold">
          <span>Order ID</span><span>Product</span><span>Plan</span><span>Amount</span><span>Status</span><span>Date</span><span />
        </div>

        {myOrdersLoading ? (
            Array.from({ length: 5 }).map((_, i) => <div key={i} className="px-5 py-4 border-b animate-pulse"><div className="h-4 bg-muted rounded w-full" /></div>)
        ) : myOrders.length === 0 ? (
          <div className="text-center py-16 text-sm text-muted-foreground">No orders found</div>
        ) : myOrders.map((order) => (
          <div key={order.id} className="border-b border-border">
            <div onClick={() => setExpandedId(expandedId === order.id ? null : order.id)} className="grid grid-cols-[1.5fr_2fr_1fr_1fr_1fr_40px] gap-4 px-5 py-4 items-center hover:bg-muted/20 transition-colors cursor-pointer">
              <span className="text-brand font-mono text-xs font-semibold">{order.orderId}</span>
              <div>
                <p className="text-sm font-medium text-foreground">{order.items?.[0]?.product_title ?? "—"}</p>
              </div>
              <span className="text-sm text-muted-foreground">{order.items?.[0]?.plan_name ?? "—"}</span>
              <span className="text-sm font-medium text-foreground">₹{Number(order.total).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
              <span><span className={cn("px-2 py-0.5 rounded-full text-xs font-medium capitalize", statusColor(order.status))}>{order.status}</span></span>
              <span className="flex items-center justify-center">{expandedId === order.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</span>
            </div>

            {/* Actions */}
            {expandedId === order.id && (
              <div className="px-5 pb-4 flex items-center gap-2 bg-muted/10 flex-wrap">
                <button onClick={() => window.open(`${process.env.NEXT_PUBLIC_API_URL}/invoices/${order.id}`, "_blank")} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border bg-background hover:bg-accent"><Download className="h-3.5 w-3.5" /> Download Invoice</button>
                <button onClick={() => setActiveLicenseOrder(order)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border bg-background hover:bg-accent"><ExternalLink className="h-3.5 w-3.5" /> View License</button>
                <button onClick={() => setActiveSupportOrder(order)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border bg-background hover:bg-accent"><Headphones className="h-3.5 w-3.5" /> Get Support</button>
                {!["cancelled", "refunded", "failed"].includes(order.status) && (
                  <button onClick={(e) => { e.stopPropagation(); handleCancelClick(order); }} className={cn("flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ml-auto", canCancel(order) ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100" : "opacity-50 cursor-not-allowed")}>
                    <XCircle className="h-3.5 w-3.5" /> {canCancel(order) ? "Cancel Order" : "Cannot Cancel"}
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination Logic */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Showing {Math.min(10, myOrders.length)} of {myOrdersTotal} orders</p>
          <div className="flex items-center gap-1">
            <button disabled={myOrdersPage === 1} onClick={() => fetchMyOrders(myOrdersPage - 1, search, status, sort)} className="px-3 py-1.5 text-xs rounded-lg border hover:bg-accent disabled:opacity-50">Prev</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => fetchMyOrders(p, search, status, sort)} className={cn("px-3 py-1.5 text-xs rounded-lg border", p === myOrdersPage ? "bg-brand text-white border-brand" : "border-border hover:bg-accent")}>{p}</button>
            ))}
            <button disabled={myOrdersPage === totalPages} onClick={() => fetchMyOrders(myOrdersPage + 1, search, status, sort)} className="px-3 py-1.5 text-xs rounded-lg border hover:bg-accent disabled:opacity-50">Next</button>
          </div>
        </div>
      )}

      {/* Modals Mounting */}
      <CancelOrderModal open={cancelModal.open} onClose={() => setCancelModal({ open: false, order: null })} orderId={cancelModal.order?.uuid ?? ""} orderUuid={cancelModal.order?.orderId ?? ""} />
      <LicenseModal isOpen={!!activeLicenseOrder} onClose={() => setActiveLicenseOrder(null)} order={activeLicenseOrder} />
      <SupportModal isOpen={!!activeSupportOrder} onClose={() => setActiveSupportOrder(null)} order={activeSupportOrder} />
    </div>
  );
}