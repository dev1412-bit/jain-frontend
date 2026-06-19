"use client";

import { useState } from "react";
import { X, Download, RotateCcw, Clock, User, HelpCircle } from "lucide-react";
import { type Order } from "@/store/orderStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface OrderDrawerProps {
  order: Order;
  onClose: () => void;
  onRefund?: (id: string) => void; // Optional if called by User
  isAdmin?: boolean;
}

// ─── Shared Local Status badge ──────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn(
      "px-2 py-0.5 rounded-full text-xs font-medium capitalize whitespace-nowrap",
      status === "completed"  && "bg-green-100  text-green-600 dark:bg-green-500/10 dark:text-green-400",
      status === "pending"    && "bg-yellow-100 text-yellow-600 dark:bg-yellow-500/10 dark:text-yellow-400",
      status === "refunded"   && "bg-pink-100   text-pink-500 dark:bg-pink-500/10 dark:text-pink-400",
      status === "failed"     && "bg-red-100    text-red-500 dark:bg-red-500/10 dark:text-red-400",
      status === "cancelled"  && "bg-muted      text-muted-foreground",
      status === "paid"       && "bg-green-100  text-green-600 dark:bg-green-500/10 dark:text-green-400",
    )}>
      {status}
    </span>
  );
}

export default function OrderDrawer({ order, onClose, onRefund, isAdmin = false }: OrderDrawerProps) {
  const [confirming, setConfirming] = useState(false);

  const handleRefund = () => {
    if (!confirming) { setConfirming(true); return; }
    if (onRefund) onRefund(order.id);
    setConfirming(false);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 z-40 animate-fade-in" onClick={onClose} />

      {/* Drawer */}
      <aside className="fixed top-0 right-0 h-full w-[380px] bg-background border-l border-border z-50 flex flex-col shadow-xl transition-transform duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <h2 className="font-semibold text-foreground">Order Details</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body — Scrollable */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
          
          {/* Order ID + Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Order ID</p>
              <p className="text-sm font-semibold text-brand">{order.orderId}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Date</p>
              <p className="text-sm text-foreground">{order.createdAt ? formatDate(order.createdAt) : "—"}</p>
            </div>
          </div>

          {/* Customer info */}
          <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Billing Customer</p>
              <p className="text-sm font-medium text-foreground">{order.billing?.name ?? "—"}</p>
              <p className="text-xs text-muted-foreground truncate">{order.billing?.email ?? "—"}</p>
            </div>
            {isAdmin && order.user && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Account Owner</p>
                <p className="text-sm font-medium text-foreground truncate">{order.user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{order.user.email}</p>
              </div>
            )}
          </div>

          {/* Items */}
          <div className="border-t border-border pt-4">
            <p className="text-xs text-muted-foreground mb-2">Items Ordered</p>
            <div className="space-y-2">
              {order.items?.map((item) => (
                <div key={item.id} className="rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-xs">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <p className="font-medium text-foreground">{item.product_title}</p>
                      {item.plan_name && <p className="text-muted-foreground mt-0.5">{item.plan_name}</p>}
                    </div>
                    <p className="font-semibold text-foreground">
                      ₹{Number(item.total_price).toLocaleString("en-IN")}
                    </p>
                  </div>
                  {item.quantity > 1 && <p className="text-muted-foreground mt-1">Qty: {item.quantity}</p>}
                </div>
              ))}
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="rounded-xl border border-border bg-muted/30 px-4 py-3 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-foreground">₹{Number(order.subtotal).toLocaleString("en-IN")}</span>
            </div>
            {Number(order.discount) > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Discount</span>
                <span className="text-green-600">−₹{Number(order.discount).toLocaleString("en-IN")}</span>
              </div>
            )}
            {Number(order.gstAmount) > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">GST</span>
                <span className="text-foreground">₹{Number(order.gstAmount).toLocaleString("en-IN")}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold border-t border-border pt-2 text-sm">
              <span className="text-foreground">Total</span>
              <span className="text-brand">₹{Number(order.total).toLocaleString("en-IN")}</span>
            </div>
          </div>

          {/* Payment metadata */}
          <div className="grid grid-cols-2 gap-4 border-t border-border pt-4 text-xs">
            <div>
              <p className="text-muted-foreground mb-1">Order Status</p>
              <StatusBadge status={order.status} />
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Payment Status</p>
              <StatusBadge status={order.paymentStatus} />
            </div>
          </div>

          {/* ─── AUDIT LOG TIMELINE SECTION ─── */}
          <div className="border-t border-border pt-4">
            <p className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" /> Order History Logs
            </p>
            
            {order.logs && order.logs.length > 0 ? (
              <div className="relative border-l-2 border-muted pl-4 ml-2 space-y-4">
                {order.logs.map((log) => (
                  <div key={log.id} className="relative text-xs">
                    
                    {/* Timeline Node Point Dot */}
                    <span className="absolute -left-[23px] top-1 bg-background border-2 border-brand h-2.5 w-2.5 rounded-full" />
                    
                    {/* Log Entry Box */}
                    <div className="bg-muted/40 p-2.5 rounded-xl border border-border space-y-1.5">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-semibold text-foreground">Order:</span>
                          <StatusBadge status={log.status} />
                        </div>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                          {log.createdAt}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="text-[11px] font-semibold text-foreground">Payment:</span>
                        <StatusBadge status={log.paymentStatus} />
                      </div>

                      {log.note && (
                        <p className="text-muted-foreground bg-background/60 p-1.5 rounded border border-border/40 text-[11px] mt-1 italic">
                          "{log.note}"
                        </p>
                      )}

                      {/* Display who mutated the state */}
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground pt-0.5">
                        <User className="h-3 w-3" />
                        <span>Action by: <strong className="text-foreground">{log.createdBy ?? "System Process"}</strong></span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic pl-2">No transaction history logs generated yet.</p>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-4 border-t border-border space-y-2 shrink-0">
          <button 
            onClick={() => window.open(`${process.env.NEXT_PUBLIC_API_URL}/invoices/${order.id}`, "_blank")} 
            className="w-full flex items-center justify-center bg-brand hover:bg-brand-hover text-white gap-2 py-2 px-4 rounded-xl text-sm font-medium transition-colors"
          >
            <Download className="h-4 w-4" /> Download Invoice
          </button>

          {/* Only render Admin Controls if explicitly enabled */}
          {isAdmin && onRefund && order.status !== "refunded" && order.status !== "cancelled" && (
            <Button
              variant="outline"
              className={cn(
                "w-full gap-2 border-destructive/50 rounded-xl",
                confirming ? "bg-destructive text-white hover:bg-destructive/90" : "text-destructive hover:bg-destructive/10"
              )}
              onClick={handleRefund}
            >
              <RotateCcw className="h-4 w-4" />
              {confirming ? "Confirm Refund History Modification?" : "Refund Order"}
            </Button>
          )}
        </div>
      </aside>
    </>
  );
}