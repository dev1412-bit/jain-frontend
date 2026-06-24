"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderId = searchParams.get("order");

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4">
      <div className="bg-white border rounded-3xl p-8 max-w-md w-full text-center shadow-sm">

        <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-5" />

        <h1 className="text-2xl font-bold">
          Payment Successful 🎉
        </h1>

        <p className="text-muted-foreground mt-3">
          Your order has been placed successfully.
        </p>

        {orderId && (
          <div className="mt-5 bg-muted rounded-xl p-3">
            <p className="text-xs">
              Order ID
            </p>
            <p className="font-mono text-sm break-all">
              {orderId}
            </p>
          </div>
        )}

        <div className="mt-6 space-y-3">
          <Button
            className="w-full bg-brand text-white rounded-xl"
            onClick={() => router.push("/orders")}
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            View Orders
          </Button>

          <Button
            variant="outline"
            className="w-full rounded-xl"
            onClick={() => router.push("/store")}
          >
            Continue Shopping
          </Button>
        </div>

      </div>
    </div>
  );
}