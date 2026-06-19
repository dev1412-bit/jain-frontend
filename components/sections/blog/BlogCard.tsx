"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, ArrowRight, User } from "lucide-react";
// Import the base Blog type that we mapped
import type { Blog } from "@/store/blogStore";

type Props = { post: Blog };

export default function BlogCard({ post }: Props) {
  // Safe fallback for cover images if they are undefined or empty string
  const displayImage = post.coverImage || "/placeholder-blog.png"; 

  // Fallback fallback character if authorName is empty
  const authorInitial = post.authorName ? post.authorName.charAt(0).toUpperCase() : "A";

  return (
    <div className="bg-background border border-border rounded-2xl overflow-hidden hover:shadow-md hover:border-brand/20 transition-all duration-200 flex flex-col">

      {/* Image Block */}
      <Link href={`/blog/${post.slug}`} className="block relative aspect-[16/10] bg-muted overflow-hidden">
        <Image
          src={displayImage}
          alt={post.title}
          fill
          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
          className="object-cover hover:scale-105 transition-transform duration-300"
          priority={false}
        />
      </Link>

      {/* Content Block */}
      <div className="p-5 flex flex-col flex-1 gap-3">

        {/* Category Wrapper */}
        <div className="flex items-center gap-2">
          {post.category?.name && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand/10 text-brand">
              {post.category.name}
            </span>
          )}
          {/* Dynamic clean date marker since readTime does not exist in backend schema */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
            <Clock className="h-3 w-3" />
            {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : "Recent"}
          </div>
        </div>

        {/* Title */}
        <Link href={`/blog/${post.slug}`}>
          <h3 className="font-bold text-foreground text-sm sm:text-base leading-snug hover:text-brand transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>

        {/* Excerpt */}
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {post.excerpt}
        </p>

        {/* Footer info blocks */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex items-center gap-2">
            {/* Dynamic circle generator matching author layout schema safely */}
            <div className="w-7 h-7 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center text-brand text-[10px] font-semibold shrink-0">
              {authorInitial}
            </div>
            <span className="text-xs text-muted-foreground truncate max-w-[100px]">
              {post.authorName || "Admin"}
            </span>
          </div>
          
          <Link
            href={`/blog/${post.slug}`}
            className="flex items-center gap-1 text-xs font-semibold text-brand hover:underline"
          >
            Read <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}