import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrderSuccess() {
  return (
    <div className="text-center py-12 space-y-4">
      <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-500/10 flex items-center justify-center mx-auto">
        <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
      </div>
      <h2 className="text-2xl font-bold text-foreground">Order Placed!</h2>
      <p className="text-sm text-muted-foreground max-w-sm mx-auto">
        Your order has been confirmed. Check your email for the license key and invoice.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Button asChild variant="outline" className="rounded-full px-6">
          <Link href="/dashboard/orders">View Orders</Link>
        </Button>
        <Button asChild className="rounded-full px-6 bg-brand hover:bg-brand-hover text-white">
          <Link href="/store">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  );
}