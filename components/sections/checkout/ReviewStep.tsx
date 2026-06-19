"use client";

import Image from "next/image";
import { ShieldCheck, ArrowRight, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { useOrderStore } from "@/store/orderStore";
import { useState, useEffect } from "react";

const GST_RATE = 0.18;

type Props = {
  onBack: () => void;
  onPlaceOrder: (orderData: any) => void;
  billingData?: any;
  paymentMethodText?: string;
  couponCode?: string | null;
};

export default function ReviewStep({ onBack, onPlaceOrder, billingData, paymentMethodText = "card", couponCode = null }: Props) {
  const { items, total, clearCart } = useCartStore();
  const placeOrder = useOrderStore((state) => state.placeOrder);
  
  // Track loading and clear user-friendly status messages
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const subtotal   = total();
  const gst        = +(subtotal * GST_RATE).toFixed(2);
  const grandTotal = +(subtotal + gst).toFixed(2);

  // Inject Razorpay base core scripts on mount safely
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePlace = async () => {
    setLoading(true);
    setLoadingMessage("Initializing secure checkout session...");

    try {
      // Map data properties safely matching your explicit Laravel rules schema
      const payload = {
        billing: {
          first_name: billingData?.firstName,
          last_name: billingData?.lastName || "",
          email: billingData?.email,
          phone: billingData?.phone,
          company: billingData?.company || "",
          address: billingData?.address,
          city: billingData?.city,
          state: billingData?.state,
          pin_code: billingData?.pinCode,
          country: billingData?.country,
        },
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          slug: item.slug || "product-slug",
        })),
        coupon_code: couponCode,
        payment_method: paymentMethodText,
      };

      // Change loading message right before popup triggers
      setTimeout(() => {
        setLoadingMessage("Opening secure payment portal window...");
      }, 1000);

      // Note: We need to adapt the store call slightly or handle the status change 
      // dynamically. To ensure the message changes when verifying, we can handle it here or let the store execute.
      const completeOrder = await placeOrder(payload);
      
      setLoadingMessage("Payment authorized! Finalizing your order...");
      
      clearCart(); 
      onPlaceOrder(completeOrder); 
    } catch (error) {
      // Errors are caught and handled inside the store's toast system safely
      setLoading(false);
      setLoadingMessage("");
    }
  };

  return (
    <div className="space-y-5 relative">
      
      {/* ── USER FRIENDLY FULL SCREEN OVERLAY ── */}
      {loading && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex flex-col items-center justify-center animate-fade-in">
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
              Please do not refresh or close this browser window.
            </p>
          </div>
        </div>
      )}

      <h2 className="text-xl font-bold text-foreground text-center">Review Your Order</h2>

      {/* Items */}
      <div className="space-y-3 max-h-[240px] overflow-y-auto pr-1">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 py-3 border-b border-border last:border-0">
            <div className="relative w-16 h-11 rounded-lg overflow-hidden bg-muted shrink-0 border border-border">
              <Image
                src={item.image || "https://placehold.co/64x44/1e1b4b/818cf8?text=P"}
                alt={item.name}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{item.name.split("(")[0].trim()}</p>
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

      {/* Summary calculations */}
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

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" onClick={onBack} disabled={loading} className="h-11 rounded-xl font-semibold">
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