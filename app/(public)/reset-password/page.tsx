import { Suspense } from "react";
import ResetPasswordPage from "@/components/auth/ResetPasswordPage";

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-brand border-t-transparent animate-spin" />
      </div>
    }>
      <ResetPasswordPage />
    </Suspense>
  );
}