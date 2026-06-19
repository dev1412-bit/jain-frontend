"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useBlogStore, type ContentBlock } from "@/store/blogStore";
import BlogForm from "@/components/admin/blog/BlogForm";

export default function AdminBlogNewPage() {
  const router         = useRouter();
  const { createPost } = useBlogStore();
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (
    data: any,
    blocks: ContentBlock[],
    coverImage: string,
    publishNow = false
  ) => {
    setSaving(true);
    try {
      await createPost({
        ...data,
        slug:       data.slug     || undefined,
        categoryId: data.categoryId || undefined,
        coverImage: coverImage    || undefined,
        content:    blocks,
        tags:       data.tags
          ? data.tags.split(",").map((t: string) => t.trim()).filter(Boolean)
          : [],
        status: publishNow ? "published" : data.status,
      } as any);
      router.push("/admin/blogs");
    } catch {
      // error shown via toast in store
    } finally {
      setSaving(false);
    }
  };

  return (
    <BlogForm
      mode="create"
      onSubmit={handleSubmit}
      saving={saving}
    />
  );
}