"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus, Search, Eye, Pencil, Trash2,
  Globe, Archive, Star, StarOff, MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useBlogStore, type Blog } from "@/store/blogStore";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const statusStyle: Record<string, string> = {
  published: "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
  draft:     "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-500",
  archived:  "bg-muted text-muted-foreground",
  scheduled: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
};

const STATUS_FILTERS = ["all", "published", "draft", "archived", "scheduled"];

export default function AdminBlogPage() {
  const {
    adminPosts, adminLoading,
    fetchAdminPosts, deletePost, publishPost, archivePost, toggleFeatured,
  } = useBlogStore();

  const [search, setSearch]       = useState("");
  const [statusFilter, setStatus] = useState("all");

  useEffect(() => {
    fetchAdminPosts();
  }, []);

  // re-fetch on filter change
  useEffect(() => {
    const params: any = {};
    if (statusFilter !== "all") params.status = statusFilter;
    if (search)                  params.search = search;
    const timer = setTimeout(() => fetchAdminPosts(params), 400);
    return () => clearTimeout(timer);
  }, [search, statusFilter]);

  const handleDelete = (post: Blog) => {
    if (confirm(`Delete "${post.title}"? This cannot be undone.`)) {
      deletePost(post.id);
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Blog Posts</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {adminLoading ? "Loading..." : `${adminPosts.length} posts`}
          </p>
        </div>
        <Button asChild className="bg-brand hover:bg-brand-hover text-white rounded-lg gap-1.5 h-9 px-4">
          <Link href="/admin/blogs/new">
            <Plus className="h-4 w-4" />
            New Post
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search posts..."
            className="pl-9 h-9 text-sm"
          />
        </div>

        {/* Status filter pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium border capitalize transition-colors",
                statusFilter === s
                  ? "bg-brand text-white border-brand"
                  : "bg-background text-foreground border-border hover:bg-accent"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-background border border-border rounded-2xl overflow-hidden">
        {adminLoading ? (
          <div className="p-4 space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        ) : adminPosts.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-muted-foreground text-sm">No posts found.</p>
            <Button asChild className="mt-4 bg-brand hover:bg-brand-hover text-white rounded-full px-6">
              <Link href="/admin/blogs/new">Create first post</Link>
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Title</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">Category</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">Author</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Views</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {adminPosts.map((post) => (
                  <tr
                    key={post.id}
                    className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                  >
                    {/* Title */}
                    <td className="px-5 py-3.5 max-w-[240px]">
                      <div className="flex items-center gap-2">
                        {post.featured && (
                          <Star className="h-3.5 w-3.5 text-brand fill-brand shrink-0" />
                        )}
                        <p className="font-medium text-foreground text-sm line-clamp-1">
                          {post.title}
                        </p>
                      </div>
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {post.tags.slice(0, 2).map((t) => (
                            <span key={t} className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3.5 hidden sm:table-cell">
                      <span className="text-xs text-muted-foreground">
                        {post.category?.name ?? "—"}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-[11px] font-medium capitalize",
                        statusStyle[post.status]
                      )}>
                        {post.status}
                      </span>
                    </td>

                    {/* Author */}
                    <td className="px-4 py-3.5 hidden md:table-cell text-xs text-muted-foreground">
                      {post.authorName}
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3.5 hidden md:table-cell text-xs text-muted-foreground">
                      {post.publishedAt ?? post.createdAt ?? "—"}
                    </td>

                    {/* Views */}
                    <td className="px-4 py-3.5 hidden lg:table-cell">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Eye className="h-3 w-3" />
                        {post.viewsCount}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* View */}
                        {post.status === "published" && (
                          <Link
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            className="w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Link>
                        )}

                        {/* Edit */}
                        <Link
                          href={`/admin/blogs/edit/${post.id}`}
                          className="w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Link>

                        {/* More actions dropdown */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                              <MoreHorizontal className="h-3.5 w-3.5" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            {post.status !== "published" && (
                              <DropdownMenuItem
                                onClick={() => publishPost(post.id)}
                                className="gap-2 text-xs"
                              >
                                <Globe className="h-3.5 w-3.5" />
                                Publish
                              </DropdownMenuItem>
                            )}
                            {post.status === "published" && (
                              <DropdownMenuItem
                                onClick={() => archivePost(post.id)}
                                className="gap-2 text-xs"
                              >
                                <Archive className="h-3.5 w-3.5" />
                                Archive
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => toggleFeatured(post.id)}
                              className="gap-2 text-xs"
                            >
                              {post.featured
                                ? <><StarOff className="h-3.5 w-3.5" /> Unfeature</>
                                : <><Star className="h-3.5 w-3.5" /> Feature</>
                              }
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDelete(post)}
                              className="gap-2 text-xs text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}