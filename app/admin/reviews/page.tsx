"use client";

import { useEffect, useState } from "react";
import { Star, Eye, EyeOff, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useReviewStore } from "@/store/reviewStore";

const STATUS_OPTIONS = [
  { label: "All", value: "" },
  { label: "Visible", value: "visible" },
  { label: "Hidden", value: "hidden" },
];

export default function AdminReviewsPage() {
  const { adminReviews, adminLoading, adminTotal, fetchAdminReviews, toggleReviewApproval, deleteReviewAdmin } = useReviewStore();
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetchAdminReviews(1, { status });
  }, [status]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reviews</h1>
          <p className="text-sm text-muted-foreground">{adminTotal} total reviews</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">{STATUS_OPTIONS.find((o) => o.value === status)?.label}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {STATUS_OPTIONS.map((opt) => (
              <DropdownMenuItem key={opt.value} onClick={() => setStatus(opt.value)}>{opt.label}</DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {adminLoading ? (
          <p className="p-6 text-sm text-muted-foreground">Loading...</p>
        ) : adminReviews.length === 0 ? (
          <p className="p-6 text-sm text-muted-foreground">No reviews found.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/40 text-left border-b border-border">
                <th className="px-4 py-3 font-medium text-foreground">Product</th>
                <th className="px-4 py-3 font-medium text-foreground">User</th>
                <th className="px-4 py-3 font-medium text-foreground">Rating</th>
                <th className="px-4 py-3 font-medium text-foreground">Comment</th>
                <th className="px-4 py-3 font-medium text-foreground">Status</th>
                <th className="px-4 py-3 font-medium text-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {adminReviews.map((r) => (
                <tr key={r.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-foreground font-medium">{r.product.title}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.user.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? "fill-brand text-brand" : "text-muted-foreground"}`} />
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground max-w-xs truncate">{r.comment || "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${r.isApproved ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"}`}>
                      {r.isApproved ? "Visible" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => toggleReviewApproval(r.id)} className="text-muted-foreground hover:text-foreground" title={r.isApproved ? "Hide review" : "Restore review"}>
                        {r.isApproved ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                      <button onClick={() => deleteReviewAdmin(r.id)} className="text-muted-foreground hover:text-destructive" title="Delete permanently">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
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