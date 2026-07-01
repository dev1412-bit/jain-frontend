"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  FileText,
  ShoppingBag,
  Wallet,
  CalendarDays,
  Package,
} from "lucide-react";
import { useCustomerStore } from "@/store/customerStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function OrderStatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase();
  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize",
      s === "pending"   && "bg-yellow-100 text-yellow-600",
      s === "completed" && "bg-green-100  text-green-600",
      s === "cancelled" && "bg-red-100    text-red-500",
      !["pending", "completed", "cancelled"].includes(s) && "bg-muted text-muted-foreground"
    )}>
      {status}
    </span>
  );
}

export default function CustomerDetailPage() {
  const { id: uuid } = useParams<{ id: string }>();
  const router = useRouter();
  const { selectedCustomer, fetchCustomer, toggleActive } = useCustomerStore();

  useEffect(() => {
    if (uuid) fetchCustomer(uuid);
  }, [uuid]);

  if (!selectedCustomer) {
    return (
      <div className="p-6 space-y-4 max-w-5xl">
        <div className="h-5 w-36 bg-muted animate-pulse rounded" />
        <div className="h-36 bg-muted animate-pulse rounded-2xl" />
        <div className="grid grid-cols-3 gap-4">
          <div className="h-24 bg-muted animate-pulse rounded-2xl" />
          <div className="h-24 bg-muted animate-pulse rounded-2xl" />
          <div className="h-24 bg-muted animate-pulse rounded-2xl" />
        </div>
        <div className="h-64 bg-muted animate-pulse rounded-2xl" />
      </div>
    );
  }

  const c = selectedCustomer;

  const handleToggle = async () => {
    if (!confirm(`${c.is_active ? "Deactivate" : "Activate"} ${c.name}?`)) return;
    await toggleActive(c.uuid);
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors -ml-1"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to customers
      </button>

      {/* Profile header */}
      <div className="rounded-2xl border border-border bg-background p-6">
        <div className="flex items-start justify-between flex-wrap gap-5">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <div className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center text-brand font-bold text-xl ring-4 ring-brand/5">
                {c.avatar ? (
                  <img src={c.avatar} alt={c.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  c.name.charAt(0).toUpperCase()
                )}
              </div>
              <span className={cn(
                "absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-background",
                c.is_active ? "bg-green-500" : "bg-muted-foreground/40"
              )} />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold text-foreground">{c.name}</h1>
                {c.role && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-muted text-muted-foreground capitalize">
                    {c.role}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" />
                  {c.email}
                </span>
                {c.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" />
                    {c.phone}
                  </span>
                )}
              </div>

              {(c.company || c.gstin) && (
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  {c.company && (
                    <span className="flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5" />
                      {c.company}
                    </span>
                  )}
                  {c.gstin && (
                    <span className="flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5" />
                      {c.gstin}
                    </span>
                  )}
                </div>
              )}

              {c.created_at && (
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground pt-0.5">
                  <CalendarDays className="h-3 w-3" />
                  Joined {formatDate(c.created_at)}
                </p>
              )}
            </div>
          </div>

          <Button
            variant={c.is_active ? "destructive" : "default"}
            onClick={handleToggle}
            className={cn(!c.is_active && "bg-brand hover:bg-brand/90")}
          >
            {c.is_active ? "Deactivate" : "Activate"}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-background p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
            <ShoppingBag className="h-4 w-4 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Orders</p>
            <p className="text-lg font-bold text-foreground">{c.total_orders}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-background p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand/10 flex items-center justify-center shrink-0">
            <Wallet className="h-4 w-4 text-brand" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Spent</p>
            <p className="text-lg font-bold text-foreground">
              ₹{Number(c.total_spent).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-background p-4 flex items-center gap-3 col-span-2 sm:col-span-1">
          <div className={cn(
            "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
            c.is_active ? "bg-green-100" : "bg-yellow-100"
          )}>
            <span className={cn(
              "w-2.5 h-2.5 rounded-full",
              c.is_active ? "bg-green-500" : "bg-yellow-500"
            )} />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Account Status</p>
            <p className={cn(
              "text-lg font-bold",
              c.is_active ? "text-green-600" : "text-yellow-600"
            )}>
              {c.is_active ? "Active" : "Inactive"}
            </p>
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="rounded-2xl border border-border bg-background overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-medium text-foreground">Recent Orders</h2>
          {c.recent_orders && c.recent_orders.length > 0 && (
            <span className="text-xs text-muted-foreground">
              Showing latest {c.recent_orders.length}
            </span>
          )}
        </div>

        {!c.recent_orders || c.recent_orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-14 text-muted-foreground">
            <Package className="h-8 w-8 opacity-40" />
            <p className="text-sm">No orders yet</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground text-xs uppercase">
                <th className="px-5 py-3 text-left font-medium">Invoice</th>
                <th className="px-5 py-3 text-left font-medium">Items</th>
                <th className="px-5 py-3 text-left font-medium">Total</th>
                <th className="px-5 py-3 text-left font-medium">Status</th>
                <th className="px-5 py-3 text-left font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {c.recent_orders.map((order) => (
                <tr
                  key={order.uuid}
                  className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-5 py-3.5 font-medium text-foreground">
                    {order.invoice_number ?? order.uuid.slice(0, 8)}
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">
                    {order.items.map((i) => i.product_title).join(", ")}
                  </td>
                  <td className="px-5 py-3.5 font-medium text-foreground">
                    ₹{Number(order.total).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-5 py-3.5">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground text-xs">
                    {order.created_at}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}