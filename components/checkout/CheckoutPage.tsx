"use client";

import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { ArrowRight, Tag, X, ShieldCheck, CreditCard, Smartphone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useOrderStore } from "@/store/orderStore";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// ── Schemas ──────────────────────────────────────────────────────────────────

const billingSchema = z.object({
  first_name: z.string().min(1, "First name required"),
  last_name:  z.string().optional(),
  email:      z.string().email("Valid email required"),
  phone:      z.string().optional(),
  company:    z.string().optional(),
  address:    z.string().optional(),
  city:       z.string().optional(),
  state:      z.string().optional(),
  pin_code:   z.string().optional(),
  country:    z.string().optional(),
});

const paymentSchema = z.object({
  payment_method: z.enum(["card", "upi"]),
  card_number:    z.string().optional(),
  expiry:         z.string().optional(),
  cvv:            z.string().optional(),
  card_name:      z.string().optional(),
  upi_id:         z.string().optional(),
});

type BillingFields  = z.infer<typeof billingSchema>;
type PaymentFields  = z.infer<typeof paymentSchema>;

const GST_RATE = 0.18;

// ── Steps indicator ──────────────────────────────────────────────────────────

function StepsBar({ step }: { step: number }) {
  const steps = [
    { n: 1, label: "Billing"  },
    { n: 2, label: "Payment"  },
    { n: 3, label: "Review"   },
  ];
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map(({ n, label }, i) => (
        <div key={n} className="flex items-center gap-2">
          <div className="flex flex-col items-center gap-1">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors",
              step >= n ? "bg-brand text-white" : "bg-muted text-muted-foreground"
            )}>
              {n}
            </div>
            <span className={cn(
              "text-xs font-medium",
              step >= n ? "text-brand" : "text-muted-foreground"
            )}>
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={cn(
              "w-16 h-px mb-4 transition-colors",
              step > n ? "bg-brand" : "bg-border"
            )} />
          )}
        </div>
      ))}
    </div>
  );
}


