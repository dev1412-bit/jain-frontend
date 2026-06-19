"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, FileText, DollarSign, Image, Globe, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCategoryStore } from "@/store/categoryStore";
import { useProductStore } from "@/store/productStore";
import GeneralTab  from "@/components/admin/product/GeneralTab";
import PricingTab  from "@/components/admin/product/PricingTab";
import MediaTab    from "@/components/admin/product/MediaTab";
import SeoTab      from "@/components/admin/product/SeoTab";
import SettingsTab from "@/components/admin/product/SettingsTab";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import api from "@/lib/axios";
import { type ProductFormFields } from "./AddProductPage";

// reuse same schema from AddProductPage
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
  })).optional(),
  seo: z.object({
    meta_title:       z.string().optional(),
    meta_description: z.string().optional(),
    focus_keyword:    z.string().optional(),
    canonical_url:    z.string().optional(),
  }).optional(),
  settings: z.object({
    license_key_format:   z.string().optional(),
    downloadable_file:    z.string().optional(),
    subscription_enabled: z.boolean().optional(),
  }).optional(),
});

type MediaItem = { id?: string; url: string; file?: File };

const TABS = [
  { key: "general",  label: "General",  icon: FileText   },
  { key: "pricing",  label: "Pricing",  icon: DollarSign },
  { key: "media",    label: "Media",    icon: Image      },
  { key: "seo",      label: "SEO",      icon: Globe      },
  { key: "settings", label: "Settings", icon: Settings   },
] as const;

type TabKey = typeof TABS[number]["key"];

type Props = { productId: string };

export default function EditProductPage({ productId }: Props) {
  const router = useRouter();
  const { categories, fetchCategories } = useCategoryStore();
  const { updateProduct, uploadMedia, deleteMedia } = useProductStore();

  const [activeTab,   setActiveTab]   = useState<TabKey>("general");
  const [mediaItems,  setMediaItems]  = useState<MediaItem[]>([]);
  const [saving,      setSaving]      = useState(false);
  const [fetching,    setFetching]    = useState(true);

  const form = useForm<ProductFormFields, unknown, ProductFormFields>({
    resolver: zodResolver(schema) as Resolver<ProductFormFields>,
    defaultValues: {
      title: "", slug: "", description: "",
      base_price: 0, status: "draft", category_id: "",
      pricing_plans: [],
      settings: { subscription_enabled: false },
    },
  });

  const { watch, setValue } = form;
  const status     = watch("status");
  const categoryId = watch("category_id");

  useEffect(() => {
    fetchCategories();
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    setFetching(true);
    try {
      const res  = await api.get(`/products/${productId}`);
      const data = res.data.data ?? res.data;

      // populate form
      form.reset({
        title:       data.title       ?? "",
        slug:        data.slug        ?? "",
        description: data.description ?? "",
        base_price:  data.basePrice   ?? 0,
        emi_price:   data.emiPrice    ?? null,
        status:      data.status      ?? "draft",
        category_id: String(data.categoryId ?? data.category?.id ?? ""),
        features:    data.features    ?? [],

        pricing_plans: data.pricingPlans?.map((p: any) => ({
          plan_name:      p.planName,
          price:          p.price,
          original_price: p.originalPrice ?? null,
          period:         p.period,
        })) ?? [],

        seo: {
          meta_title:       data.seo?.metaTitle       ?? "",
          meta_description: data.seo?.metaDescription ?? "",
          focus_keyword:    data.seo?.focusKeyword    ?? "",
          canonical_url:    data.seo?.canonicalUrl    ?? "",
        },

        settings: {
          license_key_format:   data.settings?.licenseKeyFormat   ?? "",
          downloadable_file:    data.settings?.downloadableFile   ?? "",
          subscription_enabled: data.settings?.subscriptionEnabled ?? false,
        },
      });

      // populate existing media
      if (data.media?.length) {
        setMediaItems(data.media.map((m: any) => ({
          id:  m.id,
          url: m.url,
        })));
      }
    } catch {
      toast.error("Failed to load product");
      router.push("/admin/products");
    } finally {
      setFetching(false);
    }
  };

  const onSave = async () => {
    const valid = await form.trigger();
    if (!valid) { toast.error("Please fix form errors"); return; }

    setSaving(true);
    try {
      const data = form.getValues();
      await updateProduct(productId, data);

      // upload new media files (those with file property)
      for (const item of mediaItems) {
        if (item.file) {
          await uploadMedia(productId, item.file);
        }
      }

      toast.success("Product updated successfully!");
      router.push("/admin/products");
    } catch {
      // error toasted in store
    } finally {
      setSaving(false);
    }
  };

  // handle media removal — if existing (has id) delete from server
  const handleMediaChange = async (items: MediaItem[]) => {
    const removed = mediaItems.filter(
      (m) => m.id && !items.find((i) => i.id === m.id)
    );
    for (const r of removed) {
      if (r.id) {
        try {
          await deleteMedia(productId, r.id);
        } catch {}
      }
    }
    setMediaItems(items);
  };

  if (fetching) {
    return (
      <div className="p-6 space-y-4">
        <div className="h-8 bg-muted animate-pulse rounded-xl w-48" />
        <div className="h-64 bg-muted animate-pulse rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()}
            className="w-8 h-8 rounded-full hover:bg-accent flex items-center justify-center">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Edit Product</h1>
            <p className="text-xs text-muted-foreground">{watch("title")}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.push("/admin/products")}
            className="rounded-xl">
            Discard
          </Button>
          <Button onClick={onSave} disabled={saving}
            className="bg-brand hover:bg-brand-hover text-white font-semibold px-6 rounded-xl">
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
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
            {activeTab === "media"    && (
              <MediaTab
                mediaItems={mediaItems}
                onChange={handleMediaChange}
              />
            )}
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
            {(["draft", "published", "archived"] as const).map((s) => (
              <button key={s} type="button"
                onClick={() => setValue("status", s)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  status === s
                    ? "bg-brand/10 text-brand"
                    : "hover:bg-accent text-muted-foreground"
                )}
              >
                <span className={cn("w-2 h-2 rounded-full",
                  s === "draft"     && "bg-yellow-400",
                  s === "published" && "bg-green-500",
                  s === "archived"  && "bg-muted-foreground",
                )} />
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>

          {/* Product ID info */}
          <div className="rounded-2xl border border-border bg-background p-4 space-y-2">
            <h3 className="font-semibold text-foreground text-sm">Info</h3>
            <p className="text-xs text-muted-foreground">
              ID: <span className="font-mono text-foreground">{productId}</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Slug: <span className="font-mono text-foreground text-[11px]">{watch("slug")}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}