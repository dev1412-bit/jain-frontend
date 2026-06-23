"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft, Eye, Heart, Calendar,
  Tag, Share2, BookOpen, ChevronRight,
} from "lucide-react";
import { useBlogStore } from "@/store/blogStore";
import RenderContent from "@/components/sections/blog/RenderContent";
import BlogCard from "@/components/sections/blog/BlogCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router   = useRouter();
  const {
    currentPost,
    posts,
    detailLoading,
    detailError,
    fetchPost,
    fetchPosts,
    likePost,
  } = useBlogStore();

  const [liked, setLiked] = useState(false);

  // Core content retrieval trigger
  useEffect(() => {
    if (slug) {
      fetchPost(slug);
      fetchPosts(); // for related posts
    }
  }, [slug]);

  // FIX: Reset local visual state dynamically when navigating between different blogs
  useEffect(() => {
    if (currentPost) {
      const likedBlogs = JSON.parse(localStorage.getItem("liked_blogs") || "[]");
      if (likedBlogs.includes(currentPost.id)) {
        setLiked(true);
      } else {
        setLiked(false); // Make sure it defaults back to false for unliked pages!
      }
    }
  }, [currentPost, slug]); // Watches both post content modifications and route shifts

  const handleLike = async () => {
    if (!currentPost) return;

    // Visually toggle it on immediately for smooth user interaction
    setLiked(true);

    // Hit the API endpoint silently. If they already liked it, 
    // the backend returns a successful 200 response with the unchanged count.
    await likePost(currentPost.id);
    
    // Track page action history locally
    const likedBlogs = JSON.parse(localStorage.getItem("liked_blogs") || "[]");
    if (!likedBlogs.includes(currentPost.id)) {
      likedBlogs.push(currentPost.id);
      localStorage.setItem("liked_blogs", JSON.stringify(likedBlogs));
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  // Related posts selection filters
  const related = posts
    .filter((p) =>
      p.slug !== slug &&
      p.category?.slug === currentPost?.category?.slug
    )
    .slice(0, 3);

  const storageBase = process.env.NEXT_PUBLIC_BASE_URL + "/storage/app/public/";

  const coverImageUrl = currentPost?.coverImage
    ? currentPost.coverImage.startsWith("http")
      ? currentPost.coverImage
      : `${storageBase}/${currentPost.coverImage}`
    : null;

  if (detailLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <Skeleton className="h-4 w-32 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-8">
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="aspect-video w-full rounded-2xl" />
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (detailError || !currentPost) {
    return (
      <div className="text-center py-24 px-4">
        <p className="text-muted-foreground text-sm">Post not found.</p>
        <Link href="/blog" className="text-brand text-sm mt-3 inline-block hover:underline">
          ← Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground line-clamp-1 max-w-[200px]">{currentPost.title}</span>
        </nav>

        {/* Main content grid split */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-8 items-start">

          {/* ── LEFT: Main content ── */}
          <article>
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {currentPost.category && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand/10 text-brand">
                  {currentPost.category.name}
                </span>
              )}
              {currentPost.featured && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground">
                  Featured
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground leading-tight">
              {currentPost.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mt-4 pb-5 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-white text-xs font-semibold shrink-0">
                  {currentPost.authorName?.slice(0, 2).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-foreground">
                  {currentPost.authorName}
                </span>
              </div>

              {currentPost.publishedAt && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  {currentPost.publishedAt}
                </div>
              )}

              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Eye className="h-3.5 w-3.5" />
                {currentPost.viewsCount} views
              </div>

              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <BookOpen className="h-3.5 w-3.5" />
                {Math.ceil((currentPost.content?.length ?? 1) * 0.5)} min read
              </div>

              <button
                onClick={handleShare}
                className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <Share2 className="h-3.5 w-3.5" />
                Share
              </button>
            </div>

            {coverImageUrl && (
              <div className="mt-6 aspect-video rounded-2xl overflow-hidden bg-muted">
                <img
                  src={coverImageUrl}
                  alt={currentPost.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <p className="mt-6 text-base text-muted-foreground leading-relaxed border-l-4 border-brand pl-4 bg-brand/5 py-3 rounded-r-lg">
              {currentPost.excerpt}
            </p>

            <div className="mt-8">
              {currentPost.content && currentPost.content.length > 0 ? (
                <RenderContent blocks={currentPost.content} />
              ) : (
                <p className="text-muted-foreground text-sm">No content available.</p>
              )}
            </div>

            {currentPost.tags && currentPost.tags.length > 0 && (
              <div className="mt-10 pt-6 border-t border-border">
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag className="h-4 w-4 text-muted-foreground shrink-0" />
                  {currentPost.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground hover:bg-brand/10 hover:text-brand transition-colors cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-border flex items-center justify-between gap-4">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Blog
              </button>

              {/* FIX: REMOVED disabled PROPERT AND REMOVED cursor-not-allowed STYLE */}
              <button
                onClick={handleLike}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all active:scale-95",
                  liked
                    ? "bg-red-500/10 text-red-500 border-red-500/30"
                    : "border-border text-muted-foreground hover:border-red-500/30 hover:text-red-500"
                )}
              >
                <Heart className={cn("h-4 w-4 transition-transform", liked && "fill-red-500 text-red-500")} />
                <span>{currentPost.likesCount ?? 0} Likes</span>
              </button>
            </div>
          </article>

          {/* ── RIGHT: Sidebar ── */}
          <aside className="space-y-5 lg:sticky lg:top-20">
            <div className="bg-background border border-border rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3">About the Author</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-brand flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {currentPost.authorName?.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{currentPost.authorName}</p>
                  <p className="text-xs text-muted-foreground">JainSoftware Team</p>
                </div>
              </div>
            </div>

            <div className="bg-background border border-border rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Post Stats</h3>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5" /> Views
                </span>
                <span className="font-semibold text-foreground">{currentPost.viewsCount}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Heart className="h-3.5 w-3.5" /> Likes
                </span>
                <span className={cn("font-semibold transition-colors", liked ? "text-red-500" : "text-foreground")}>
                  {currentPost.likesCount ?? 0}
                </span>
              </div>
              {currentPost.publishedAt && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" /> Published
                  </span>
                  <span className="font-semibold text-foreground text-xs">{currentPost.publishedAt}</span>
                </div>
              )}
            </div>

            {currentPost.tags && currentPost.tags.length > 0 && (
              <div className="bg-background border border-border rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-foreground mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {currentPost.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-background border border-border rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-3">Share this post</h3>
              <Button
                onClick={handleShare}
                variant="outline"
                size="sm"
                className="w-full gap-2 rounded-lg"
              >
                <Share2 className="h-4 w-4" />
                Copy Link
              </Button>
            </div>
          </aside>
        </div>

        {/* Related Posts display row */}
        {related.length > 0 && (
          <div className="mt-16 pt-8 border-t border-border">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">You might also like</h2>
              <Link href="/blog" className="text-xs text-brand hover:underline flex items-center gap-1">
                View all <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}