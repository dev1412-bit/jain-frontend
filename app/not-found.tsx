import Link from "next/link";
import { Home, ShoppingBag } from "lucide-react";
import GoBackButton from "@/components/GoBackButton";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-background px-4">
      <h1 className="text-8xl sm:text-9xl font-bold text-brand leading-none">
        404
      </h1>
      <h2 className="mt-4 text-xl sm:text-2xl font-semibold text-foreground">
        Page not found
      </h2>
      <p className="mt-2 text-sm text-muted-foreground text-center max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-8 flex flex-col items-center gap-3 w-full max-w-[220px]">
        <GoBackButton />
        <Link
          href="/"
          className="w-full flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-brand hover:bg-brand-hover text-white text-sm font-medium transition-colors"
        >
          <Home className="h-4 w-4" />
          Back to Home
        </Link>
        <Link
          href="/store"
          className="w-full flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border border-border bg-background hover:bg-accent text-sm font-medium text-foreground transition-colors"
        >
          <ShoppingBag className="h-4 w-4" />
          Browse Store
        </Link>
      </div>
    </div>
  );
}