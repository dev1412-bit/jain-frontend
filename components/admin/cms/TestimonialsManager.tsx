"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X, Star, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCmsStore, type Testimonial } from "@/store/cmsStore";
import { cn } from "@/lib/utils";

const COLORS = ["bg-pink-500", "bg-purple-500", "bg-teal-500", "bg-amber-500", "bg-blue-500"];

const empty = (): Partial<Testimonial> => ({
  name: "", role: "", review: "", rating: 5, avatarColor: "bg-pink-500", isActive: true,
});

export default function TestimonialsManager() {
  const { testimonials, createTestimonial, updateTestimonial, deleteTestimonial } = useCmsStore();
  const [open, setOpen]         = useState(true);
  const [editId, setEditId]     = useState<string | null>(null);
  const [form, setForm]         = useState<Partial<Testimonial>>(empty());
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving]     = useState(false);

  const openAdd  = () => { setForm(empty()); setEditId(null); setShowForm(true); };
  const openEdit = (t: Testimonial) => { setForm({ ...t }); setEditId(t.id); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditId(null); setForm(empty()); };

  const handleSave = async () => {
    if (!form.name || !form.role || !form.review) return;
    setSaving(true);
    try {
      if (editId) await updateTestimonial(editId, form);
      else        await createTestimonial(form);
      closeForm();
    } finally { setSaving(false); }
  };

  return (
    <div className="bg-background border border-border rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-yellow-100 dark:bg-yellow-500/10 flex items-center justify-center">
            <Star className="h-4 w-4 text-yellow-500" />
          </div>
          <h2 className="font-semibold text-foreground text-sm">Testimonials</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={openAdd} size="sm" className="gap-1.5 bg-brand hover:bg-brand-hover text-white h-8 px-3 text-xs rounded-lg">
            <Plus className="h-3.5 w-3.5" /> Add Review
          </Button>
          <button onClick={() => setOpen(!open)} className="w-7 h-7 rounded-md hover:bg-accent flex items-center justify-center">
            {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="p-5 space-y-4">
          {/* Form */}
          {showForm && (
            <div className="border border-border rounded-xl p-4 bg-muted/20 space-y-3">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-semibold text-foreground">{editId ? "Edit Review" : "New Review"}</p>
                <button onClick={closeForm}><X className="h-4 w-4 text-muted-foreground" /></button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wide">Name</Label>
                  <Input value={form.name ?? ""} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Rajesh Kumar" className="h-9 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wide">Role</Label>
                  <Input value={form.role ?? ""} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="CTO at TechVentures" className="h-9 text-sm" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide">Review</Label>
                <textarea
                  rows={3}
                  value={form.review ?? ""}
                  onChange={(e) => setForm({ ...form, review: e.target.value })}
                  placeholder="Write the review text..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-brand/30"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {/* Rating */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wide">Rating (1-5)</Label>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map((n) => (
                      <button key={n} type="button" onClick={() => setForm({ ...form, rating: n })}>
                        <Star className={cn("h-5 w-5 transition-colors", n <= (form.rating ?? 5) ? "fill-brand text-brand" : "text-border")} />
                      </button>
                    ))}
                  </div>
                </div>
                {/* Color */}
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wide">Avatar Color</Label>
                  <div className="flex gap-1.5">
                    {COLORS.map((c) => (
                      <button key={c} type="button" onClick={() => setForm({ ...form, avatarColor: c })}
                        className={cn("w-6 h-6 rounded-full transition-transform", c, form.avatarColor === c && "ring-2 ring-offset-1 ring-foreground scale-110")}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Button onClick={handleSave} disabled={saving} size="sm" className="bg-brand hover:bg-brand-hover text-white h-8 px-4 text-xs rounded-lg">
                  {saving ? "Saving..." : editId ? "Update" : "Add Review"}
                </Button>
                <Button onClick={closeForm} variant="outline" size="sm" className="h-8 px-4 text-xs rounded-lg">Cancel</Button>
              </div>
            </div>
          )}

          {/* List */}
          {testimonials.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No testimonials yet.</p>
          ) : (
            <div className="space-y-3">
              {testimonials.map((t) => (
                <div key={t.id} className="flex items-start gap-3 p-3 border border-border rounded-xl hover:bg-muted/20 transition-colors">
                  <div className={cn("w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5", t.avatarColor)}>
                    {t.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-foreground">{t.name}</p>
                      <span className="text-xs text-muted-foreground">{t.role}</span>
                    </div>
                    {/* Stars */}
                    <div className="flex gap-0.5 my-0.5">
                      {[1,2,3,4,5].map((n) => (
                        <Star key={n} className={cn("h-3 w-3", n <= t.rating ? "fill-brand text-brand" : "text-border")} />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{t.review}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => openEdit(t)} className="w-7 h-7 rounded-md hover:bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => { if (confirm(`Delete?`)) deleteTestimonial(t.id); }} className="w-7 h-7 rounded-md hover:bg-destructive/10 flex items-center justify-center text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}