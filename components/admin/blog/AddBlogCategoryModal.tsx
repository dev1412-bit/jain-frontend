"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBlogCategoryStore } from "@/store/blogCategoryStore";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated?: (categoryId: string) => void; // auto-selects the new category after creation
};

export default function AddBlogCategoryModal({ open, onClose, onCreated }: Props) {
  const { createCategory } = useBlogCategoryStore();

  const [name, setName]               = useState("");
  const [slug, setSlug]               = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving]           = useState(false);
  const [error, setError]             = useState("");

  // auto-generate slug from name as user types
  const handleNameChange = (value: string) => {
    setName(value);
    setSlug(value.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
  };

  const handleClose = () => {
    setName(""); setSlug(""); setDescription(""); setError("");
    onClose();
  };

  const handleSave = async () => {
    if (name.trim().length < 2) {
      setError("Category name must be at least 2 characters");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const created = await createCategory({
        name: name.trim(),
        slug: slug || undefined,
        description: description.trim() || undefined,
      } as any);

      // createCategory in the store doesn't return the value directly in your current setup,
      // so re-read latest categories list to find the new one by slug
      const state = useBlogCategoryStore.getState();
      const newCat = state.categories.find((c) => c.slug === (slug || name.toLowerCase().replace(/\s+/g, "-")));

      if (newCat && onCreated) onCreated(newCat.id);

      handleClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to create category");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <Plus className="h-4 w-4 text-brand" />
            New Blog Category
          </DialogTitle>
          <DialogDescription className="text-xs">
            Create a category to organize your blog posts
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          {/* Name */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Category Name *
            </Label>
            <Input
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Technology"
              className={cn("h-10", error && "border-destructive")}
              autoFocus
            />
          </div>

          {/* Slug */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Slug
            </Label>
            <Input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="technology"
              className="h-9 text-sm font-mono"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Description <span className="normal-case font-normal">(optional)</span>
            </Label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description of this category..."
              className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
          </div>

          {error && <p className="text-xs text-destructive">{error}</p>}

          {/* Actions */}
          <div className="flex items-center gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 h-10 rounded-lg"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={saving}
              onClick={handleSave}
              className="flex-1 h-10 bg-brand hover:bg-brand-hover text-white rounded-lg"
            >
              {saving ? "Creating..." : "Create Category"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}