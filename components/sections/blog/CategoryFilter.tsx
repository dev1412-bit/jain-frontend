"use client";

import { useBlogStore } from "@/store/blogStore";
import { cn } from "@/lib/utils";

export default function CategoryFilter() {
  const { categories, selectedCategory, setCategory } = useBlogStore();

  const allCategories = [
    { id: "all", name: "All" },
    ...categories,
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 mb-8">
      {allCategories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => setCategory(cat.name)}
          className={cn(
            "px-4 py-1.5 rounded-full text-sm font-medium border transition-colors",
            selectedCategory === cat.name
              ? "bg-brand text-white border-brand"
              : "bg-background text-foreground border-border hover:bg-accent"
          )}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}