"use client";

import { Pencil, Trash2 } from "lucide-react";
import { type Category, useCategoryStore } from "@/store/categoryStore";
import { cn } from "@/lib/utils";
import Image from "next/image";

type Props = {
  category: Category;
  onEdit: (category: Category) => void;
};

export default function CategoryCard({ category, onEdit }: Props) {
  const { deleteCategory } = useCategoryStore();

  const handleDelete = () => {
    if (confirm(`Delete "${category.name}"? This cannot be undone.`)) {
      deleteCategory(category.id);
    }
  };

  return (
    <div className="bg-background border border-border rounded-2xl p-5 hover:border-brand/20 hover:shadow-sm transition-all">


          {/* Category Banner */}
          <div className="w-full h-36 bg-muted mb-2">
            {category.banner ? (
           <img
                src={category.banner}
                alt={category.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                No Banner
              </div>
            )}
          </div>
      {/* Top row: name + actions */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-foreground text-sm">{category.name}</h3>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onEdit(category)}
            className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={handleDelete}
            className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Slug */}
      <p className="text-xs text-muted-foreground font-mono mt-1.5">{category.slug}</p>

      {/* Footer: product count + status */}
      <div className="flex items-center justify-between mt-4">
        <span className="text-xs text-muted-foreground">
          {category.productCount} product{category.productCount !== 1 ? "s" : ""}
        </span>
        <span className={cn(
          "px-2.5 py-0.5 rounded-full text-[11px] font-semibold",
          category.status === "active"
            ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400"
            : "bg-muted text-muted-foreground"
        )}>
          {category.status === "active" ? "Active" : "Inactive"}
        </span>
      </div>
    </div>
  );
}