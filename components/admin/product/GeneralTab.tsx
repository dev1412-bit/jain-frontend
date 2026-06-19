"use client";
import { UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { type ProductFormFields } from "@/components/admin/product/AddProductPage";

type Props = { form: UseFormReturn<ProductFormFields> };

export default function GeneralTab({ form }: Props) {
  const { register, watch, setValue, formState: { errors } } = form;

  const titleVal = watch("title");
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue("title", val);
    setValue("slug", val.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Title</Label>
        <Input placeholder="Product name" className={cn("h-10", errors.title && "border-destructive")}
          {...register("title")} onChange={handleTitleChange} />
        {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Slug</Label>
        <Input placeholder="/product-slug" className="h-10 font-mono text-sm" {...register("slug")} />
        {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Description</Label>
        <textarea rows={5} placeholder="Product description..."
          className="w-full px-3 py-2.5 text-sm rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-brand/30"
          {...register("description")} />
      </div>
    </div>
  );
}