"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X, GripVertical, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCmsStore, type NavItem } from "@/store/cmsStore";
import { cn } from "@/lib/utils";

const empty = (): Partial<NavItem> => ({
  label: "", href: "", isActive: true,
});

export default function NavigationManager() {
  const { navigation, createNavItem, updateNavItem, deleteNavItem } = useCmsStore();
  const [editId, setEditId]     = useState<string | null>(null);
  const [form, setForm]         = useState<Partial<NavItem>>(empty());
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving]     = useState(false);

  const openAdd  = () => { setForm(empty()); setEditId(null); setShowForm(true); };
  const openEdit = (n: NavItem) => { setForm({ ...n }); setEditId(n.id); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditId(null); setForm(empty()); };

  const handleSave = async () => {
    if (!form.label || !form.href) return;
    setSaving(true);
    try {
      if (editId) await updateNavItem(editId, form);
      else        await createNavItem(form);
      closeForm();
    } finally { setSaving(false); }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground">Navigation Links</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Manage the navbar links shown to visitors</p>
        </div>
        <Button onClick={openAdd} size="sm" className="gap-1.5 bg-brand hover:bg-brand-hover text-white h-9 px-4 rounded-lg">
          <Plus className="h-4 w-4" /> Add Link
        </Button>
      </div>

      {/* Add/Edit form */}
      {showForm && (
        <div className="border border-border rounded-2xl p-5 bg-muted/20 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">{editId ? "Edit Link" : "New Navigation Link"}</p>
            <button onClick={closeForm}><X className="h-4 w-4 text-muted-foreground" /></button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">Label</Label>
              <Input value={form.label ?? ""} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="Home" className="h-10 text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground uppercase tracking-wide">URL / Path</Label>
              <Input value={form.href ?? ""} onChange={(e) => setForm({ ...form, href: e.target.value })} placeholder="/store" className="h-10 text-sm font-mono" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
              <input
                type="checkbox"
                checked={form.isActive ?? true}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="accent-brand w-4 h-4"
              />
              Active (visible in navbar)
            </label>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleSave} disabled={saving} size="sm" className="bg-brand hover:bg-brand-hover text-white h-9 px-5 rounded-lg">
              {saving ? "Saving..." : editId ? "Update Link" : "Add Link"}
            </Button>
            <Button onClick={closeForm} variant="outline" size="sm" className="h-9 px-5 rounded-lg">Cancel</Button>
          </div>
        </div>
      )}

      {/* Nav items table */}
      <div className="bg-background border border-border rounded-2xl overflow-hidden">
        {navigation.length === 0 ? (
          <div className="py-12 text-center">
            <Navigation className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No navigation links yet.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide w-8"></th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Label</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">URL</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody>
              {navigation.map((item) => (
                <tr key={item.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-3">
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                  </td>
                  <td className="px-4 py-3 font-medium text-foreground">{item.label}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{item.href}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => updateNavItem(item.id, { isActive: !item.isActive })}
                      className={cn(
                        "px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors",
                        item.isActive
                          ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400 hover:bg-green-200"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      )}
                    >
                      {item.isActive ? "Active" : "Hidden"}
                    </button>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(item)} className="w-7 h-7 rounded-md hover:bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => { if (confirm(`Delete "${item.label}"?`)) deleteNavItem(item.id); }}
                        className="w-7 h-7 rounded-md hover:bg-destructive/10 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Info note */}
      <div className="flex items-start gap-2 p-3 rounded-xl bg-brand/5 border border-brand/20">
        <span className="text-brand text-xs mt-0.5">ℹ</span>
        <p className="text-xs text-muted-foreground">
          Changes to navigation are reflected on the public site immediately after saving.
          Make sure all URLs are correct before activating a link.
        </p>
      </div>
    </div>
  );
}