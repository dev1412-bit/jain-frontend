"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  CheckCircle2, Download, Package,
  ArrowRight, Home, FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import api from "@/lib/axios";

type OrderDetail = {
  id: string;
  uuid: string;
  orderId: string;
  invoiceNumber: string;
  invoiceUrl: string | null;
  status: string;
  paymentStatus: string;
  paymentMethod: string | null;
  subtotal: string;
  discount: string;
  gstAmount: string;
  total: string;
  billing: {
    name: string;
    email: string;
    phone: string | null;
  };
  items: {
    id: string;
    product_title: string;
    plan_name: string | null;
    plan_period: string | null;
    quantity: number;
    unit_price: string;
    total_price: string;
  }[];
  createdAt: string;
};

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const uuid         = searchParams.get("order");

  const [order,   setOrder]   = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    if (!uuid) {
      router.push("/");
      return;
    }
    fetchOrder();
  }, [uuid]);

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/orders/uuid/${uuid}`);
      setOrder(res.data.data ?? res.data);
    } catch {
      setError("Order not found");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = () => {
    if (!order) return;
    const url = `${process.env.NEXT_PUBLIC_API_URL}/invoices/${order.id}`;
    window.open(url, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="w-16 h-16 rounded-full bg-brand/10 mx-auto animate-pulse" />
          <div className="h-4 bg-muted rounded w-48 mx-auto animate-pulse" />
          <div className="h-3 bg-muted rounded w-32 mx-auto animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <p className="text-lg font-semibold text-foreground">Order not found</p>
          <Button onClick={() => router.push("/")}
            className="bg-brand text-white rounded-full">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-5">

        {/* Success header */}
        <div className="bg-background border border-border rounded-2xl p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-500/10 flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Payment Successful!</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Thank you for your purchase. Your order has been confirmed.
            </p>
          </div>

          {/* Order ID + Invoice */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <span className="px-3 py-1.5 rounded-full bg-brand/10 text-brand text-xs font-mono font-semibold">
              {order.invoiceNumber ?? order.orderId}
            </span>
            <span className={cn(
              "px-3 py-1.5 rounded-full text-xs font-semibold",
              order.paymentStatus === "paid"
                ? "bg-green-100 text-green-600"
                : "bg-yellow-100 text-yellow-600"
            )}>
              {order.paymentStatus}
            </span>
          </div>
        </div>

        {/* Order items */}
        <div className="bg-background border border-border rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center gap-2">
            <Package className="h-4 w-4 text-brand" />
            <h2 className="font-semibold text-foreground text-sm">Order Items</h2>
          </div>
          <div className="divide-y divide-border">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 px-5 py-4">
                <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center shrink-0">
                  <Package className="h-5 w-5 text-brand" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {item.product_title}
                  </p>
                  {item.plan_name && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {item.plan_name}
                      {item.plan_period && ` · ${item.plan_period}`}
                    </p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-foreground">
                    ₹{Number(item.total_price).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </p>
                  {item.quantity > 1 && (
                    <p className="text-xs text-muted-foreground">×{item.quantity}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Price breakdown */}
        <div className="bg-background border border-border rounded-2xl p-5 space-y-3">
          <h2 className="font-semibold text-foreground text-sm">Payment Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>₹{Number(order.subtotal).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
            </div>
            {Number(order.discount) > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>− ₹{Number(order.discount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
              </div>
            )}
            <div className="flex justify-between text-muted-foreground">
              <span>GST (18%)</span>
              <span>₹{Number(order.gstAmount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between font-bold text-base border-t border-border pt-2">
              <span className="text-foreground">Total Paid</span>
              <span className="text-brand">
                ₹{Number(order.total).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {order.paymentMethod && (
            <p className="text-xs text-muted-foreground pt-1">
              Paid via <span className="font-medium capitalize">{order.paymentMethod}</span>
            </p>
          )}
        </div>

        {/* Billing info */}
        <div className="bg-background border border-border rounded-2xl p-5 space-y-2">
          <h2 className="font-semibold text-foreground text-sm">Billed To</h2>
          <p className="text-sm font-medium text-foreground">{order.billing.name}</p>
          <p className="text-xs text-muted-foreground">{order.billing.email}</p>
          {order.billing.phone && (
            <p className="text-xs text-muted-foreground">{order.billing.phone}</p>
          )}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Button
            onClick={handleDownloadInvoice}
            variant="outline"
            className="h-11 gap-2 rounded-xl font-semibold"
          >
            <Download className="h-4 w-4" />
            Download Invoice
          </Button>
          <Button
            onClick={() => router.push("/dashboard/orders")}
            variant="outline"
            className="h-11 gap-2 rounded-xl font-semibold"
          >
            <FileText className="h-4 w-4" />
            View Orders
          </Button>
          <Button
            onClick={() => router.push("/")}
            className="h-11 gap-2 rounded-xl font-semibold bg-brand hover:bg-brand-hover text-white"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          A confirmation email has been sent to{" "}
          <span className="font-medium text-foreground">{order.billing.email}</span>
        </p>
      </div>
    </div>
  );
}