"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Mail, Phone, Building2, FileText } from "lucide-react";
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

export default function CustomerDetailPage() {
  const { id: uuid } = useParams<{ id: string }>();
  const router = useRouter();
  const { selectedCustomer, fetchCustomer, toggleActive } = useCustomerStore();

  useEffect(() => {
    if (uuid) fetchCustomer(uuid);
  }, [uuid]);

  if (!selectedCustomer) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-6 w-32 bg-muted animate-pulse rounded" />
        <div className="h-32 bg-muted animate-pulse rounded-2xl" />
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
      <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-1 -ml-2">
        <ArrowLeft className="h-4 w-4" /> Back to customers
      </Button>

      {/* Profile header */}
      <div className="rounded-2xl border border-border bg-background p-6 flex items-start justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center text-brand font-bold text-xl shrink-0">
            {c.name.charAt(0).toUpperCase()}
          </div>
          <div className="space-y-1">
            <h1 className="text-lg font-semibold text-foreground">{c.name}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {c.email}</span>
              {c.phone && (
                <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {c.phone}</span>
              )}
            </div>
            {(c.company || c.gstin) && (
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                {c.company && (
                  <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" /> {c.company}</span>
                )}
                {c.gstin && (
                  <span className="flex items-center gap-1"><FileText className="h-3.5 w-3.5" /> {c.gstin}</span>
                )}
              </div>
            )}
            {c.created_at && (
              <p className="text-xs text-muted-foreground">Joined {formatDate(c.created_at)}</p>
            )}
          </div>
        </div>

        <Button
          variant={c.is_active ? "destructive" : "default"}
          onClick={handleToggle}
        >
          {c.is_active ? "Deactivate" : "Activate"}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-border bg-background p-4">
          <p className="text-xs text-muted-foreground">Total Orders</p>
          <p className="text-xl font-bold text-foreground">{c.total_orders}</p>
        </div>
        <div className="rounded-2xl border border-border bg-background p-4">
          <p className="text-xs text-muted-foreground">Total Spent</p>
          <p className="text-xl font-bold text-foreground">
            ₹{Number(c.total_spent).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-background p-4">
          <p className="text-xs text-muted-foreground">Account Status</p>
          <p className={cn(
            "text-xl font-bold",
            c.is_active ? "text-green-600" : "text-yellow-600"
          )}>
            {c.is_active ? "Active" : "Inactive"}
          </p>
        </div>
      </div>

      {/* Recent orders */}
      <div className="rounded-2xl border border-border bg-background overflow-hidden">
        <div className="px-4 py-3 border-b border-border font-medium text-foreground">
          Recent Orders
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground text-xs uppercase">
              <th className="px-4 py-3 text-left">Invoice</th>
              <th className="px-4 py-3 text-left">Items</th>
              <th className="px-4 py-3 text-left">Total</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {!c.recent_orders || c.recent_orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-muted-foreground">
                  No orders yet
                </td>
              </tr>
            ) : c.recent_orders.map((order) => (
              <tr key={order.uuid} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium text-foreground">
                  {order.invoice_number ?? order.uuid.slice(0, 8)}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {order.items.map((i) => i.product_title).join(", ")}
                </td>
                <td className="px-4 py-3 font-medium">
                  ₹{Number(order.total).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </td>
                <td className="px-4 py-3 capitalize">{order.status}</td>
                <td className="px-4 py-3 text-muted-foreground text-xs">
                  {order.created_at}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}