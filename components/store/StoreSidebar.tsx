"use client";

import { useProductStore } from "@/store/productStore";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import type { StoreCategory } from "@/store/productStore";

type StoreSidebarProps = {
  categories?: StoreCategory[];
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
  loading?: boolean;
};

export default function StoreSidebar({
  categories: controlledCategories,
  selectedCategory: controlledSelectedCategory,
  onCategoryChange,
  loading,
}: StoreSidebarProps = {}) {
  const {
    categories: storeCategories,
    selectedCategory: storeSelectedCategory,
    setCategory,
  } = useProductStore();

  const categories = controlledCategories ?? storeCategories;
  const selectedCategory =
    controlledSelectedCategory ?? storeSelectedCategory;
  const handleCategoryChange = onCategoryChange ?? setCategory;
  const isLoading = loading ?? categories.length === 0;

  const allCategories = [
    { id: "all", name: "All Products", slug: "all" },
    ...categories,
  ];

  return (
    <aside className="w-full">
      <nav className="flex flex-col gap-1">
        {isLoading ? (
          // Loading skeletons while categories load
          <>
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-9 w-full rounded-full" />
            ))}
          </>
        ) : (
          allCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.slug)}
              className={cn(
                "text-left px-4 py-2 rounded-full text-sm font-medium transition-colors",
                selectedCategory === cat.slug
                  ? "bg-brand text-white"
                  : "text-foreground hover:bg-accent border border-border"
              )}
            >
              {cat.name}
            </button>
          ))
        )}
      </nav>
    </aside>
  );
}
