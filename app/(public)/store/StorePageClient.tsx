"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, ChevronDown, Menu, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import StoreSidebar from "@/components/store/StoreSidebar";
import ProductGrid from "@/components/store/ProductGrid";
import type { Product, StoreCategory } from "@/store/productStore";

const SORT_OPTIONS = [
  { label: "Default", value: "default" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Newest", value: "newest" },
];

const FILTER_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Featured", value: "featured" },
  { label: "On Sale", value: "sale" },
];

type StorePageClientProps = {
  initialProducts: Product[];
  initialCategories: StoreCategory[];
  initialError: string | null;
};

function getCategorySlug(product: Product) {
  return product.category?.name.toLowerCase().replace(/\s+/g, "-");
}

function getFilteredProducts(
  products: Product[],
  searchQuery: string,
  selectedCategory: string,
  sortBy: string
) {
  let result = [...products];

  if (selectedCategory !== "all") {
    result = result.filter(
      (product) =>
        getCategorySlug(product) === selectedCategory ||
        product.category?.name === selectedCategory
    );
  }

  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    result = result.filter(
      (product) =>
        product.title.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query)
    );
  }

  switch (sortBy) {
    case "price-asc":
      result.sort((a, b) => a.basePrice - b.basePrice);
      break;
    case "price-desc":
      result.sort((a, b) => b.basePrice - a.basePrice);
      break;
    case "newest":
      result.sort(
        (a, b) =>
          new Date(b.createdAt ?? 0).getTime() -
          new Date(a.createdAt ?? 0).getTime()
      );
      break;
    default:
      break;
  }

  return result;
}

export default function StorePageClient({
  initialProducts,
  initialCategories,
  initialError,
}: StorePageClientProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [activeSort, setActiveSort] = useState("Default");
  const [activeFilter, setActiveFilter] = useState("All");

  const products = useMemo(
    () =>
      getFilteredProducts(
        initialProducts,
        searchQuery,
        selectedCategory,
        sortBy
      ),
    [initialProducts, searchQuery, selectedCategory, sortBy]
  );

  const total = products.length;

  return (
    <div className="min-h-screen bg-background">

      {/* ── Page Banner ── */}
      <div className="border-b border-border bg-background px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold text-brand">Store</h1>
          <p className="mt-1 text-sm text-muted-foreground">All Products</p>
          <a
            href="/support#specialist"
            className="inline-block mt-1 text-sm text-brand hover:underline font-medium"
          >
            Connect with a Specialist
          </a>
        </div>
      </div>

      {/* ── Search + Sort + Filter Bar ── */}
      <div className="border-b border-border bg-background px-4 sm:px-6 lg:px-8 py-4 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto flex items-center gap-3">

          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your products..."
              className="pl-10 h-10 rounded-full bg-muted/40 border-border focus-visible:ring-brand/30"
            />
          </div>

          {/* Product count — desktop */}
          <span className="hidden sm:block text-sm text-muted-foreground whitespace-nowrap">
            {total} product{total !== 1 ? "s" : ""}
          </span>

          {/* Sort */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-10 gap-1.5 rounded-full px-4 text-sm">
                {activeSort}
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {SORT_OPTIONS.map((opt) => (
                <DropdownMenuItem
                  key={opt.value}
                  onClick={() => { setSortBy(opt.value); setActiveSort(opt.label); }}
                  className={sortBy === opt.value ? "text-brand font-medium" : ""}
                >
                  {opt.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-10 gap-1.5 rounded-full px-4 text-sm">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                {activeFilter}
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {FILTER_OPTIONS.map((opt) => (
                <DropdownMenuItem
                  key={opt.value}
                  onClick={() => setActiveFilter(opt.label)}
                >
                  {opt.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile sidebar toggle */}
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden h-10 w-10 rounded-full"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          >
            {mobileSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <aside
            className={`
              lg:block lg:w-44 shrink-0
              ${mobileSidebarOpen
                ? "block w-full mb-6"
                : "hidden lg:block"
              }
            `}
          >
            <StoreSidebar
              categories={initialCategories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              loading={false}
            />
          </aside>
          <div className="flex-1 min-w-0">
            <ProductGrid
              products={products}
              loading={false}
              error={initialError}
            />
          </div>

        </div>
      </div>
    </div>
  );
}
