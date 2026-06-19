"use client";
import { UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { type ProductFormFields } from "@/components/admin/product/AddProductPage";

type Props = { form: UseFormReturn<ProductFormFields> };

export default function SeoTab({ form }: Props) {
  const { register } = form;
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Meta Title</Label>
        <Input placeholder="Product name | Your Brand" className="h-10" {...register("seo.meta_title")} />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Meta Description</Label>
        <textarea rows={4} placeholder="Brief description for search engines..."
          className="w-full px-3 py-2.5 text-sm rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-brand/30"
          {...register("seo.meta_description")} />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Focus Keyword</Label>
        <Input placeholder="Primary keyword" className="h-10" {...register("seo.focus_keyword")} />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Canonical URL</Label>
        <Input placeholder="https://yoursite.com/product/..." className="h-10" {...register("seo.canonical_url")} />
      </div>
    </div>
  );
}