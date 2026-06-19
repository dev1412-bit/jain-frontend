"use client";

import { useEffect, useState } from "react";
import { Tag, Users, DollarSign, Calendar, Plus, Copy, Trash2, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCouponStore } from "@/store/couponStore";
import CreateCouponModal from "@/components/admin/discount/CreateCouponModal";

export default function DiscountsPage() {
  const { coupons, stats, loading, total, currentPage, fetchCoupons, fetchStats, deleteCoupon } =
    useCouponStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editCoupon, setEditCoupon] = useState(null);

  useEffect(() => {
    fetchCoupons();
    fetchStats();
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Copied to clipboard!");
  };

  const totalPages = Math.ceil(total / 10);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Discounts & Coupons</h1>
          <p className="text-sm text-muted-foreground">{stats?.activeCoupons ?? 0} active coupons</p>
        </div>
        <Button
          onClick={() => { setEditCoupon(null); setModalOpen(true); }}
          className="bg-brand hover:bg-brand-hover text-white gap-2"
        >
          <Plus className="h-4 w-4" /> Create Coupon
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Tag,          label: "Active Coupons", value: stats?.activeCoupons ?? 0,                      color: "text-pink-500"   },
          { icon: Users,        label: "Total Uses",     value: stats?.totalUses?.toLocaleString() ?? 0,        color: "text-blue-500"   },
          { icon: DollarSign,   label: "Total Discount", value: `₹${((stats?.totalDiscount ?? 0) / 1000).toFixed(1)}`, color: "text-green-500"  },
          { icon: Calendar,     label: "Exp. This Month",value: stats?.expiringMonth ?? 0,                      color: "text-orange-500" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="rounded-2xl border border-border bg-background p-5 space-y-2">
            <Icon className={`h-5 w-5 ${color}`} />
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border bg-background overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground text-xs uppercase">
              <th className="px-4 py-3 text-left">Code</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Value</th>
              <th className="px-4 py-3 text-left">Used / Max</th>
              <th className="px-4 py-3 text-left">Expiry</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-10 text-muted-foreground">Loading...</td></tr>
            ) : coupons.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-10 text-muted-foreground">No coupons found</td></tr>
            ) : coupons.map((coupon) => (
              <tr key={coupon.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                {/* Code */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-brand">{coupon.code}</span>
                    <button onClick={() => handleCopy(coupon.code)} className="text-muted-foreground hover:text-foreground">
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
                {/* Type */}
                <td className="px-4 py-3 text-muted-foreground">
                  {coupon.type === "percentage" ? "% percentage" : "$ fixed"}
                </td>
                {/* Value */}
                <td className="px-4 py-3 font-medium">
                  {coupon.type === "percentage" ? `${coupon.value}%` : `₹${coupon.value}`}
                </td>
                {/* Used / Max */}
                <td className="px-4 py-3 text-muted-foreground">
                  {coupon.usedCount} / {coupon.maxUses ?? "∞"}
                </td>
                {/* Expiry */}
                <td className="px-4 py-3 text-muted-foreground">
                  {coupon.expiresAt ?? "—"}
                </td>
                {/* Status */}
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    coupon.isExpired
                      ? "bg-orange-100 text-orange-600"
                      : coupon.status === "active"
                        ? "bg-green-100 text-green-600"
                        : "bg-muted text-muted-foreground"
                  }`}>
                    {coupon.isExpired ? "expired" : coupon.status}
                  </span>
                </td>
                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { setEditCoupon(coupon as any); setModalOpen(true); }}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteCoupon(coupon.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Showing 1–{Math.min(10, coupons.length)} of {total}
          </p>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" disabled={currentPage === 1}
              onClick={() => fetchCoupons(currentPage - 1)}>Prev</Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button key={p} variant={p === currentPage ? "default" : "outline"} size="sm"
                onClick={() => fetchCoupons(p)}
                className={p === currentPage ? "bg-brand text-white" : ""}
              >{p}</Button>
            ))}
            <Button variant="outline" size="sm" disabled={currentPage === totalPages}
              onClick={() => fetchCoupons(currentPage + 1)}>Next</Button>
          </div>
        </div>
      </div>

      <CreateCouponModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editCoupon={editCoupon}
      />
    </div>
  );
}