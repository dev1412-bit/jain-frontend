"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCmsStore, type TeamMember } from "@/store/cmsStore";
import { cn } from "@/lib/utils";

const COLORS = [
  "bg-pink-500", "bg-purple-500", "bg-teal-500",
  "bg-amber-500", "bg-blue-500", "bg-green-500",
];

const empty = (): Partial<TeamMember> => ({
  name: "", role: "", bio: "", avatarColor: "bg-pink-500", isActive: true,
});

export default function TeamManager() {
  const { team, createTeamMember, updateTeamMember, deleteTeamMember } = useCmsStore();
  const [open, setOpen]         = useState(true);
  const [editId, setEditId]     = useState<string | null>(null);
  const [form, setForm]         = useState<Partial<TeamMember>>(empty());
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving]     = useState(false);

  const openAdd = () => { setForm(empty()); setEditId(null); setShowForm(true); };
  const openEdit = (m: TeamMember) => { setForm({ ...m }); setEditId(m.id); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditId(null); setForm(empty()); };

  const handleSave = async () => {
    if (!form.name || !form.role) return;
    setSaving(true);
    try {
      if (editId) await updateTeamMember(editId, form);
      else        await createTeamMember(form);
      closeForm();
    } finally { setSaving(false); }
  };

  const handleDelete = (m: TeamMember) => {
    if (confirm(`Delete "${m.name}"?`)) deleteTeamMember(m.id);
  };

  return (
    <div className="bg-background border border-border rounded-2xl overflow-hidden">
      {/* Section header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-pink-100 dark:bg-pink-500/10 flex items-center justify-center">
            <span className="text-pink-500 text-sm">👥</span>
          </div>
          <h2 className="font-semibold text-foreground text-sm">Team Section</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={openAdd} size="sm" className="gap-1.5 bg-brand hover:bg-brand-hover text-white h-8 px-3 text-xs rounded-lg">
            <Plus className="h-3.5 w-3.5" /> Add Member
          </Button>
          <button onClick={() => setOpen(!open)} className="w-7 h-7 rounded-md hover:bg-accent flex items-center justify-center">
            {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="p-5 space-y-4">
          {/* Add/Edit form */}
          {showForm && (
            <div className="border border-border rounded-xl p-4 bg-muted/20 space-y-3">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-semibold text-foreground">{editId ? "Edit Member" : "New Member"}</p>
                <button onClick={closeForm}><X className="h-4 w-4 text-muted-foreground" /></button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wide">Name</Label>
                  <Input value={form.name ?? ""} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Doe" className="h-9 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wide">Role</Label>
                  <Input value={form.role ?? ""} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="CEO & Founder" className="h-9 text-sm" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide">Bio</Label>
                <Input value={form.bio ?? ""} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="20+ years in enterprise software" className="h-9 text-sm" />
              </div>
              {/* Avatar color picker */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide">Avatar Color</Label>
                <div className="flex gap-2">
                  {COLORS.map((c) => (
                    <button key={c} type="button" onClick={() => setForm({ ...form, avatarColor: c })}
                      className={cn("w-7 h-7 rounded-full transition-transform", c, form.avatarColor === c && "ring-2 ring-offset-2 ring-foreground scale-110")}
                    />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <Button onClick={handleSave} disabled={saving} size="sm" className="bg-brand hover:bg-brand-hover text-white h-8 px-4 text-xs rounded-lg">
                  {saving ? "Saving..." : editId ? "Update" : "Add Member"}
                </Button>
                <Button onClick={closeForm} variant="outline" size="sm" className="h-8 px-4 text-xs rounded-lg">Cancel</Button>
              </div>
            </div>
          )}

          {/* Members list */}
          {team.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">No team members yet. Click &ldquo;Add Member&rdquo; to add one.</p>
          ) : (
            <div className="space-y-3">
              {team.map((m, i) => (
                <div key={m.id} className="flex items-center gap-3 p-3 border border-border rounded-xl hover:bg-muted/20 transition-colors">
                  <div className={cn("w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0", m.avatarColor)}>
                    {m.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{m.name}</p>
                    <p className="text-xs text-muted-foreground">{m.role}</p>
                    {m.bio && <p className="text-xs text-muted-foreground/70 mt-0.5 truncate">{m.bio}</p>}
                  </div>
                  <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full", m.isActive ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400" : "bg-muted text-muted-foreground")}>
                    {m.isActive ? "Active" : "Hidden"}
                  </span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEdit(m)} className="w-7 h-7 rounded-md hover:bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => handleDelete(m)} className="w-7 h-7 rounded-md hover:bg-destructive/10 flex items-center justify-center text-muted-foreground hover:text-destructive">
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