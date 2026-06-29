"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, FileText, DollarSign, Image, Globe, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCategoryStore } from "@/store/categoryStore";
import { useProductStore } from "@/store/productStore";
import GeneralTab   from "@/components/admin/product/GeneralTab";
import PricingTab   from"@/components/admin/product/PricingTab";
import MediaTab     from "@/components/admin/product/MediaTab";
import SeoTab       from "@/components/admin/product/SeoTab";
import SettingsTab  from "@/components/admin/product/SettingsTab";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const schema = z.object({
  title:       z.string().min(2, "Title required"),
  slug:        z.string().min(1, "Slug required"),
  description: z.string().optional(),
  features:    z.array(z.string()).optional(),
  base_price:  z.coerce.number().min(0),
  emi_price:   z.coerce.number().optional().nullable(),
  status:      z.enum(["draft", "published", "archived"]),
  category_id: z.string().min(1, "Category required"),
  pricing_plans: z.array(z.object({
    plan_name:      z.string().min(1),
    price:          z.coerce.number().min(0),
    original_price: z.coerce.number().optional().nullable(),
    period:         z.string().min(1),
    features:       z.array(z.string()).optional().default([]),
  })).optional(),
  seo: z.object({
    meta_title:       z.string().optional(),
    meta_description: z.string().optional(),
    focus_keyword:    z.string().optional(),
    canonical_url:    z.string().optional(),
  }).optional(),
  settings: z.object({
    license_key_format:    z.string().optional(),
    downloadable_file:     z.string().optional(),
    subscription_enabled:  z.boolean().optional(),
  }).optional(),
});

export type ProductFormFields = z.infer<typeof schema>;

const TABS = [
  { key: "general",  label: "General",  icon: FileText    },
  { key: "pricing",  label: "Pricing",  icon: DollarSign  },
  { key: "media",    label: "Media",    icon: Image       },
  { key: "seo",      label: "SEO",      icon: Globe       },
  { key: "settings", label: "Settings", icon: Settings    },
] as const;

type TabKey = typeof TABS[number]["key"];

type MediaItem = { id?: string; url: string; file?: File };

export default function AddProductPage() {
  const router = useRouter();
  const { categories } = useCategoryStore();
  const { createProduct, uploadMedia } = useProductStore();

  const [activeTab, setActiveTab] = useState<TabKey>("general");
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [saving, setSaving] = useState(false);

  const form = useForm<ProductFormFields, unknown, ProductFormFields>({
    resolver: zodResolver(schema) as Resolver<ProductFormFields>,
    defaultValues: {
      title: "", slug: "", description: "",
      base_price: 0, status: "draft", category_id: "",
      pricing_plans: [{ plan_name: "Monthly Plan", price: 0, period: "Monthly",  features: [], }],
      settings: { subscription_enabled: false },
    },
  });

  const { watch, setValue } = form;
  const status     = watch("status");
  const categoryId = watch("category_id");

  const onSave = async () => {
    const valid = await form.trigger();
    if (!valid) { toast.error("Please fix form errors"); return; }

    setSaving(true);
    try {
      const data = form.getValues();
      const product = await createProduct(data);

      // upload media files
      for (const item of mediaItems) {
        if (item.file) {
          await uploadMedia(product.id, item.file);
        }
      }

      router.push("/admin/products");
    } catch {
      // error toasted in store
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()}
            className="w-8 h-8 rounded-full hover:bg-accent flex items-center justify-center">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-xl font-bold text-foreground">Add New Products</h1>
        </div>
        <Button onClick={onSave} disabled={saving}
          className="bg-brand hover:bg-brand-hover text-white font-semibold px-6">
          {saving ? "Saving..." : "SAVE"}
        </Button>
      </div>

      <div className="flex gap-6 items-start">

        {/* Left — Tabs */}
        <div className="flex-1 space-y-4">
          {/* Tab Bar */}
          <div className="flex rounded-lg border border-border bg-background overflow-hidden">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button key={key} onClick={() => setActiveTab(key)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium transition-colors",
                  activeTab === key
                    ? "bg-brand text-white"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="rounded-2xl border border-border bg-background p-5">
            {activeTab === "general"  && <GeneralTab  form={form} />}
            {activeTab === "pricing"  && <PricingTab  form={form} />}
            {activeTab === "media"    && <MediaTab    mediaItems={mediaItems} onChange={setMediaItems} />}
            {activeTab === "seo"      && <SeoTab      form={form} />}
            {activeTab === "settings" && <SettingsTab form={form} />}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-64 space-y-4 shrink-0">

          {/* Category */}
          <div className="rounded-2xl border border-border bg-background p-4 space-y-3">
            <h3 className="font-semibold text-foreground text-sm">Category</h3>
            <select
              value={categoryId}
              onChange={(e) => setValue("category_id", e.target.value)}
              className="w-full h-10 px-3 text-sm rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-brand/30"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Publication */}
          <div className="rounded-2xl border border-border bg-background p-4 space-y-2">
            <h3 className="font-semibold text-foreground text-sm mb-3">Publication</h3>
            {(["draft", "published"] as const).map((s) => (
              <button key={s} type="button"
                onClick={() => setValue("status", s)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  status === s ? "bg-brand/10 text-brand" : "hover:bg-accent text-muted-foreground"
                )}
              >
                <span className={cn("w-2 h-2 rounded-full",
                  s === "draft" ? "bg-yellow-400" : "bg-green-500"
                )} />
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}