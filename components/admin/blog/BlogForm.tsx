"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Save, Globe } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBlogStore, type ContentBlock, type Blog } from "@/store/blogStore";
import { useCategoryStore } from "@/store/categoryStore";
import ContentBlockBuilder from "./ContentBlockBuilder";
import ImageUpload from "./ImageUpload";
import { cn } from "@/lib/utils";

const schema = z.object({
  title:           z.string().min(5, "Title must be at least 5 characters"),
  slug:            z.string().optional(),
  excerpt:         z.string().min(10, "Excerpt required").max(500),
  authorName:      z.string().min(2, "Author name required"),
  categoryId:      z.string().optional(),
  status:          z.enum(["draft", "published", "scheduled"]),
  featured:        z.boolean(),
  metaTitle:       z.string().max(60).optional(),
  metaDescription: z.string().max(160).optional(),
  tags:            z.string().optional(),
});

type FormData = z.infer<typeof schema>;

type Props = {
  mode: "create" | "edit";
  post?: Blog;                     // existing post for edit mode
  onSubmit: (data: FormData, blocks: ContentBlock[], coverImage: string, publishNow?: boolean) => Promise<void>;
  saving: boolean;
};

export default function BlogForm({ mode, post, onSubmit, saving }: Props) {
  const { categories, fetchCategories } = useCategoryStore();
  const [blocks, setBlocks]             = useState<ContentBlock[]>(post?.content ?? []);
  const [coverImage, setCoverImage]     = useState<string>(post?.coverImage ?? "");
  const [activeTab, setActiveTab]       = useState<"content" | "seo">("content");

  useEffect(() => { fetchCategories(); }, []);

  // Pre-fill form when editing
  useEffect(() => {
    if (post) {
      setBlocks(post.content ?? []);
      setCoverImage(post.coverImage ?? "");
    }
  }, [post]);

  const {
    register, handleSubmit, watch, setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: mode === "edit" && post ? {
      title:           post.title,
      slug:            post.slug,
      excerpt:         post.excerpt,
      authorName:      post.authorName,
      categoryId:      post.category?.id ?? "",
      status:          post.status as any,
      featured:        post.featured,
      metaTitle:       post.metaTitle ?? "",
      metaDescription: post.metaDescription ?? "",
      tags:            post.tags?.join(", ") ?? "",
    } : {
      status: "draft", featured: false, authorName: "Sohil Jain",
    },
  });

  // Auto generate slug from title (only on create)
  const title = watch("title");
  useEffect(() => {
    if (mode === "create" && title) {
      setValue("slug", title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
    }
  }, [title, mode]);

  const handleFormSubmit = async (data: FormData, publishNow = false) => {
    if (blocks.length === 0) {
      alert("Please add at least one content block");
      return;
    }
    await onSubmit(data, blocks, coverImage, publishNow);
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/blog"
            className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-accent transition-colors"
          >
            <ArrowLeft className="h-4 w-4 text-muted-foreground" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              {mode === "create" ? "New Blog Post" : "Edit Blog Post"}
            </h1>
            <p className="text-xs text-muted-foreground">
              {mode === "create" ? "Create and publish a new post" : `Editing: ${post?.title}`}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={saving}
            onClick={handleSubmit((d) => handleFormSubmit(d, false))}
            className="gap-2 rounded-lg h-9"
          >
            <Save className="h-3.5 w-3.5" />
            {mode === "edit" ? "Update" : "Save Draft"}
          </Button>
          {(mode === "create" || post?.status !== "published") && (
            <Button
              type="button"
              disabled={saving}
              onClick={handleSubmit((d) => handleFormSubmit(d, true))}
              className="gap-2 bg-brand hover:bg-brand-hover text-white rounded-lg h-9"
            >
              <Globe className="h-3.5 w-3.5" />
              {saving ? "Saving..." : "Publish Now"}
            </Button>
          )}
        </div>
      </div>

      {/* Form grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 items-start">

        {/* LEFT */}
        <div className="space-y-5">

          {/* Title + Slug + Excerpt */}
          <div className="bg-background border border-border rounded-2xl p-5 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Title *
              </Label>
              <Input
                placeholder="Enter blog post title..."
                className={cn("h-11 text-base font-medium", errors.title && "border-destructive")}
                {...register("title")}
              />
              {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Slug
              </Label>
              <Input
                placeholder="auto-generated-from-title"
                className="h-9 text-sm font-mono"
                {...register("slug")}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Excerpt * <span className="normal-case font-normal">(shown on cards — max 500 chars)</span>
              </Label>
              <textarea
                rows={3}
                placeholder="Brief description of this post..."
                className={cn(
                  "w-full px-3 py-2.5 text-sm rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-brand/30",
                  errors.excerpt && "border-destructive"
                )}
                {...register("excerpt")}
              />
              {errors.excerpt && <p className="text-xs text-destructive">{errors.excerpt.message}</p>}
            </div>
          </div>

          {/* Content + SEO tabs */}
          <div className="bg-background border border-border rounded-2xl overflow-hidden">
            <div className="flex border-b border-border">
              {(["content", "seo"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "flex-1 py-3 text-sm font-medium capitalize transition-colors",
                    activeTab === tab
                      ? "text-brand border-b-2 border-brand bg-brand/5"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab === "seo" ? "SEO Settings" : "Content Blocks"}
                </button>
              ))}
            </div>

            <div className="p-5">
              {activeTab === "content" && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground mb-3">
                    Build your post by adding blocks. Each block becomes a section of your article.
                  </p>
                  <ContentBlockBuilder blocks={blocks} onChange={setBlocks} />
                  {blocks.length === 0 && (
                    <p className="text-xs text-center text-muted-foreground py-4">
                      No blocks yet — click &ldquo;Add Block&rdquo; to start writing
                    </p>
                  )}
                </div>
              )}

              {activeTab === "seo" && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Meta Title <span className="normal-case font-normal">(max 60 chars)</span>
                    </Label>
                    <Input
                      placeholder="Defaults to post title"
                      className="h-9 text-sm"
                      {...register("metaTitle")}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Meta Description <span className="normal-case font-normal">(max 160 chars)</span>
                    </Label>
                    <textarea
                      rows={3}
                      placeholder="Defaults to excerpt"
                      className="w-full px-3 py-2.5 text-sm rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-brand/30"
                      {...register("metaDescription")}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT sidebar */}
        <div className="space-y-4 lg:sticky lg:top-20">

          {/* Publish settings */}
          <div className="bg-background border border-border rounded-2xl p-4 space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Publish Settings</h3>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Status</Label>
              <select
                className="w-full h-9 px-3 text-sm rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-brand/30"
                {...register("status")}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">Featured Post</Label>
              <input type="checkbox" className="accent-brand w-4 h-4" {...register("featured")} />
            </div>
          </div>

          {/* Post details */}
          <div className="bg-background border border-border rounded-2xl p-4 space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Post Details</h3>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Author Name *</Label>
              <Input
                placeholder="Author name"
                className={cn("h-9 text-sm", errors.authorName && "border-destructive")}
                {...register("authorName")}
              />
              {errors.authorName && (
                <p className="text-xs text-destructive">{errors.authorName.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Category</Label>
              <select
                className="w-full h-9 px-3 text-sm rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-brand/30"
                {...register("categoryId")}
              >
                <option value="">None</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">
                Tags <span className="font-normal">(comma separated)</span>
              </Label>
              <Input
                placeholder="saas, nextjs, laravel"
                className="h-9 text-sm"
                {...register("tags")}
              />
            </div>
          </div>

          {/* Cover image upload */}
          <div className="bg-background border border-border rounded-2xl p-4">
            <ImageUpload
              value={coverImage}
              onChange={setCoverImage}
              label="Cover Image"
            />
          </div>

          {/* Content stats */}
          <div className="bg-muted/30 border border-border rounded-2xl p-4 space-y-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Content Stats
            </h3>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Blocks</span>
              <span className="font-semibold text-foreground">{blocks.length}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Est. read time</span>
              <span className="font-semibold text-foreground">
                {Math.max(1, Math.ceil(blocks.length * 0.5))} min
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}