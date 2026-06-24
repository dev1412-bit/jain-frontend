import { Suspense } from "react";
import CheckoutSuccessPage from "@/components/sections/checkout/CheckoutSuccessPage";
export const dynamic = "force-dynamic"; 
export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-brand border-t-transparent animate-spin" />
      </div>
    }>
      <CheckoutSuccessPage />
    </Suspense>
  );
}
