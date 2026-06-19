"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import CategoryCard from "@/components/admin/category/CategoryCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useCategoryStore, type Category } from "@/store/categoryStore";
import AddCategoryModal from "@/components/admin/category/AddCategoryModal";

export default function AdminCategoriesPage() {
  const { categories, loading, fetchCategories } = useCategoryStore();
  const [modalOpen, setModalOpen]   = useState(false);
  const [editTarget, setEditTarget] = useState<Category | null>(null);

  useEffect(() => { fetchCategories(); }, []);

  const handleEdit = (cat: Category) => {
    setEditTarget(cat);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditTarget(null);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setEditTarget(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Categories</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {loading ? "Loading..." : `${categories.length} Categories`}
          </p>
        </div>
        <Button
          onClick={handleAdd}
          className="bg-brand hover:bg-brand-hover text-white rounded-lg gap-1.5 text-sm font-semibold h-9 px-4">
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground text-sm">
          No categories yet. Click &ldquo;Add Category&rdquo; to create one.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}

      {/* Add / Edit modal */}
      <AddCategoryModal
        open={modalOpen}
        onClose={handleClose}
        editCategory={editTarget}
      />
    </div>
  );
}      