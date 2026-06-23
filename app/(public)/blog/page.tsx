"use client";

import { useEffect } from "react";
import { useBlogStore } from "@/store/blogStore";
import BlogHero from "@/components/sections/blog/BlogHero";
import CategoryFilter from "@/components/sections/blog/CategoryFilter";
import FeaturedPost from "@/components/sections/blog/FeaturedPost";
import BlogCard from "@/components/sections/blog/BlogCard";
import { Skeleton } from "@/components/ui/skeleton";
import { FileSearch } from "lucide-react";
import { useBlogCategoryStore } from "@/store/blogCategoryStore";
function BlogGridSkeleton() {
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

export default function BlogPage() {
  const {
    posts,
    featuredPost,
    loading,
    error,
    searchQuery,
    fetchPosts,
    selectedCategory,
  } = useBlogStore();
  const { categories } = useBlogCategoryStore();

useEffect(() => {
  const cat = categories.find((c) => c.name === selectedCategory);
  const timer = setTimeout(() => {
    fetchPosts({
      search: searchQuery || undefined,
      category: selectedCategory !== "All" ? cat?.slug : undefined,
    });
  }, 400);
  return () => clearTimeout(timer);
}, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-background">
      <BlogHero />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <CategoryFilter />

        {loading ? (
          <>
           
            <div className="rounded-2xl border border-border overflow-hidden mb-6">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <Skeleton className="aspect-[16/10] lg:min-h-[260px] w-full" />
                <div className="p-6 space-y-4">
                  <Skeleton className="h-4 w-32 rounded-full" />
                  <Skeleton className="h-7 w-full" />
                  <Skeleton className="h-7 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              </div>
            </div>
            <BlogGridSkeleton />
          </>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
            <FileSearch className="h-10 w-10 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        ) : (
          <>
            {featuredPost && <FeaturedPost post={featuredPost} />}
            {posts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
                <FileSearch className="h-10 w-10 text-muted-foreground/30" />
                <p className="font-semibold text-foreground text-sm">No articles found</p>
                <p className="text-xs text-muted-foreground">
                  Try a different search or category
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {posts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}