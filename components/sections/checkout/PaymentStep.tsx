"use client";

import { useState } from "react";
import { CreditCard, Smartphone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PaymentMethod = "card" | "upi";

type Props = {
  onNext: (data: { method: PaymentMethod }) => void;
  onBack: () => void;
};

export default function PaymentStep({ onNext, onBack }: Props) {
  const [method, setMethod] = useState<PaymentMethod>("card");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Pass the selected payment method up to the parent component
    onNext({ method });
  };

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-bold text-foreground">Select Payment Method</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Payment method tabs */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: "card" as PaymentMethod, label: "Credit/Debit Card", icon: CreditCard },
            { id: "upi"  as PaymentMethod, label: "UPI / QR Code",      icon: Smartphone },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setMethod(id)}
              className={cn(
                "flex flex-col items-center gap-2 py-4 rounded-xl border-2 transition-colors text-left w-full",
                method === id
                  ? "border-brand bg-brand/5"
                  : "border-border bg-background hover:border-brand/30"
              )}
            >
              <Icon className={cn("h-5 w-5", method === id ? "text-brand" : "text-muted-foreground")} strokeWidth={1.5} />
              <span className={cn("text-xs font-medium", method === id ? "text-brand" : "text-muted-foreground")}>
                {label}
              </span>
            </button>
          ))}
        </div>

        <div className="p-4 rounded-xl border border-border bg-muted/20 text-center">
          <p className="text-xs text-muted-foreground">
            You will securely complete your transaction using Razorpay's encrypted payment gateway in the next step.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <Button type="button" variant="outline" onClick={onBack} className="h-11 rounded-xl font-semibold">
            Back
          </Button>
          <Button type="submit" className="h-11 bg-brand hover:bg-brand-hover text-white font-semibold rounded-xl gap-2">
            Review Order <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}