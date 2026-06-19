"use client";

import { useState } from "react";
import CheckoutStepper from "@/components/sections/checkout/CheckoutStepper";
import CheckoutOrderPanel from "@/components/sections/checkout/CheckoutOrderPanel";
import BillingStep, { type BillingData } from "@/components/sections/checkout/BillingStep";
import PaymentStep from "@/components/sections/checkout/PaymentStep";
import ReviewStep from "@/components/sections/checkout/ReviewStep";
import OrderSuccess from "@/components/sections/checkout/OrderSuccess";
import { useCartStore } from "@/store/cartStore";

export default function BillingPage() {
  const [step, setStep]           = useState(1);
  const [billingData, setBilling] = useState<BillingData | null>(null);
  const [paymentData, setPayment] = useState<any>(null);
  const [ordered, setOrdered]     = useState(false);
  const { clearCart }             = useCartStore();

  const handlePlaceOrder = () => {
    clearCart();
    setOrdered(true);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-background py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground text-center mb-8">
          Checkout
        </h1>

        {/* Stepper — hide on success */}
        {!ordered && <CheckoutStepper currentStep={step} />}

        {/* Success screen */}
        {ordered ? (
          <div className="bg-background border border-border rounded-2xl p-8 max-w-lg mx-auto">
            <OrderSuccess />
          </div>
        ) : (
          /* Two column layout */
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 items-start">

            {/* LEFT: Step content */}
            <div className="bg-background border border-border rounded-2xl p-6">
              {step === 1 && (
                <BillingStep
                  defaultValues={billingData ?? undefined}
                  onNext={(data) => { setBilling(data); setStep(2); }}
                />
              )}
              {step === 2 && (
                <PaymentStep
                  onBack={() => setStep(1)}
                  onNext={(data) => { setPayment(data); setStep(3); }}
                />
              )}
              {step === 3 && (
                <ReviewStep
                  onBack={() => setStep(2)}
                  onPlaceOrder={handlePlaceOrder}
                />
              )}
            </div>

            {/* RIGHT: Order panel */}
            <div className="bg-background border border-border rounded-2xl p-5 lg:sticky lg:top-20">
              <CheckoutOrderPanel />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}