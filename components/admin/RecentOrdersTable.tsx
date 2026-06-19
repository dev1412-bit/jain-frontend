import Link from "next/link";
import { cn } from "@/lib/utils";
import { useOrderStore } from "@/store/orderStore";

const statusStyle: Record<string, string> = {
  completed:  "bg-green-100 text-green-700  dark:bg-green-500/10 dark:text-green-400",
  pending:    "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-500",
  cancelled:  "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
  refunded:   "bg-blue-100 text-blue-700   dark:bg-blue-500/10 dark:text-blue-400",
  failed:     "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
};

export default function RecentOrdersTable() {
  const {orders, loading} = useOrderStore();
  const recent = orders.slice(0,5);
  return (
    <div className="bg-background border border-border rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h3 className="font-semibold text-foreground text-sm">Recent Orders</h3>
        <Link href="/admin/orders" className="text-xs text-brand hover:underline flex items-center gap-1">
          View all ↗
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <tbody>
          {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-border">
                  <td colSpan={4} className="px-5 py-3">
                    <div className="h-4 bg-muted animate-pulse rounded" />
                  </td>
                </tr>
              ))
            ) : recent.length === 0 ? (
               <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-xs text-muted-foreground">
                  No orders yet
                </td>
              </tr>
            ) : recent.map((order) => (
              <tr key={order.id}
                className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-5 py-3.5">
                  <p className="font-semibold text-brand text-xs">
                   {order.orderId}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "—"}
                  </p>
                </td>
                <td className="px-5 py-3.5">
                  <p className="text-xs font-medium text-foreground">
                  {order.billing?.name ?? "Guest"} 
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {order.items?.[0]?.product_title ?? "—"}
                  </p>
                </td>
                <td className="px-5 py-3.5 text-xs font-semibold text-foreground">
                  ₹{Number(order.total).toLocaleString("en-IN")}
                </td>
                <td className="px-5 py-3.5">
                  <span className={cn(
                    "px-2.5 py-1 rounded-full text-[11px] font-medium",
                    statusStyle[order.status] ?? "bg-muted text-muted-foreground"
                  )}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}