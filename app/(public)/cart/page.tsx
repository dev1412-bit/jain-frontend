"use client";

import Link from "next/link";
import { ShoppingBag, ArrowRight } from "lucide-react";
import CartItemRow from "@/components/sections/cart/CartItemRow";
import OrderSummary from "@/components/sections/cart/OrderSummary";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const { items, clearCart } = useCartStore();

  // ── Empty cart ──
  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-background px-4 gap-4">
        <div className="w-16 h-16 rounded-2xl bg-brand/10 flex items-center justify-center">
          <ShoppingBag className="h-8 w-8 text-brand" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Your cart is empty</h2>
        <p className="text-sm text-muted-foreground">
          Browse our store and add products to get started.
        </p>
        <Button asChild className="mt-2 bg-brand hover:bg-brand-hover text-white rounded-full px-6">
          <Link href="/store">Browse Store</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Page title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-8">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">

          {/* LEFT: Cart items */}
          <div className="space-y-3">
            {items.map((item) => (
              <CartItemRow key={item.id} item={item} />
            ))}

            {/* Bottom actions row */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={clearCart}
                className="text-sm text-muted-foreground hover:text-destructive transition-colors"
              >
                Clear cart
              </button>
              <Link
                href="/store"
                className="flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
              >
                Continue Shopping
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* RIGHT: Order summary */}
          <OrderSummary />
        </div>
      </div>
    </div>
  );
}