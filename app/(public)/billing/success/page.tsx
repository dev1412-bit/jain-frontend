import { Suspense } from "react";
import SuccessContent from "./SuccessContent";

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
      Loading...
    </div>}>
      <SuccessContent />
    </Suspense>
  );
}