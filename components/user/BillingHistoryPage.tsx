"use client";

import { useEffect } from "react";
import { FileDown } from "lucide-react";
import { useBillingHistoryStore } from "@/store/billingHistoryStore";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";

export default function BillingHistoryPage() {
  const { user } = useAuthStore();
  const {
    records, loading, currentPage, lastPage,
    fetchBillingHistory,
  } = useBillingHistoryStore();

  useEffect(() => {
    fetchBillingHistory(1);
  }, []);

const handleDownloadPdf = (record: any) => {
  // use backend mPDF route instead of inline generation
  const url = `${process.env.NEXT_PUBLIC_API_URL}/invoices/${record.id}`;
  window.open(url, "_blank");
};

  const paymentStatusColor = (s: string) => ({
    paid:     "bg-green-100 text-green-600",
    pending:  "bg-yellow-100 text-yellow-600",
    refunded: "bg-blue-100 text-blue-600",
    failed:   "bg-red-100 text-red-600",
  }[s] ?? "bg-muted text-muted-foreground");

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="bg-background border border-border rounded-2xl px-6 py-5">
        <h1 className="text-xl font-bold text-foreground">Billing History</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          View and download your invoices
        </p>
      </div>

      {/* Table */}
      <div className="bg-background border border-border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase text-muted-foreground">
              <th className="px-5 py-3 text-left">Invoice</th>
              <th className="px-5 py-3 text-left">Product</th>
              <th className="px-5 py-3 text-left">Plan</th>
              <th className="px-5 py-3 text-left">Amount</th>
              <th className="px-5 py-3 text-left">Date</th>
              <th className="px-5 py-3 text-left">Status</th>
              <th className="px-5 py-3 text-left"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-border">
                  <td colSpan={7} className="px-5 py-4">
                    <div className="h-4 bg-muted animate-pulse rounded" />
                  </td>
                </tr>
              ))
            ) : records.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-sm text-muted-foreground">
                  No billing records found
                </td>
              </tr>
            ) : records.map((record) => (
              <tr key={record.id}
                className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                <td className="px-5 py-3">
                  <span className="font-mono text-xs font-semibold text-brand">
                    {record.invoiceNumber ?? record.orderId}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <p className="font-medium text-foreground text-sm">{record.product}</p>
                  <p className="text-xs text-muted-foreground">{record.plan}</p>
                </td>
                <td className="px-5 py-3 text-sm text-muted-foreground">
                  {record.plan}
                </td>
                <td className="px-5 py-3 font-semibold text-foreground">
                  ₹{record.total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </td>
                <td className="px-5 py-3 text-xs text-muted-foreground">
                  {record.createdAt}
                </td>
                <td className="px-5 py-3">
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-medium capitalize",
                    paymentStatusColor(record.paymentStatus)
                  )}>
                    {record.paymentStatus}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <button
                    onClick={() => handleDownloadPdf(record)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline"
                  >
                    <FileDown className="h-3.5 w-3.5" />
                    PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {lastPage > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Page {currentPage} of {lastPage}
            </p>
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => fetchBillingHistory(currentPage - 1)}
                className="px-3 py-1.5 text-xs rounded-lg border border-border hover:bg-accent disabled:opacity-50"
              >
                Prev
              </button>
              <button
                disabled={currentPage === lastPage}
                onClick={() => fetchBillingHistory(currentPage + 1)}
                className="px-3 py-1.5 text-xs rounded-lg border border-border hover:bg-accent disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
