"use client";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { type ProductFormFields } from "@/components/admin/product/AddProductPage";
import { Plus, X } from "lucide-react";

type Props = { form: UseFormReturn<ProductFormFields> };

export default function GeneralTab({ form }: Props) {
  const { register, watch, setValue, formState: { errors } } = form;
 const [featureInput, setFeatureInput] = useState("");
 const features = watch("features") ?? [];
  const titleVal = watch("title");
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue("title", val);
    setValue("slug", val.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
  };

  const addFeature = () => {
    const trimmed = featureInput.trim();
    if (!trimmed) return;
    setValue("features", [...features, trimmed]);
    setFeatureInput("");
  };

  const removeFeature = (index: number) => {
    setValue("features", features.filter((_, i) => i !== index));
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

       {/* Feature input */}
        <div className="flex gap-2">
          <Input
            value={featureInput}
            onChange={(e) => setFeatureInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
            placeholder="e.g. Multi-user support"
            className="h-9 text-sm flex-1"
          />
          <button
            type="button"
            onClick={addFeature}
            disabled={!featureInput.trim()}
            className="h-9 px-3 text-xs font-semibold text-white bg-brand rounded-md hover:bg-brand-hover disabled:opacity-50 flex items-center gap-1 shrink-0"
          >
            <Plus className="h-3.5 w-3.5" /> Add
          </button>
        </div>
 <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Product Features
        </Label>
        {/* Feature list */}
        {features.length > 0 && (
          <div className="space-y-1.5 mt-2">
            {features.map((f, i) => (
              <div key={i}
                className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-muted/40 border border-border">
                <span className="text-xs text-foreground flex-1">{f}</span>
                <button
                  type="button"
                  onClick={() => removeFeature(i)}
                  className="text-muted-foreground hover:text-destructive shrink-0"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {features.length === 0 && (
          <p className="text-xs text-muted-foreground">
            No features added yet — type and press Enter or click Add
          </p>
        )}
      </div>
    </div>
  );
}
   