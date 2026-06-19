"use client";

import { useState, useEffect } from "react";
import { Save, Globe, Key, FileText } from "lucide-react";
import { useCmsStore } from "@/store/cmsStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function GlobalSeoForm() {
  // ─── UPDATED: Matches your exact Zustand store hooks ───
  const { seoSettings, loading, updateSeoSettings } = useCmsStore();

  const [form, setForm] = useState({
    site_name: "",
    meta_title: "",
    meta_description: "",
    og_image: "",
    twitter_handle: "",
    contact_email: "",
    contact_phone: "",
  });

  // Sync store data to fields once populated from the backend database
  useEffect(() => {
    if (seoSettings) {
      setForm({
        site_name: seoSettings.site_name || "",
        meta_title: seoSettings.meta_title || "",
        meta_description: seoSettings.meta_description || "",
        og_image: seoSettings.og_image || "",
        twitter_handle: seoSettings.twitter_handle || "",
        contact_email: seoSettings.contact_email || "",
        contact_phone: seoSettings.contact_phone || "",
      });
    }
  }, [seoSettings]);

  const updateField = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Calls your exact store function method
      await updateSeoSettings(form); 
    } catch (err) {
      console.error("Form save error:", err);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-background p-6 space-y-6">
      <div>
        <h2 className="text-base font-semibold text-foreground">Global Search Engine Optimization</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Configure default metadata headers to optimize indexing performance across search crawlers.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Site Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Site Name
            </label>
            <Input
              value={form.site_name}
              onChange={(e) => updateField("site_name", e.target.value)}
              placeholder="Jain Software"
            />
          </div>

          {/* Meta Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5" /> Meta Title
            </label>
            <Input
              value={form.meta_title}
              onChange={(e) => updateField("meta_title", e.target.value)}
              placeholder="Jain Software | Custom Enterprise Solutions"
            />
          </div>
        </div>

        {/* Meta Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5" /> Meta Description
          </label>
          <textarea
            value={form.meta_description}
            onChange={(e) => updateField("meta_description", e.target.value)}
            placeholder="Provide a concise summary of your platform's core services..."
            rows={3}
            className="w-full min-h-[80px] px-3 py-2 text-sm rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Open Graph Image */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              OG Image Preview URL
            </label>
            <Input
              value={form.og_image}
              onChange={(e) => updateField("og_image", e.target.value)}
              placeholder="https://gymx.jain.software/storage/seo/og-banner.png"
            />
          </div>

          {/* Twitter Handle */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Twitter Handle
            </label>
            <Input
              value={form.twitter_handle}
              onChange={(e) => updateField("twitter_handle", e.target.value)}
              placeholder="@jainsoftware"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Contact Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Contact Email
            </label>
            <Input
              value={form.contact_email}
              onChange={(e) => updateField("contact_email", e.target.value)}
              placeholder="contact@jain.software"
            />
          </div>

          {/* Contact Phone */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Contact Phone
            </label>
            <Input
              value={form.contact_phone}
              onChange={(e) => updateField("contact_phone", e.target.value)}
              placeholder="+91 XXXXXXXXXX"
            />
          </div>
        </div>

        {/* Actions Button */}
        <div className="pt-2">
          <Button
            type="submit"
            className="bg-brand hover:bg-brand-hover text-white px-5 gap-2"
            disabled={loading}
          >
            <Save className="h-4 w-4" />
            {loading ? "Saving Changes..." : "Save SEO Settings"}
          </Button>
        </div>
      </form>
    </div>
  );
}