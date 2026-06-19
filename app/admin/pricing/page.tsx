"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import { useProductStore, Product, PricingPlan } from "@/store/productStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import api from "@/lib/axios";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

type PlanForm = {
  planName: string;
  price: string;
  originalPrice: string;
  period: string;
  features: string; // newline-separated
};

const emptyForm = (): PlanForm => ({
  planName: "",
  price: "",
  originalPrice: "",
  period: "",
  features: "",
});

// ─── Save badge (SAVE 70%) ────────────────────────────────────────────────────

function SaveBadge({ original, current }: { original?: number | null; current: number }) {
  if (!original || original <= current) return null;
  const pct = Math.round(((original - current) / original) * 100);
  return (
    <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-brand text-white">
      SAVE {pct}%
    </span>
  );
}

// ─── Plan Card ────────────────────────────────────────────────────────────────

function PlanCard({
  plan,
  onEdit,
  onDelete,
}: {
  plan: PricingPlan;
  onEdit: (plan: PricingPlan) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background px-5 py-4 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center flex-wrap gap-1">
          <span className="font-semibold text-foreground text-sm">{plan.planName}</span>
          <SaveBadge original={plan.originalPrice} current={plan.price} />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onEdit(plan)}
            className="text-muted-foreground hover:text-foreground transition-colors"
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => plan.id && onDelete(plan.id)}
            className="text-muted-foreground hover:text-destructive transition-colors"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Price row */}
      <div className="flex items-baseline gap-2">
        {plan.originalPrice && plan.originalPrice > plan.price && (
          <span className="text-sm text-muted-foreground line-through">
            ₹{Number(plan.originalPrice).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </span>
        )}
        <span className="text-xl font-bold text-foreground">
          ₹{Number(plan.price).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
        </span>
        <span className="text-xs text-muted-foreground">/{plan.period}</span>
      </div>

      {/* Features */}
      {plan.features && plan.features.length > 0 && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1">
          {plan.features.map((f, i) => (
            <span key={i} className="flex items-center gap-1 text-xs text-muted-foreground">
              <Check className="h-3 w-3 text-brand shrink-0" />
              {f}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Plan Form (inline edit / add) ───────────────────────────────────────────

function PlanFormPanel({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial: PlanForm;
  onSave: (form: PlanForm) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<PlanForm>(initial);
  const set = (k: keyof PlanForm, v: string) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="rounded-2xl border border-brand/40 bg-background px-5 py-4 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-foreground">
          {initial.planName ? "Edit Plan" : "Add Plan"}
        </p>
        <button onClick={onCancel} className="text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Plan Name</label>
          <Input
            placeholder="Monthly Plan"
            value={form.planName}
            onChange={(e) => set("planName", e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Price (₹)</label>
          <Input
            type="number"
            placeholder="999"
            value={form.price}
            onChange={(e) => set("price", e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Original Price (₹)</label>
          <Input
            type="number"
            placeholder="Leave empty for no strikethrough"
            value={form.originalPrice}
            onChange={(e) => set("originalPrice", e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Period</label>
          <Input
            placeholder="monthly / yearly / lifetime"
            value={form.period}
            onChange={(e) => set("period", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">Features (one per line)</label>
        <textarea
          rows={4}
          placeholder={"Full access\nUpdates included\nPriority support"}
          value={form.features}
          onChange={(e) => set("features", e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/30 resize-none"
        />
      </div>

      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
        <Button
          className="flex-1 bg-brand hover:bg-brand-hover text-white"
          onClick={() => onSave(form)}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Plan"}
        </Button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PricingManagementPage() {
  const { products, loading, total, fetchProducts } = useProductStore();

  const [selected, setSelected]         = useState<Product | null>(null);
  const [plans, setPlans]               = useState<PricingPlan[]>([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [editingPlan, setEditingPlan]   = useState<PricingPlan | null>(null);
  const [addingPlan, setAddingPlan]     = useState(false);
  const [saving, setSaving]             = useState(false);
  const [page, setPage]                 = useState(1);

  const totalPages = Math.ceil(total / 10);

  // Initial product list load
  useEffect(() => {
    fetchProducts(1);
  }, []);

  // Load pricing plans when a product is selected
  useEffect(() => {
    if (!selected) return;
    setPlansLoading(true);
    setEditingPlan(null);
    setAddingPlan(false);
    api.get(`/products/${selected.slug}`)
      .then((res) => {
        const data = res.data.data ?? res.data;
        setPlans(data.pricingPlans ?? []);
      })
      .catch(() => toast.error("Failed to load plans"))
      .finally(() => setPlansLoading(false));
  }, [selected]);

  const handlePageChange = (p: number) => {
    setPage(p);
    fetchProducts(p);
  };

  // ── Save (add or edit) ──
  const handleSave = async (form: PlanForm) => {
    if (!selected) return;
    if (!form.planName || !form.price || !form.period) {
      toast.error("Plan name, price and period are required");
      return;
    }

    const payload = {
      plan_name:      form.planName,
      price:          Number(form.price),
      original_price: form.originalPrice ? Number(form.originalPrice) : null,
      period:         form.period,
      features:       form.features
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean),
    };

    setSaving(true);
    try {
      if (editingPlan?.id) {
        // Update existing plan
        const res = await api.put(`/products/${selected.slug}/pricing-plans/${editingPlan.id}`, payload);
        const updated = res.data.data ?? res.data;
        setPlans((prev) => prev.map((p) => p.id === editingPlan.id ? updated : p));
        toast.success("Plan updated");
      } else {
        // Create new plan
        const res = await api.post(`/products/${selected.slug}/pricing-plans`, payload);
        const created = res.data.data ?? res.data;
        setPlans((prev) => [...prev, created]);
        toast.success("Plan added");
      }
      setEditingPlan(null);
      setAddingPlan(false);
    } catch {
      toast.error("Failed to save plan");
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ──
  const handleDelete = async (planId: string) => {
    if (!selected) return;
    if (!confirm("Delete this pricing plan?")) return;
    try {
      await api.delete(`/products/${selected.slug}/pricing-plans/${planId}`);
      setPlans((prev) => prev.filter((p) => p.id !== planId));
      toast.success("Plan deleted");
    } catch {
      toast.error("Failed to delete plan");
    }
  };

  // ── Open edit form ──
  const openEdit = (plan: PricingPlan) => {
    setAddingPlan(false);
    setEditingPlan(plan);
  };

  const formFromPlan = (plan: PricingPlan): PlanForm => ({
    planName:      plan.planName,
    price:         String(plan.price),
    originalPrice: plan.originalPrice ? String(plan.originalPrice) : "",
    period:        plan.period,
    features:      plan.features?.join("\n") ?? "",
  });

  return (
    <div className="p-6 space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Pricing Management</h1>
          <p className="text-sm text-muted-foreground">Manage product pricing and plans</p>
        </div>
        <Button
          className="bg-brand hover:bg-brand-hover text-white gap-2"
          disabled={!selected}
          onClick={() => { setEditingPlan(null); setAddingPlan(true); }}
        >
          <Plus className="h-4 w-4" /> Add Plan
        </Button>
      </div>

      <div className="flex gap-5 items-start">

        {/* ── Left: product list ── */}
        <div className="w-64 shrink-0 rounded-2xl border border-border bg-background overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Select Product
            </p>
          </div>

          <div className="divide-y divide-border">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="px-4 py-3">
                  <div className="h-4 bg-muted animate-pulse rounded mb-1" />
                  <div className="h-3 bg-muted animate-pulse rounded w-1/2" />
                </div>
              ))
            ) : products.map((product) => (
              <button
                key={product.id}
                onClick={() => setSelected(product)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors",
                  selected?.id === product.id
                    ? "bg-brand/10 border-l-2 border-brand"
                    : "hover:bg-muted/40 border-l-2 border-transparent"
                )}
              >
                {/* Thumbnail placeholder */}
                <div className="w-10 h-10 rounded-lg bg-muted shrink-0 overflow-hidden flex items-center justify-center text-muted-foreground text-xs font-bold">
                  {product.media?.[0]?.url
                    ? <img src={product.media[0].url} alt={product.title} className="w-full h-full object-cover" />
                    : product.title.charAt(0).toUpperCase()
                  }
                </div>
                <div className="min-w-0">
                  <p className={cn(
                    "text-sm font-medium truncate",
                    selected?.id === product.id ? "text-brand" : "text-foreground"
                  )}>
                    {product.title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {product.category?.name ?? "—"}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-4 py-3 border-t border-border flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Showing 1–{Math.min(10, products.length)} of {total}
              </p>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="sm"
                  disabled={page === 1}
                  onClick={() => handlePageChange(page - 1)}
                  className="h-6 px-2 text-xs"
                >
                  Prev
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Button key={p} size="sm"
                    variant={p === page ? "default" : "outline"}
                    className={cn("h-6 w-6 p-0 text-xs", p === page && "bg-brand text-white")}
                    onClick={() => handlePageChange(p)}
                  >
                    {p}
                  </Button>
                ))}
                <Button variant="outline" size="sm"
                  disabled={page === totalPages}
                  onClick={() => handlePageChange(page + 1)}
                  className="h-6 px-2 text-xs"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* ── Right: pricing plans ── */}
        <div className="flex-1 min-w-0">
          {!selected ? (
            <div className="rounded-2xl border border-border bg-background flex items-center justify-center h-64 text-muted-foreground text-sm">
              Select a product to manage its pricing plans
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-background p-5 space-y-4">

              {/* Product header */}
              <div className="flex items-center gap-3 pb-2 border-b border-border">
                <div className="w-12 h-12 rounded-xl bg-muted shrink-0 overflow-hidden flex items-center justify-center text-muted-foreground font-bold">
                  {selected.media?.[0]?.url
                    ? <img src={selected.media[0].url} alt={selected.title} className="w-full h-full object-cover" />
                    : selected.title.charAt(0).toUpperCase()
                  }
                </div>
                <div>
                  <p className="font-semibold text-foreground">{selected.title}</p>
                  <p className="text-xs text-muted-foreground">{selected.category?.name ?? "—"}</p>
                </div>
              </div>

              {/* Edit form (inline, above plans) */}
              {editingPlan && (
                <PlanFormPanel
                  initial={formFromPlan(editingPlan)}
                  onSave={handleSave}
                  onCancel={() => setEditingPlan(null)}
                  saving={saving}
                />
              )}

              {/* Add form */}
              {addingPlan && !editingPlan && (
                <PlanFormPanel
                  initial={emptyForm()}
                  onSave={handleSave}
                  onCancel={() => setAddingPlan(false)}
                  saving={saving}
                />
              )}

              {/* Plans list */}
              {plansLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-20 bg-muted animate-pulse rounded-2xl" />
                ))
              ) : plans.length === 0 && !addingPlan ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-3">
                  <p className="text-sm">No pricing plans yet</p>
                  <Button
                    size="sm"
                    className="bg-brand hover:bg-brand-hover text-white gap-1"
                    onClick={() => setAddingPlan(true)}
                  >
                    <Plus className="h-3.5 w-3.5" /> Add First Plan
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {plans.map((plan) => (
                    <PlanCard
                      key={plan.id}
                      plan={plan}
                      onEdit={openEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}