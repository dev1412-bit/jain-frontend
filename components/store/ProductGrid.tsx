"use client";

import { useProductStore } from "@/store/productStore";
import ProductCard from "./ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { PackageSearch } from "lucide-react";
import type { Product } from "@/store/productStore";

type ProductGridProps = {
  products?: Product[];
  loading?: boolean;
  error?: string | null;
};

export default function ProductGrid({
  products: controlledProducts,
  loading: controlledLoading,
  error: controlledError,
}: ProductGridProps = {}) {
  const {
    storeLoading,
    error: storeError,
    filteredProducts,
  } = useProductStore();
  const products = controlledProducts ?? filteredProducts();
  const loading = controlledLoading ?? storeLoading;
  const error = controlledError ?? storeError;

  // Loading state
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-border overflow-hidden">
            <Skeleton className="aspect-[4/3] w-full" />
            <div className="p-4 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-4 w-1/3 mt-2" />
              <div className="flex gap-2 pt-2">
                <Skeleton className="h-9 flex-1 rounded-full" />
                <Skeleton className="h-9 flex-1 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
        <PackageSearch className="w-10 h-10 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  // Empty state
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
        <PackageSearch className="w-10 h-10 text-muted-foreground/40" />
        <p className="font-medium text-foreground text-sm">No products found</p>
        <p className="text-xs text-muted-foreground">
          Try a different search or category
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
