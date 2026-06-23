"use client";

import { ShieldCheck, ArrowRight, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { useOrderStore } from "@/store/orderStore";
import { useState, useEffect } from "react";
import api from "@/lib/axios";

const GST_RATE = 0.18;

type Props = {
  onBack: () => void;
  onPlaceOrder: (orderData: any) => void;
  billingData?: any;
  paymentMethodText?: string;
  couponCode?: string | null;
};

// load Razorpay script only once globally
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.getElementById("razorpay-script")) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.id    = "razorpay-script";
    script.src   = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload  = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function ReviewStep({
  onBack, onPlaceOrder, billingData,
  paymentMethodText = "card", couponCode = null
}: Props) {
  const { items, total, clearCart } = useCartStore();
  const { placeOrder } = useOrderStore();

  const [loading,        setLoading]        = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const subtotal   = total();
  const gst        = +(subtotal * GST_RATE).toFixed(2);
  const grandTotal = +(subtotal + gst).toFixed(2);

  // ❌ REMOVED: useEffect that loaded script on every mount

  const handlePlace = async () => {
    setLoading(true);
    setLoadingMessage("Initializing secure checkout...");

    try {
      // 1. load script only if not already loaded
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Failed to load Razorpay. Check your internet connection.");
      }

      const payload = {
        billing: {
          first_name: billingData?.firstName,
          last_name:  billingData?.lastName  || "",
          email:      billingData?.email,
          phone:      billingData?.phone,
          company:    billingData?.company   || "",
          address:    billingData?.address,
          city:       billingData?.city,
          state:      billingData?.state,
          pin_code:   billingData?.pinCode,
          country:    billingData?.country,
        },
        items: items.map((item) => ({
          id:       item.id,
          name:     item.name,
          price:    item.price,
          quantity: item.quantity,
          slug:     item.slug || "product-slug",
          plan_id:     item.planId     ?? null, // 👈
          plan_name:   item.planName   ?? null, // 👈
          plan_period: item.planPeriod ?? null, // 👈
        })),
        coupon_code:    couponCode,
        payment_method: paymentMethodText,
      };

      // 2. create order on backend — get gateway data back
      setLoadingMessage("Creating your order...");
      const res = await api.post("/checkout", payload);
      const { order, gateway } = res.data;

      if (!gateway?.id) {
        throw new Error("Failed to initialize payment gateway.");
      }

      // 3. open Razorpay modal
      setLoadingMessage("Opening payment portal...");
      setLoading(false); // hide overlay so Razorpay modal is visible

      await new Promise<void>((resolve, reject) => {
        const options = {
          key:         gateway.key,
          amount:      gateway.amount,
          currency:    gateway.currency,
          order_id:    gateway.id,
          name:        gateway.name ?? "JainSoftware",
          description: "Order Payment",
          prefill: {
            name:    gateway.prefill?.name,
            email:   gateway.prefill?.email,
            contact: gateway.prefill?.contact,
          },
          theme: { color: "#d4006e" },

          // 4. on success — verify with backend
          handler: async (response: any) => {
            setLoading(true);
            setLoadingMessage("Verifying payment...");
            try {
              const verifyRes = await api.post("/checkout/verify", {
                internal_order_id:   order.id,
                razorpay_order_id:   response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature:  response.razorpay_signature,
              });

              if (verifyRes.data.success) {
                setLoadingMessage("Payment confirmed! Finalizing...");
                clearCart();
                onPlaceOrder(verifyRes.data.data);
                resolve();
              } else {
                throw new Error("Payment verification failed.");
              }
            } catch (err) {
              reject(err);
            }
          },

          // 5. on dismiss — user closed modal
          modal: {
            ondismiss: () => {
              reject(new Error("Payment cancelled by user."));
            },
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      });

    } catch (error: any) {
      setLoading(false);
      setLoadingMessage("");
      // toast shown in store or here
      if (error?.message && error.message !== "Payment cancelled by user.") {
        const { toast } = await import("sonner");
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="space-y-5 relative">

      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex flex-col items-center justify-center">
          <div className="bg-card border border-border p-8 rounded-2xl shadow-xl max-w-sm w-full text-center space-y-4 flex flex-col items-center">
            <div className="p-3 bg-brand/10 text-brand rounded-full animate-bounce">
              <Lock className="h-6 w-6" />
            </div>
            <Loader2 className="h-8 w-8 animate-spin text-brand" />
            <div className="space-y-1">
              <h3 className="font-bold text-foreground text-lg">Processing Transaction</h3>
              <p className="text-sm text-muted-foreground font-medium px-4">
                {loadingMessage}
              </p>
            </div>
            <p className="text-[11px] text-destructive font-medium animate-pulse">
              Please do not refresh or close this window.
            </p>
          </div>
        </div>
      )}

      <h2 className="text-xl font-bold text-foreground text-center">Review Your Order</h2>

      {/* Items */}
      <div className="space-y-3 max-h-[240px] overflow-y-auto pr-1">
        {items.map((item) => (
          <div key={item.id}
            className="flex items-center gap-3 py-3 border-b border-border last:border-0">
            <div className="w-16 h-11 rounded-lg overflow-hidden bg-muted shrink-0 border border-border">
              {item.image ? (
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-brand/10">
                  <span className="text-brand/40 text-xs font-bold">{item.name.charAt(0)}</span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {item.name.split("(")[0].trim()}
              </p>
              {item.name.includes("(") && (
                <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-brand/10 text-brand">
                  {item.name.match(/\(([^)]+)\)/)?.[1]}
                </span>
              )}
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-semibold text-foreground">
                ₹{item.price.toLocaleString("en-IN")}
              </p>
              <p className="text-xs text-muted-foreground">×{item.quantity}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="space-y-2.5 text-sm pt-1">
        <h3 className="font-bold text-foreground">Order Summary</h3>
        <div className="flex justify-between text-foreground">
          <span>Subtotal</span>
          <span>₹{subtotal.toLocaleString("en-IN")}.00</span>
        </div>
        <div className="flex justify-between text-foreground">
          <span>GST (18%)</span>
          <span>₹{gst.toLocaleString("en-IN")}</span>
        </div>
        <div className="border-t border-border pt-2.5 flex justify-between font-bold text-base">
          <span className="text-foreground">Total</span>
          <span className="text-brand">₹{grandTotal.toLocaleString("en-IN")}</span>
        </div>
      </div>

      <div className="flex items-start gap-3 p-4 rounded-xl border border-border bg-muted/30">
        <ShieldCheck className="h-5 w-5 text-brand shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-foreground">Order Protection Guarantee</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Transactions processed through encrypted secure layers.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" onClick={onBack} disabled={loading}
          className="h-11 rounded-xl font-semibold">
          Back
        </Button>
        <Button
          onClick={handlePlace}
          disabled={loading || items.length === 0}
          className="h-11 bg-brand hover:bg-brand-hover text-white font-semibold rounded-xl gap-2"
        >
          Pay & Place Order <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}