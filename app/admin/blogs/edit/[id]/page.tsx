"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useBlogStore, type ContentBlock, type Blog } from "@/store/blogStore";
import BlogForm from "@/components/admin/blog/BlogForm";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminBlogEditPage() {
  const { id }          = useParams<{ id: string }>();
  const router          = useRouter();
  const { fetchAdminPost, updatePost } = useBlogStore();

  const [post, setPost]     = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);

  // Fetch existing post on mount
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchAdminPost(id);
        setPost(data);
      } catch {
        router.push("/admin/blog");
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  const handleSubmit = async (
    data: any,
    blocks: ContentBlock[],
    coverImage: string,
    publishNow = false
  ) => {
    setSaving(true);
    try {
      await updatePost(id, {
        ...data,
        slug:       data.slug       || undefined,
        categoryId: data.categoryId || undefined,
        coverImage: coverImage      || undefined,
        content:    blocks,
        tags:       data.tags
          ? data.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
          : [],
        status: publishNow ? "published" : data.status,
      } as any);
      router.push("/admin/blog");
    } catch {
      // error shown via toast in store
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Skeleton className="w-8 h-8 rounded-lg" />
          <div className="space-y-1.5">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3 w-56" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
          <div className="space-y-4">
            <Skeleton className="h-48 rounded-2xl" />
            <Skeleton className="h-80 rounded-2xl" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-48 rounded-2xl" />
            <Skeleton className="h-40 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <BlogForm
      mode="edit"
      post={post}
      onSubmit={handleSubmit}
      saving={saving}
    />
  );
}