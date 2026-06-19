"use client";

import { Search } from "lucide-react";
import { useBlogStore } from "@/store/blogStore";

export default function BlogHero() {
  const { searchQuery, setSearch } = useBlogStore();

  return (
    <section className="bg-[#f5f5f7] dark:bg-muted/40 py-14 text-center">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
          Blog &amp; Resources
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Insights, tutorials, and product updates from the JSF team
        </p>

        {/* Search */}
        <div className="relative mt-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles..."
            className="w-full pl-11 pr-4 py-3 rounded-full bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors"
          />
        </div>
      </div>
    </section>
  );
}