function OrderSummaryCard({
  items, sub, disc, gst, grandTotal, couponCode,
  couponInput, setCouponInput, onApply, onRemove, applyingCoupon, showCoupon,
}: any) {
  return (
    <div className="w-72 shrink-0 space-y-4">
      {/* Items */}
      <div className="bg-white dark:bg-background border border-border rounded-2xl p-4 space-y-3">
        {items.map((item: any) => (
          <div key={item.id} className="flex items-center gap-3">
            <div className="w-14 h-10 rounded-lg overflow-hidden bg-muted shrink-0">
              {item.image ? (
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-brand/10">
                  <span className="text-brand/40 text-xs font-bold">{item.name.charAt(0)}</span>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">{item.name}</p>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-brand/10 text-brand font-medium">
                {item.name.match(/\((.+?)\)/)?.[1] ?? "Plan"}
              </span>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs font-semibold text-foreground">
                ₹{(item.price * item.quantity).toLocaleString("en-IN")}
              </p>
              <p className="text-[10px] text-muted-foreground">x{item.quantity}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Coupon */}
      {showCoupon && (
        <div className="bg-white dark:bg-background border border-border rounded-2xl p-4 space-y-2">
          <p className="text-sm font-semibold text-foreground">Coupon Code</p>
          {couponCode ? (
            <div className="flex items-center justify-between bg-brand/5 border border-brand/20 rounded-lg px-3 py-2">
              <div className="flex items-center gap-2">
                <Tag className="h-3.5 w-3.5 text-brand" />
                <span className="text-xs font-semibold text-brand">{couponCode}</span>
              </div>
              <button onClick={onRemove} className="text-muted-foreground hover:text-destructive">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                placeholder="Enter coupon"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                onKeyDown={(e: any) => e.key === "Enter" && onApply()}
                className="h-9 text-sm font-mono uppercase"
              />
              <Button type="button" size="sm" onClick={onApply}
                disabled={applyingCoupon || !couponInput}
                className="h-9 bg-brand text-white shrink-0">
                {applyingCoupon ? "..." : "Apply"}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Summary */}
      <div className="bg-white dark:bg-background border border-border rounded-2xl p-4 space-y-3">
        <p className="text-sm font-semibold text-foreground">Order Summary</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span>₹{sub.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
          </div>
          {disc > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount ({couponCode})</span>
              <span>- ₹{disc.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
            </div>
          )}
          <div className="flex justify-between text-muted-foreground">
            <span>GST (18%)</span>
            <span>₹{gst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between font-bold text-brand text-base border-t border-border pt-2">
            <span>Total</span>
            <span>₹{grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const router    = useRouter();
  const { user }  = useAuthStore();
  const {
    items, couponCode, subtotal, discountAmount, total,
    applyCoupon, removeCoupon,
  } = useCartStore();
  const { placeOrder } = useOrderStore();

  const [step,           setStep]           = useState<1 | 2 | 3>(1);
  const [billingData,    setBillingData]    = useState<BillingFields | null>(null);
  const [paymentMethod,  setPaymentMethod]  = useState<"card" | "upi">("card");
  const [couponInput,    setCouponInput]    = useState("");
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [placing,        setPlacing]        = useState(false);

  const sub        = subtotal();
  const disc       = discountAmount();
  const gst        = Math.round((sub - disc) * GST_RATE);
  const grandTotal = sub - disc + gst;

  const nameParts = user?.name?.split(" ") ?? [];

  // ── Billing form ──
  const billingForm = useForm<BillingFields, unknown, BillingFields>({
    resolver: zodResolver(billingSchema) as Resolver<BillingFields>,
    defaultValues: {
      first_name: nameParts[0] ?? "",
      last_name:  nameParts.slice(1).join(" ") ?? "",
      email:      user?.email ?? "",
      phone:      user?.phone                 ?? "",     // 👈
      company:    user?.company               ?? "",     // 👈
      address:    user?.address               ?? "",     // 👈
      city:       user?.city                  ?? "",     // 👈
      state:      user?.state                 ?? "",     // 👈
      pin_code:   user?.pin_code              ?? "",     // 👈
      country:    user?.country               ?? "India",// 👈
    },
  });

  // ── Payment form ──
  const paymentForm = useForm<PaymentFields, unknown, PaymentFields>({
    resolver: zodResolver(paymentSchema) as Resolver<PaymentFields>,
    defaultValues: { payment_method: "card" },
  });

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setApplyingCoupon(true);
    await applyCoupon(couponInput.trim().toUpperCase());
    setApplyingCoupon(false);
    setCouponInput("");
  };

  // Step 1 → 2
  const onBillingSubmit = (data: BillingFields) => {
    setBillingData(data);
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Step 2 → 3
  const onPaymentSubmit = () => {
    setStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Step 3 → place order
  const handlePlaceOrder = async () => {
    if (!billingData) return;
    setPlacing(true);
    try {
      const order = await placeOrder({
        billing: {
          first_name: billingData.first_name,
          last_name:  billingData.last_name,
          email:      billingData.email,
          phone:      billingData.phone,
          company:    billingData.company,
          address:    billingData.address,
          city:       billingData.city,
          state:      billingData.state,
          pin_code:   billingData.pin_code,
          country:    billingData.country,
        },
        items: items.map((i) => ({
          id:       i.id,
          name:     i.name,
          price:    i.price,
          quantity: i.quantity,
          slug:     i.slug,
        })),
        coupon_code:    couponCode ?? undefined,
        payment_method: paymentMethod,
      });
      useCartStore.getState().clearCart();
      router.push(`/checkout/success?order=${order.uuid}`);
    } catch {
      // error in store
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <p className="text-lg font-semibold">Your cart is empty</p>
          <Button onClick={() => router.push("/store")} className="bg-brand text-white rounded-full">
            Browse Store
          </Button>
        </div>
      </div>
    );
  }

  const summaryProps = {
    items, sub, disc, gst, grandTotal, couponCode,
    couponInput, setCouponInput,
    onApply: handleApplyCoupon,
    onRemove: removeCoupon,
    applyingCoupon,
    showCoupon: step === 1,
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <h1 className="text-3xl font-bold text-foreground text-center mb-6">Checkout</h1>
        <StepsBar step={step} />

        {/* ── STEP 1: Billing ── */}
        {step === 1 && (
          <div className="flex gap-6 items-start">
            <div className="flex-1">
              <form onSubmit={billingForm.handleSubmit(onBillingSubmit)}>
                <div className="bg-white dark:bg-background border border-border rounded-2xl p-6 space-y-5">
                  <h2 className="font-bold text-foreground text-lg">Billing Information</h2>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">First Name</Label>
                      <Input placeholder="John" className={cn("h-10", billingForm.formState.errors.first_name && "border-destructive")} {...billingForm.register("first_name")} />
                      {billingForm.formState.errors.first_name && <p className="text-xs text-destructive">{billingForm.formState.errors.first_name.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Last Name</Label>
                      <Input placeholder="Doe" className="h-10" {...billingForm.register("last_name")} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Email Address</Label>
                    <Input type="email" placeholder="john@example.com" className={cn("h-10", billingForm.formState.errors.email && "border-destructive")} {...billingForm.register("email")} />
                    {billingForm.formState.errors.email && <p className="text-xs text-destructive">{billingForm.formState.errors.email.message}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Phone Number</Label>
                      <Input placeholder="+91 XXXXXXXXXX" className="h-10" {...billingForm.register("phone")} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Company (Optional)</Label>
                      <Input placeholder="Acme Inc." className="h-10" {...billingForm.register("company")} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Address</Label>
                    <Input placeholder="123 Main Street" className="h-10" {...billingForm.register("address")} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">City</Label>
                      <Input placeholder="Raipur" className="h-10" {...billingForm.register("city")} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">State</Label>
                      <Input placeholder="Chhattisgarh" className="h-10" {...billingForm.register("state")} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Pin Code</Label>
                      <Input placeholder="492001" className="h-10" {...billingForm.register("pin_code")} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Country</Label>
                      <Input placeholder="India" className="h-10" {...billingForm.register("country")} />
                    </div>
                  </div>

                  <Button type="submit" className="w-full h-11 bg-brand hover:bg-brand-hover text-white font-semibold rounded-xl gap-2">
                    Continue to Payment <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </div>
            <OrderSummaryCard {...summaryProps} />
          </div>
        )}

        {/* ── STEP 2: Payment ── */}
        {step === 2 && (
          <div className="flex gap-6 items-start">
            <div className="flex-1">
              <div className="bg-white dark:bg-background border border-border rounded-2xl p-6 space-y-5">
                <h2 className="font-bold text-foreground text-lg">Payment Method</h2>

                {/* Method toggle */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "card", label: "Credit/Debit Card", icon: CreditCard },
                    { id: "upi",  label: "UPI",               icon: Smartphone  },
                  ].map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setPaymentMethod(id as "card" | "upi")}
                      className={cn(
                        "flex flex-col items-center gap-1.5 rounded-xl border-2 p-4 transition-colors",
                        paymentMethod === id
                          ? "border-brand bg-brand/5"
                          : "border-border hover:border-brand/40"
                      )}
                    >
                      <Icon className={cn("h-5 w-5", paymentMethod === id ? "text-brand" : "text-muted-foreground")} />
                      <span className={cn("text-xs font-medium", paymentMethod === id ? "text-brand" : "text-muted-foreground")}>
                        {label}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Card fields */}
                {paymentMethod === "card" && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Card Number</Label>
                      <Input placeholder="1234 5678 9012 3456" className="h-10 font-mono" maxLength={19} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Expiry Date</Label>
                        <Input placeholder="MM / YY" className="h-10 font-mono" maxLength={7} />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">CVV</Label>
                        <Input placeholder="123" className="h-10 font-mono" maxLength={4} type="password" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Cardholder Name</Label>
                      <Input placeholder="John Doe" className="h-10" />
                    </div>
                  </div>
                )}

                {/* UPI field */}
                {paymentMethod === "upi" && (
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">UPI ID</Label>
                    <Input placeholder="yourname@upi" className="h-10" />
                  </div>
                )}

                {/* Secure badge */}
                <div className="flex items-center justify-center gap-2 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 rounded-xl px-4 py-2.5">
                  <ShieldCheck className="h-4 w-4 text-green-600 shrink-0" />
                  <span className="text-xs text-green-700 dark:text-green-400 font-medium">
                    Your payment information is encrypted and secure
                  </span>
                </div>

                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={() => setStep(1)}
                    className="flex-1 h-11 rounded-xl font-semibold">
                    Back
                  </Button>
                  <Button type="button" onClick={onPaymentSubmit}
                    className="flex-1 h-11 bg-brand hover:bg-brand-hover text-white font-semibold rounded-xl gap-2">
                    Review Order <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <OrderSummaryCard {...summaryProps} />
          </div>
        )}

        {/* ── STEP 3: Review ── */}
        {step === 3 && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-background border border-border rounded-2xl p-6 space-y-5">
              <h2 className="font-bold text-foreground text-lg text-center">Review Your Order</h2>

              {/* Items */}
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-16 h-12 rounded-lg overflow-hidden bg-muted shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-brand/10">
                          <span className="text-brand/40 font-bold">{item.name.charAt(0)}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground">{item.name.split(" (")[0]}</p>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-brand/10 text-brand font-medium">
                        {item.name.match(/\((.+?)\)/)?.[1] ?? "Plan"}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-foreground">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </p>
                      <p className="text-xs text-muted-foreground">x{item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="border-t border-border pt-4 space-y-2 text-sm">
                <p className="font-semibold text-foreground">Order Summary</p>
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>₹{sub.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                </div>
                {disc > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({couponCode})</span>
                    <span>- ₹{disc.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                <div className="flex justify-between text-muted-foreground">
                  <span>GST (18%)</span>
                  <span>₹{gst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between font-bold text-brand text-base border-t border-border pt-2">
                  <span>Total</span>
                  <span>₹{grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              {/* Guarantee */}
              <div className="flex items-center gap-3 bg-muted/30 border border-border rounded-xl px-4 py-3">
                <ShieldCheck className="h-5 w-5 text-brand shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-foreground">Order Protection Guarantee</p>
                  <p className="text-xs text-muted-foreground">30-day money-back guarantee on all products. No questions asked.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => setStep(2)}
                  className="flex-1 h-11 rounded-xl font-semibold">
                  Back
                </Button>
                <Button type="button" onClick={handlePlaceOrder} disabled={placing}
                  className="flex-1 h-11 bg-brand hover:bg-brand-hover text-white font-semibold rounded-xl gap-2">
                  {placing ? "Placing Order..." : <> Place Order <ArrowRight className="h-4 w-4" /> </>}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}