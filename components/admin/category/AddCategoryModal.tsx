"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, ImageIcon, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useCategoryStore, type Category } from "@/store/categoryStore";
import { cn } from "@/lib/utils";

const schema = z.object({
  name:        z.string().min(2, "Name is required"),
  slug:        z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  parentId:    z.string().optional(),
  banner:      z.string().optional(),
  isActive:    z.boolean().default(true), 
});

type FormFields = z.infer<typeof schema>;

type Props = {
  open: boolean;
  onClose: () => void;
  editCategory?: Category | null;
};

export default function AddCategoryModal({ open, onClose, editCategory }: Props) {
  const { categories, createCategory, updateCategory } = useCategoryStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const { register, handleSubmit, watch, setValue, reset, formState: { errors, isSubmitting } } =
    useForm<FormFields, unknown, FormFields>({ 
   resolver: zodResolver(schema) as Resolver<FormFields>,  
      defaultValues: {        
        isActive: true,
      }, 
    });

  // Auto-generate slug from name
  const nameVal = watch("name");
  useEffect(() => {
    if (!editCategory) {
      const slug = "/" + nameVal?.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || "";
      setValue("slug", slug);
    }
  }, [nameVal]);

  // Pre-fill when editing
  useEffect(() => {
    if (editCategory && open) {
      reset({
        name:        editCategory.name,
        slug:        editCategory.slug,
        description: editCategory.description ?? "",
        parentId:    editCategory.parentId ?? "",
        isActive:    editCategory.status === "active",
      });
      setBannerPreview(editCategory.banner ?? null);
      setBannerFile(null);
    }else if(open){
      reset({ name: "", slug: "", description: "", parentId: "", isActive: true });
      setBannerPreview(null);
      setBannerFile(null);
    }
  }, [editCategory, open, reset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
    };

  const handleRemoveBanner = (e: React.MouseEvent) => {
      e.stopPropagation();
      setBannerFile(null);
      setBannerPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    };

  const onSubmit = async (data: FormFields) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("slug", data.slug);
    if (data.description) formData.append("description", data.description);
    if (data.parentId)    formData.append("parentId", data.parentId);
    if (bannerFile)       formData.append("category_banner", bannerFile);
    formData.append("is_active", data.isActive ? "1" : "0"); 
    if (editCategory) {
      await updateCategory(editCategory.id, formData);
    } else {
      await createCategory(formData);
    }
    onClose();
    reset();
  };

  if (!open) return null;

  return (
    // Backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-background rounded-2xl shadow-xl w-full max-w-md border border-border overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-bold text-foreground text-base">
            {editCategory ? "Edit Category" : "Add Category"}
          </h2>
          <button onClick={onClose} className="w-7 h-7 rounded-full hover:bg-accent flex items-center justify-center">
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">

          {/* Category Name */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Category Name
            </Label>
            <Input
              placeholder="e.g. SaaS Solutions"
              className={cn("h-10", errors.name && "border-destructive")}
              {...register("name")}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          {/* Slug */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Slug
            </Label>
            <Input
              placeholder="/saas-solutions"
              className={cn("h-10 font-mono text-sm", errors.slug && "border-destructive")}
              {...register("slug")}
            />
            {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Description
            </Label>
            <textarea
              rows={3}
              placeholder="Category description..."
              className="w-full px-3 py-2.5 text-sm rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-brand/30"
              {...register("description")}
            />
          </div>

          {/* Parent Category */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Parent Category (Optional)
            </Label>
            <select
              className="w-full h-10 px-3 text-sm rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-brand/30"
              {...register("parentId")}
            >
              <option value="">None</option>
              {categories
                .filter((c) => c.id !== editCategory?.id)
                .map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
            </select>
          </div>

                   {/* 👇 Banner Upload — fixed */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Category Banner
            </Label>

            {/* Hidden real file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {/* Clickable upload area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative border border-dashed border-border rounded-xl overflow-hidden cursor-pointer hover:bg-accent transition-colors"
            >
              {bannerPreview ? (
                // Preview
                <div className="relative h-32">
                  <img
                    src={bannerPreview}
                    alt="Banner preview"
                    className="w-full h-full object-cover"
                  />
                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={handleRemoveBanner}
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80"
                  >
                    <X className="h-3 w-3 text-white" />
                  </button>
                  <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Upload className="h-3 w-3" /> Click to change
                  </div>
                </div>
              ) : (
                // Empty state
                <div className="p-6 flex flex-col items-center justify-center gap-2">
                  <ImageIcon className="h-6 w-6 text-muted-foreground/40" />
                  <p className="text-xs text-muted-foreground">Click to upload banner image</p>
                  <p className="text-xs text-muted-foreground/60">PNG, JPG, WEBP up to 2MB</p>
                </div>
              )}
            </div>
          </div>
          {/* Active / Inactive Toggle */}
          <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3 bg-muted/30">
            <div>
              <p className="text-sm font-medium text-foreground">Active Status</p>
              <p className="text-xs text-muted-foreground">
                Inactive categories won't appear on the site
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                {...register("isActive")}
              />
              <div className="w-10 h-6 rounded-full bg-muted peer-checked:bg-brand transition-colors duration-200" />
              <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 peer-checked:translate-x-4" />
            </label>
          </div>
          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-10 rounded-xl font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-10 bg-brand hover:bg-brand-hover text-white rounded-xl font-semibold"
            >
              {isSubmitting ? "Saving..." : editCategory ? "Update Category" : "Create Category"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}