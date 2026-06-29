"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Star, Share2, Heart, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import ProductImageSlider from "@/components/sections/product/ProductImageSlider";
import ProductPricingCard from "@/components/sections/product/ProductPricingCard";
import ProductFeatures from "@/components/sections/product/ProductFeatures";
import ProductTestimonials from "@/components/sections/product/ProductTestimonials";
import ProductFAQ from "@/components/sections/product/ProductFAQ";
import StatsSection from "@/components/sections/StatsSection";
import { useProductDetailStore, GLOBAL_TESTIMONIALS, GLOBAL_FAQS } from "@/store/productDetailsStore";
import ProductReviews from "@/components/sections/product/ProductReviews";

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { product, loading, fetchProduct } = useProductDetailStore();

  useEffect(() => {
    if (slug) fetchProduct(slug);
  }, [slug]);

  // ── Loading skeleton ──
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Skeleton className="h-4 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          <div className="space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="aspect-[16/10] w-full rounded-xl" />
          </div>
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6 flex-wrap">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/store" className="hover:text-foreground transition-colors">Store</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href={`/store?category=${product.category.toLowerCase()}`} className="hover:text-foreground transition-colors">
            {product.category}
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">{product.name}</span>
        </nav>

        {/* ── Top section: 2 columns ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">

          {/* LEFT: Info + Slider */}
          <div className="space-y-4">
            {/* Title row */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                  {product.name}
                </h1>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed max-w-xl">
                  {product.tagline}
                </p>
              </div>

              {/* Rating + actions */}
              <div className="flex flex-col items-end gap-2 shrink-0">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-brand text-brand" />
                  <span className="text-sm font-semibold text-foreground">{product.rating}</span>
                  <span className="text-xs text-muted-foreground">({product.ratingCount})</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-accent transition-colors">
                    <Share2 className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                  <button className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-accent transition-colors">
                    <Heart className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </div>

            {/* Image slider */}
            <ProductImageSlider images={product.images} name={product.name} />
          </div>

          {/* RIGHT: Pricing card — sticky */}
          <div>
            <ProductPricingCard product={product} />
          </div>
        </div>

        {/* ── Below fold: full width ── */}
        <div className="mt-4">
          {/* Stats */}
          <StatsSection />

          {/* Features */}
          <ProductFeatures features={product.features} />

          <ProductTestimonials testimonials={GLOBAL_TESTIMONIALS} />
          <ProductFAQ faqs={GLOBAL_FAQS} />
          <ProductReviews productId={product.id} />
        </div>

      </div>
    </div>
  );
}