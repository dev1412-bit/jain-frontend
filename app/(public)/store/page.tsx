import { Suspense } from "react";
import StorePageClient from "./StorePageClient";
import { getStorefrontData } from "@/lib/api/storefront";

// You can create a simple loading placeholder if you like
function StoreSkeleton() {
  return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading store...</div>;
}

export default async function StorePage() {
  const { products, categories, error } = await getStorefrontData();

  return (
    <Suspense fallback={<StoreSkeleton />}>
      <StorePageClient
        initialProducts={products}
        initialCategories={categories}
        initialError={error}
      />
    </Suspense>
  );
}