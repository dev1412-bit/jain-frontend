"use client";

import { useBlogStore } from "@/store/blogStore";
import BlogCard from "./BlogCard";
import { Skeleton } from "@/components/ui/skeleton";
import { FileSearch } from "lucide-react";

export default function BlogGrid() {
  // ─── FIXED: Grab exact variables available from your actual blogStore ───
  const { posts, loading, error, searchQuery, selectedCategory } = useBlogStore();

  // ─── FIXED: Calculate client side filtering using active store values ───
  const filteredPosts = posts.filter((post) => {
    // 1. Category matching logic
    const matchesCategory =
      selectedCategory === "All" ||
      post.category?.name.toLowerCase() === selectedCategory.toLowerCase();

    // 2. Search query keyword validation logic
    const matchesSearch =
      searchQuery.trim() === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-border overflow-hidden">
            <Skeleton className="aspect-[16/10] w-full" />
            <div className="p-5 space-y-2">
              <Skeleton className="h-4 w-24 rounded-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full mt-2" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16 text-muted-foreground text-sm">
        {error}
      </div>
    );
  }

  // ─── FIXED: Validates length cleanly against your computed array ───
  if (filteredPosts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
        <FileSearch className="h-10 w-10 text-muted-foreground/30" />
        <p className="font-semibold text-foreground text-sm">No articles found</p>
        <p className="text-xs text-muted-foreground">Try a different search or category</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {/* ─── FIXED: Safely loops using your verified type array ─── */}
      {filteredPosts.map((post) => (
        <BlogCard key={post.id} post={post} />
      ))}
    </div>
  );
}