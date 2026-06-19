"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Copy, Pencil, Trash2, Plus, Search, ChevronDown } from "lucide-react";
import { useProductStore } from "@/store/productStore";
import { useCategoryStore } from "@/store/categoryStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function ProductsPage() {
  const router = useRouter();
  const { products, loading, total, currentPage, fetchProducts, deleteProduct } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();

  const [search, setSearch]         = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter]     = useState("");
  const [selected, setSelected]     = useState<string[]>([]);

useEffect(() => {
  if (products.length === 0 && total === 0) {
    fetchProducts(1);
  }
  fetchCategories();
}, []);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => fetchProducts(1, search, categoryFilter, statusFilter), 400);
    return () => clearTimeout(t);
  }, [search, categoryFilter, statusFilter]);

  const totalPages = Math.ceil(total / 10);

  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    setSelected(selected.length === products.length ? [] : products.map((p) => p.id));
  };

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("Product ID copied!");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await deleteProduct(id);
  };

  return (
    <div className="p-6 space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Products</h1>
          <p className="text-sm text-muted-foreground">{total} total products</p>
        </div>
        <Button
          onClick={() => router.push("/admin/products/add")}
          className="bg-brand hover:bg-brand-hover text-white gap-2"
        >
          <Plus className="h-4 w-4" /> Add Product
        </Button>
      </div>

      {/* Filters Row */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-9 h-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-10 pl-3 pr-8 text-sm rounded-md border border-input bg-background text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-brand/30"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>

        {/* Sort */}
        <div className="relative">
          <select
            className="h-10 pl-3 pr-8 text-sm rounded-md border border-input bg-background text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-brand/30"
          >
            <option>Sort</option>
            <option>Newest</option>
            <option>Oldest</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 pl-3 pr-8 text-sm rounded-md border border-input bg-background text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-brand/30"
          >
            <option value="">Filter</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border bg-background overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground text-xs uppercase">
              <th className="px-4 py-3 w-10">
                <input
                  type="checkbox"
                  checked={selected.length === products.length && products.length > 0}
                  onChange={toggleAll}
                  className="rounded border-border"
                />
              </th>
              <th className="px-4 py-3 text-left">Product</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Amount</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Updated</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && products.length === 0 ? (
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="border-b border-border">
                  <td colSpan={7} className="px-4 py-3">
                    <div className="h-4 bg-muted animate-pulse rounded" />
                  </td>
                </tr>
              ))
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-muted-foreground">
                  No products found
                </td>
              </tr>
            ) : products.map((product) => (
              <tr key={product.id}
                className="border-b border-border hover:bg-muted/30 transition-colors">

                {/* Checkbox */}
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.includes(product.id)}
                    onChange={() => toggleSelect(product.id)}
                    className="rounded border-border"
                  />
                </td>

                {/* Product */}
                <td className="px-4 py-3">
                  <p className="font-semibold text-foreground">{product.title}</p>
                  <p className="text-xs text-muted-foreground">{product.slug}</p>
                </td>

                {/* Category */}
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-600">
                    {product.category?.name ?? "—"}
                  </span>
                </td>

                {/* Amount */}
                <td className="px-4 py-3 font-medium text-foreground">
                  ₹{Number(product.basePrice).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-medium",
                    product.status === "published" && "bg-green-100 text-green-600",
                    product.status === "draft"     && "bg-yellow-100 text-yellow-600",
                    product.status === "archived"  && "bg-muted text-muted-foreground",
                  )}>
                    {product.status}
                  </span>
                </td>

                {/* Updated */}
                <td className="px-4 py-3 text-muted-foreground text-xs">
                  {product.createdAt ?? "—"}
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => router.push(`/store/${product.slug}`)}
                      className="text-muted-foreground hover:text-foreground"
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleCopy(product.id)}
                      className="text-muted-foreground hover:text-foreground"
                      title="Copy ID"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => router.push(`/admin/products/${product.slug}/edit`)}
                      className="text-muted-foreground hover:text-foreground"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-muted-foreground hover:text-destructive"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Showing 1–{Math.min(10, products.length)} of {total}
          </p>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm"
              disabled={currentPage === 1}
              onClick={() => fetchProducts(currentPage - 1, search, categoryFilter, statusFilter)}
            >
              Prev
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button key={p} size="sm"
                variant={p === currentPage ? "default" : "outline"}
                className={p === currentPage ? "bg-brand text-white" : ""}
                onClick={() => fetchProducts(p, search, categoryFilter, statusFilter)}
              >
                {p}
              </Button>
            ))}
            <Button variant="outline" size="sm"
              disabled={currentPage === totalPages}
              onClick={() => fetchProducts(currentPage + 1, search, categoryFilter, statusFilter)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}