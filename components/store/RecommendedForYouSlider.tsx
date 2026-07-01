"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { useProductStore } from "@/store/productStore";
import { useCartStore } from "@/store/cartStore";
import ProductCard from "@/components/store/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

const AUTO_SCROLL_INTERVAL = 4000; // ms
const CARD_WIDTH_PX = 280; // approx width of one ProductCard incl. gap, used for scroll-by amount

export default function RecommendedForYouSlider() {
  const { items } = useCartStore();
  const { recommendedProducts, recommendedLoading, fetchRecommendedProducts } = useProductStore();

  const trackRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  useEffect(() => {
    const slugs = items.map((i) => i.slug);
    fetchRecommendedProducts(slugs);
  }, [items]);

  const updateArrowState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  const scrollByAmount = (dir: "left" | "right") => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -CARD_WIDTH_PX : CARD_WIDTH_PX, behavior: "smooth" });
  };

  // auto-scroll loop
  useEffect(() => {
    if (isPaused || recommendedProducts.length === 0) return;
    const interval = setInterval(() => {
      const el = trackRef.current;
      if (!el) return;

      const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 4;
      if (atEnd) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: CARD_WIDTH_PX, behavior: "smooth" });
      }
    }, AUTO_SCROLL_INTERVAL);

    return () => clearInterval(interval);
  }, [isPaused, recommendedProducts.length]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    updateArrowState();
    el.addEventListener("scroll", updateArrowState);
    return () => el.removeEventListener("scroll", updateArrowState);
  }, [recommendedProducts, updateArrowState]);

  if (!recommendedLoading && recommendedProducts.length === 0) return null;

  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="h-5 w-5 text-brand" />
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            Recommended for you
          </h2>
        </div>

        {/* Slider */}
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Left arrow */}
          {canScrollLeft && (
            <button
              onClick={() => scrollByAmount("left")}
              aria-label="Scroll left"
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-9 h-9 rounded-full bg-background border border-border shadow-md flex items-center justify-center hover:bg-accent transition-colors hidden sm:flex"
            >
              <ChevronLeft className="h-4 w-4 text-foreground" />
            </button>
          )}

          {/* Right arrow */}
          {canScrollRight && (
            <button
              onClick={() => scrollByAmount("right")}
              aria-label="Scroll right"
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-9 h-9 rounded-full bg-background border border-border shadow-md flex items-center justify-center hover:bg-accent transition-colors hidden sm:flex"
            >
              <ChevronRight className="h-4 w-4 text-foreground" />
            </button>
          )}

          {/* Track */}
          <div
            ref={trackRef}
            className="flex gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {recommendedLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="shrink-0 w-[230px] sm:w-[250px]">
                    <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
                    <Skeleton className="h-4 w-3/4 mt-3" />
                    <Skeleton className="h-3 w-1/2 mt-2" />
                  </div>
                ))
              : recommendedProducts.map((product) => (
                  <div key={product.id} className="shrink-0 w-[230px] sm:w-[250px]">
                    <ProductCard product={product} />
                  </div>
                ))}
          </div>
        </div>
      </div>
    </section>
  );
}