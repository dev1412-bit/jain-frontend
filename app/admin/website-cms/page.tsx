"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCmsStore } from "@/store/cmsStore";
import { cn } from "@/lib/utils";
import TestimonialsManager from "@/components/admin/cms/TestimonialsManager";
import FaqsManager from "@/components/admin/cms/FaqsManager";
import TeamManager from "@/components/admin/cms/TeamManager";
import NavigationManager from "@/components/admin/cms/NavigationManager";
import GlobalSeoForm from "@/components/admin/cms/GlobalSeoForm";

type Tab = "pages" | "navigation" | "seo";

const TABS = [
  { id: "pages"      as Tab, label: "Pages"      },
  { id: "navigation" as Tab, label: "Navigation" },
  { id: "seo"        as Tab, label: "Global SEO" },
];

export default function AdminCmsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("pages");
  const { fetchAll, loading } = useCmsStore();

  useEffect(() => { fetchAll(); }, []);

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Website CMS</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage pages, content, and navigation
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px",
              activeTab === tab.id
                ? "border-brand text-brand"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>
        {activeTab === "pages" && (
          <div className="space-y-8">
            <TeamManager />
            <TestimonialsManager />
            <FaqsManager />
          </div>
        )}
        {activeTab === "navigation" && <NavigationManager />}
        {activeTab === "seo"        && <GlobalSeoForm />}
      </div>
    </div>
  );
}