"use client";

import { useState } from "react";
import { ArrowRight, ShieldCheck, RefreshCw, Tag } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

const GST_RATE = 0.18;

export default function OrderSummary() {
const {
  subtotal: getSubtotal,
  discountAmount,
  applyCoupon,
  removeCoupon,
  couponCode,
  couponDiscount,
  couponType
} = useCartStore();
  const { user }     = useAuthStore();
  const { openSignIn } = useUIStore();
  const router       = useRouter();

  const [coupon,        setCoupon]        = useState("");
  const [couponError,   setCouponError]   = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const subtotal = getSubtotal();

const discountAmt = discountAmount();

const afterDisc = subtotal - discountAmt;

const gst = +(afterDisc * GST_RATE).toFixed(2);

const grandTotal = +(afterDisc + gst).toFixed(2);

  const handleApplyCoupon = async () => {
    if (!coupon.trim()) return;
    setApplyingCoupon(true);
    setCouponError("");
    try {
      await applyCoupon(coupon.trim().toUpperCase());
      setCoupon("");
    } catch {
      setCouponError("Invalid coupon code");
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleCheckout = () => {
    if (!user) {
      // save intent so after login it redirects to billing
      sessionStorage.setItem("checkout_redirect", "/billing");
      openSignIn();
    } else {
      router.push("/billing");
    }
  };

  return (
    <div className="bg-background border border-border rounded-2xl p-5 space-y-5 lg:sticky lg:top-20">
      <h2 className="font-bold text-foreground text-base">Order Summary</h2>

      {/* Coupon input */}
      <div className="space-y-1.5">
        {couponCode ? (
          // Applied coupon state
          <div className="flex items-center justify-between bg-brand/5 border border-brand/20 rounded-lg px-3 py-2">
            <div className="flex items-center gap-2">
              <Tag className="h-3.5 w-3.5 text-brand" />
              <span className="text-xs font-semibold text-brand">{couponCode}</span>
              <span className="text-xs text-green-600">
                — {couponType === "percentage" ? `${couponDiscount}% off` : `₹${couponDiscount} off`}
              </span>
            </div>
            <button
              onClick={removeCoupon}
              className="text-xs text-muted-foreground hover:text-destructive transition-colors"
            >
              Remove
            </button>
          </div>
        ) : (
          // Coupon input
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={coupon}
                onChange={(e) => { setCoupon(e.target.value.toUpperCase()); setCouponError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                placeholder="Enter coupon code"
                className="pl-8 h-9 text-sm uppercase"
              />
            </div>
            <Button
              onClick={handleApplyCoupon}
              disabled={applyingCoupon || !coupon}
              size="sm"
              className="h-9 px-4 bg-brand hover:bg-brand-hover text-white rounded-lg text-sm font-semibold shrink-0"
            >
              {applyingCoupon ? "..." : "Apply"}
            </Button>
          </div>
        )}
        {couponError && <p className="text-xs text-destructive">{couponError}</p>}
      </div>

      {/* Price breakdown */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-foreground">
          <span>Subtotal</span>
          <span>₹{subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
        </div>

        {discountAmt > 0 && (
          <div className="flex justify-between text-green-600 dark:text-green-400">
            <span>Discount ({couponCode})</span>
            <span>- ₹{discountAmt.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
          </div>
        )}

        <div className="flex justify-between text-foreground">
          <span>GST (18%)</span>
          <span>₹{gst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
        </div>

        <div className="border-t border-border pt-3 flex justify-between font-bold text-foreground text-base">
          <span>Total</span>
          <span className="text-brand">
            ₹{grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Checkout button */}
      <Button
        onClick={handleCheckout}
        className="w-full h-11 bg-brand hover:bg-brand-hover text-white font-semibold rounded-xl gap-2"
      >
        {user ? "Proceed to Checkout" : "Sign In to Checkout"}
        <ArrowRight className="h-4 w-4" />
      </Button>

      {/* Guest hint */}
      {!user && (
        <p className="text-center text-xs text-muted-foreground -mt-2">
          Sign in to save your cart and complete your order
        </p>
      )}

      {/* Trust badges */}
      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <ShieldCheck className="h-3.5 w-3.5 text-brand" />
          Secure Checkout
        </span>
        <span className="flex items-center gap-1">
          <RefreshCw className="h-3.5 w-3.5 text-brand" />
          Money-back Guarantee
        </span>
      </div>
    </div>
  );
}