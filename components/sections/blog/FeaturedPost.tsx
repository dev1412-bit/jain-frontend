import Image from "next/image";
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import type { Blog } from "@/store/blogStore";

export default function FeaturedPost({ post }: { post: Blog }) {
  return (
    <div className="bg-background border border-border rounded-2xl overflow-hidden mb-6 hover:shadow-md transition-shadow">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Image */}
        <div className="relative aspect-[16/10] lg:aspect-auto lg:min-h-[260px] bg-muted">
          <Image
            src={post.coverImage || "/placeholder.jpg"}
            alt={post.title}
            fill
            sizes="(max-width:1024px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>

        <div className="p-6 flex flex-col justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            {post.category && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand/10 text-brand">
                {post.category.name}
              </span>
            )}
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-muted text-muted-foreground">
              Featured
            </span>
          </div>

          <Link href={`/blog/${post.slug}`}>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground leading-snug hover:text-brand transition-colors">
              {post.title}
            </h2>
          </Link>

          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between mt-auto pt-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-white text-xs font-semibold shrink-0">
                {post.authorName?.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">{post.authorName}</p>
                {post.publishedAt && (
                  <p className="text-xs text-muted-foreground">{post.publishedAt}</p>
                )}
              </div>
            </div>
            <Link
              href={`/blog/${post.slug}`}
              className="flex items-center gap-1 text-sm font-medium text-brand hover:underline"
            >
              Read more <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}