"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Heart,
  Loader2,
  PackageSearch,
  Search,
  ShoppingCart,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import type { Product, PricingPlan } from "@/store/productStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { cn } from "@/lib/utils";

type SortOption = "default" | "price-asc" | "price-desc" | "newest";

function toNumber(value: number | string | null | undefined) {
  if (value === null || value === undefined) {
    return 0;
  }

  return Number(value);
}

function formatCurrency(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

function getPrimaryPlan(product: Product): PricingPlan | null {
  if (!product.pricingPlans?.length) {
    return null;
  }

  return product.pricingPlans.reduce((lowest, plan) =>
    toNumber(plan.price) < toNumber(lowest.price) ? plan : lowest
  );
}

function categorySlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-");
}

export default function WishlistPage() {
  const { items, loading, fetchWishlist, toggleWishlist } = useWishlistStore();
  const addItem = useCartStore((state) => state.addItem);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const categories = useMemo(() => {
    const unique = new Map<string, string>();

    items.forEach((product) => {
      if (product.category?.name) {
        unique.set(categorySlug(product.category.name), product.category.name);
      }
    });

    return Array.from(unique, ([slug, name]) => ({ slug, name }));
  }, [items]);

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    let result = [...items];

    if (selectedCategory !== "all") {
      result = result.filter((product) =>
        product.category?.name ? categorySlug(product.category.name) === selectedCategory : false
      );
    }

    if (query) {
      result = result.filter((product) =>
        [product.title, product.description, product.category?.name]
          .filter(Boolean)
          .some((value) => value?.toLowerCase().includes(query))
      );
    }

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => getDisplayPrice(a) - getDisplayPrice(b));
        break;
      case "price-desc":
        result.sort((a, b) => getDisplayPrice(b) - getDisplayPrice(a));
        break;
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
        );
        break;
      default:
        break;
    }

    return result;
  }, [items, searchQuery, selectedCategory, sortBy]);

  const addToCart = (product: Product) => {
    const plan = getPrimaryPlan(product);
    const price = getDisplayPrice(product);

    addItem({
      id: product.id,
      name: product.title,
      price,
      image: product.media?.[0]?.url ?? "",
      slug: product.slug,
    });

    return plan;
  };

  return (
    <div className="space-y-5">
      <div className="bg-background border border-border rounded-2xl px-6 py-5">
        <h1 className="text-xl font-bold text-foreground">Wishlist</h1>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search your wishlist..."
              className="h-10 w-full rounded-xl border border-input bg-background pl-10 pr-3 text-sm outline-none transition focus:border-brand focus:ring-3 focus:ring-brand/15"
            />
          </div>

          <SelectControl
            icon={ChevronDown}
            value={sortBy}
            onChange={(value) => setSortBy(value as SortOption)}
            options={[
              { label: "Sort", value: "default" },
              { label: "Price: Low to High", value: "price-asc" },
              { label: "Price: High to Low", value: "price-desc" },
              { label: "Newest", value: "newest" },
            ]}
          />

          <SelectControl
            icon={SlidersHorizontal}
            value={selectedCategory}
            onChange={setSelectedCategory}
            options={[
              { label: "Filter", value: "all" },
              ...categories.map((category) => ({
                label: category.name,
                value: category.slug,
              })),
            ]}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <FilterChip
            active={selectedCategory === "all"}
            label="All Products"
            onClick={() => setSelectedCategory("all")}
          />
          {categories.map((category) => (
            <FilterChip
              key={category.slug}
              active={selectedCategory === category.slug}
              label={category.name}
              onClick={() => setSelectedCategory(category.slug)}
            />
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="h-80 animate-pulse rounded-2xl border border-border bg-background" />
          ))}
        </div>
      ) : filteredItems.length ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {filteredItems.map((product) => (
            <WishlistCard
              key={product.id}
              product={product}
              onAddToCart={() => addToCart(product)}
              onRemove={() => toggleWishlist(product.id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-border bg-background p-8 text-center">
          {loading ? (
            <Loader2 className="mb-3 h-8 w-8 animate-spin text-brand" />
          ) : (
            <PackageSearch className="mb-3 h-10 w-10 text-muted-foreground/40" />
          )}
          <h2 className="text-base font-semibold text-foreground">
            {items.length ? "No matching products" : "Your wishlist is empty"}
          </h2>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            {items.length
              ? "Try adjusting your search or filter."
              : "Save products from the store and they will appear here."}
          </p>
          {!items.length && (
            <Button asChild className="mt-4 rounded-full bg-brand px-5 text-white hover:bg-brand-hover">
              <Link href="/store">Browse Store</Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

function WishlistCard({
  product,
  onAddToCart,
  onRemove,
}: {
  product: Product;
  onAddToCart: () => void;
  onRemove: () => void;
}) {
  const plan = getPrimaryPlan(product);
  const price = getDisplayPrice(product);
  const originalPrice = toNumber(plan?.originalPrice);
  const savings = originalPrice > price ? originalPrice - price : 0;
  const image = product.media?.[0]?.url;
  const period = plan?.period ? `/${plan.period}` : product.pricingPlans?.length ? "/yr" : "";

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-border bg-background transition hover:border-brand/20 hover:shadow-lg">
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${product.title} from wishlist`}
        className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white text-rose-500 shadow-sm transition hover:scale-105"
      >
        <Heart className="h-4 w-4 fill-current" />
      </button>

      <Link
        href={`/store/${product.slug}`}
        className="block aspect-[4/3] bg-muted bg-cover bg-center"
        style={image ? { backgroundImage: `url(${image})` } : undefined}
      >
        {!image && (
          <div className="flex h-full w-full items-center justify-center bg-brand/5">
            <span className="text-5xl font-bold text-brand/25">{product.title.charAt(0)}</span>
          </div>
        )}
      </Link>

      <div className="space-y-3 p-4">
        <div>
          <Link href={`/store/${product.slug}`}>
            <h2 className="line-clamp-1 text-sm font-bold text-foreground transition hover:text-brand">
              {product.title}
            </h2>
          </Link>
          <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
            {product.description || product.category?.name || "Software product"}
          </p>
        </div>

        <div className="space-y-1">
          <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-1">
            <span className="text-xs font-semibold text-muted-foreground">From</span>
            <span className="text-sm font-bold text-foreground">{formatCurrency(price)}</span>
            <span className="text-xs text-muted-foreground">{period}</span>
          </div>
          {originalPrice > price && (
            <p className="text-xs text-muted-foreground line-through">
              {formatCurrency(originalPrice)}
            </p>
          )}
          {savings > 0 && (
            <span className="inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-700">
              Save {formatCurrency(savings)}
            </span>
          )}
        </div>

        <div className="flex gap-2 pt-1">
          <Button asChild variant="outline" size="sm" className="h-9 flex-1 rounded-full text-xs">
            <Link href={`/store/${product.slug}`}>Learn More</Link>
          </Button>
          <Button
            size="sm"
            onClick={onAddToCart}
            className="h-9 flex-1 rounded-full bg-brand text-xs text-white hover:bg-brand-hover"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            Add to Cart
          </Button>
        </div>
      </div>
    </article>
  );
}

function getDisplayPrice(product: Product) {
  return toNumber(getPrimaryPlan(product)?.price ?? product.basePrice);
}

function FilterChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-8 rounded-full border px-3 text-xs font-medium transition",
        active
          ? "border-brand bg-brand/10 text-brand"
          : "border-border bg-background text-muted-foreground hover:border-brand/30 hover:text-foreground"
      )}
    >
      {label}
    </button>
  );
}

function SelectControl({
  icon: Icon,
  value,
  options,
  onChange,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  options: Array<{ label: string; value: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative min-w-32">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full appearance-none rounded-xl border border-input bg-background pl-3 pr-9 text-sm text-muted-foreground outline-none transition focus:border-brand focus:ring-3 focus:ring-brand/15"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <Icon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  );
}
