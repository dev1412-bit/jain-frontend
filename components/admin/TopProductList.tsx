"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useProductStore } from "@/store/productStore";

export default function TopProductsList() {
  const { products, loading } = useProductStore();
  const top = products.slice(0, 5);
  const maxPrice = Math.max(...top.map((p) => p.basePrice), 1);
  return (
    <div className="bg-background border border-border rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h3 className="font-semibold text-foreground text-sm">Top Products</h3>
        <Link href="/admin/products" className="text-xs text-brand hover:underline flex items-center gap-1">
          View all ↗
        </Link>
      </div>

      <div className="divide-y divide-border">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="px-5 py-3.5 animate-pulse">
              <div className="h-3 bg-muted rounded w-3/4 mb-2" />
              <div className="h-1.5 bg-muted rounded" />
            </div>
          ))
        ) : top.length === 0 ? (
          <div className="px-5 py-8 text-center text-xs text-muted-foreground">
            No products yet
          </div>
        ) : top.map((p, i) => {
          const barPct = Math.round((p.basePrice / maxPrice) * 100);
          return (
            <div key={p.id} className="flex items-center gap-3 px-5 py-3.5">
              <span className="text-xs font-bold text-muted-foreground w-4 shrink-0">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground mb-1.5 truncate">
                  {p.title}
                </p>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand rounded-full transition-all"
                    style={{ width: `${barPct}%` }}
                  />
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-muted-foreground">
                  ₹{Number(p.basePrice).toLocaleString("en-IN")}
                </p>
                <span className={cn(
                  "text-xs font-semibold",
                  p.status === "published" ? "text-green-600" : "text-muted-foreground"
                )}>
                  {p.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
