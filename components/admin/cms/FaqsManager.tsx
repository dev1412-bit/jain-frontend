"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X, HelpCircle, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCmsStore, type Faq } from "@/store/cmsStore";
import { cn } from "@/lib/utils";

const CATEGORIES = ["general", "billing", "licenses", "technical", "products", "account"];

const empty = (): Partial<Faq> => ({
  question: "", answer: "", category: "general", isActive: true,
});

export default function FaqsManager() {
  const { faqs, createFaq, updateFaq, deleteFaq } = useCmsStore();
  const [open, setOpen]         = useState(true);
  const [editId, setEditId]     = useState<string | null>(null);
  const [form, setForm]         = useState<Partial<Faq>>(empty());
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving]     = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const openAdd  = () => { setForm(empty()); setEditId(null); setShowForm(true); };
  const openEdit = (f: Faq) => { setForm({ ...f }); setEditId(f.id); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditId(null); setForm(empty()); };

  const handleSave = async () => {
    if (!form.question || !form.answer) return;
    setSaving(true);
    try {
      if (editId) await updateFaq(editId, form);
      else        await createFaq(form);
      closeForm();
    } finally { setSaving(false); }
  };

  return (
    <div className="bg-background border border-border rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center">
            <HelpCircle className="h-4 w-4 text-blue-500" />
          </div>
          <h2 className="font-semibold text-foreground text-sm">FAQ Section</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={openAdd} size="sm" className="gap-1.5 bg-brand hover:bg-brand-hover text-white h-8 px-3 text-xs rounded-lg">
            <Plus className="h-3.5 w-3.5" /> Add FAQ
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
                <p className="text-xs font-semibold text-foreground">{editId ? "Edit FAQ" : "New FAQ"}</p>
                <button onClick={closeForm}><X className="h-4 w-4 text-muted-foreground" /></button>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide">Question</Label>
                <Input
                  value={form.question ?? ""}
                  onChange={(e) => setForm({ ...form, question: e.target.value })}
                  placeholder="What is included in the software?"
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide">Answer</Label>
                <textarea
                  rows={4}
                  value={form.answer ?? ""}
                  onChange={(e) => setForm({ ...form, answer: e.target.value })}
                  placeholder="Write the answer..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-brand/30"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide">Category</Label>
                <select
                  value={form.category ?? "general"}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full h-9 px-3 text-sm rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-brand/30 capitalize"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c} className="capitalize">{c}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Button onClick={handleSave} disabled={saving} size="sm" className="bg-brand hover:bg-brand-hover text-white h-8 px-4 text-xs rounded-lg">
                  {saving ? "Saving..." : editId ? "Update" : "Add FAQ"}
                </Button>
                <Button onClick={closeForm} variant="outline" size="sm" className="h-8 px-4 text-xs rounded-lg">Cancel</Button>
              </div>
            </div>
          )}

          {/* FAQ list as accordion */}
          {faqs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No FAQs yet.</p>
          ) : (
            <div className="space-y-2">
              {faqs.map((faq) => (
                <div key={faq.id} className="border border-border rounded-xl overflow-hidden">
                  <div className="flex items-center gap-3 px-4 py-3">
                    <button
                      onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                      className="flex-1 text-left flex items-center justify-between gap-2"
                    >
                      <span className="text-sm font-medium text-foreground line-clamp-1">{faq.question}</span>
                      <ChevronDown className={cn("h-4 w-4 text-muted-foreground shrink-0 transition-transform", expandedId === faq.id && "rotate-180")} />
                    </button>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground capitalize shrink-0">
                      {faq.category}
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => openEdit(faq)} className="w-7 h-7 rounded-md hover:bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => { if (confirm("Delete this FAQ?")) deleteFaq(faq.id); }} className="w-7 h-7 rounded-md hover:bg-destructive/10 flex items-center justify-center text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  {expandedId === faq.id && (
                    <div className="px-4 pb-3 pt-1 border-t border-border bg-muted/10">
                      <p className="text-xs text-muted-foreground leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}