import { create } from "zustand";
import api from "@/lib/axios";
import { toast } from "sonner";

// ── Types ─────────────────────────────────────────────────────
export type Testimonial = {
  id: string;
  name: string;
  role: string;
  review: string;
  rating: number;
  avatar?: string;
  avatarColor: string;
  order: number;
  isActive: boolean;
};

export type Faq = {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isActive: boolean;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio?: string;
  avatar?: string;
  avatarColor: string;
  order: number;
  isActive: boolean;
};

export type NavItem = {
  id: string;
  label: string;
  href: string;
  order: number;
  isActive: boolean;
  parentId?: string;
};

export type SeoSettings = {
  site_name?: string;
  meta_title?: string;
  meta_description?: string;
  og_image?: string;
  twitter_handle?: string;
  contact_email?: string;
  contact_phone?: string;
};

type CmsStore = {
  testimonials: Testimonial[];
  faqs: Faq[];
  team: TeamMember[];
  navigation: NavItem[];
  seoSettings: SeoSettings;
  loading: boolean;

  // fetch
  fetchAll: () => Promise<void>;
  fetchNavigation: () => Promise<void>;

  // testimonials
  createTestimonial: (data: Partial<Testimonial>) => Promise<void>;
  updateTestimonial: (id: string, data: Partial<Testimonial>) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;
 fetchTestimonials: () => Promise<void>;
  // faqs
  createFaq: (data: Partial<Faq>) => Promise<void>;
  updateFaq: (id: string, data: Partial<Faq>) => Promise<void>;
  deleteFaq: (id: string) => Promise<void>;

  // team
  createTeamMember: (data: Partial<TeamMember>) => Promise<void>;
  updateTeamMember: (id: string, data: Partial<TeamMember>) => Promise<void>;
  deleteTeamMember: (id: string) => Promise<void>;

  // navigation
  createNavItem: (data: Partial<NavItem>) => Promise<void>;
  updateNavItem: (id: string, data: Partial<NavItem>) => Promise<void>;
  deleteNavItem: (id: string) => Promise<void>;

  // seo
  updateSeoSettings: (data: SeoSettings) => Promise<void>;
};

// helper — convert snake_case API response to camelCase
const mapTeam = (m: any): TeamMember => ({
  id: m.id, name: m.name, role: m.role, bio: m.bio,
  avatar: m.avatar, avatarColor: m.avatar_color,
  order: m.order, isActive: m.is_active,
});
const mapTestimonial = (t: any): Testimonial => ({
  id: t.id, name: t.name, role: t.role, review: t.review,
  rating: t.rating, avatar: t.avatar, avatarColor: t.avatar_color,
  order: t.order, isActive: t.is_active,
});
const mapFaq = (f: any): Faq => ({
  id: f.id, question: f.question, answer: f.answer,
  category: f.category, order: f.order, isActive: f.is_active,
});
const mapNav = (n: any): NavItem => ({
  id: n.id, label: n.label, href: n.href,
  order: n.order, isActive: n.is_active, parentId: n.parent_id,
});

export const useCmsStore = create<CmsStore>((set) => ({
  testimonials: [],
  faqs: [],
  team: [],
  navigation: [],
  seoSettings: {},
  loading: false,

  // ── Fetch all (for public pages) ─────────────────────────
  fetchAll: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/cms/public");
      set({
        testimonials: (res.data.testimonials ?? []).map(mapTestimonial),
        faqs:         (res.data.faqs ?? []).map(mapFaq),
        team:         (res.data.team ?? []).map(mapTeam),
        navigation:   (res.data.navigation ?? []).map(mapNav),
        seoSettings:  res.data.seo ?? {},
        loading: false,
      });
    } catch {
      set({ loading: false });
    }
  },

  fetchNavigation: async () => {
    try {
      const res = await api.get("/navigation");
      set({ navigation: (res.data ?? []).map(mapNav) });
    } catch {}
  },

  // ── Testimonials ──────────────────────────────────────────
  createTestimonial: async (data) => {
    try {
      const res = await api.post("/admin/testimonials", {
        ...data, avatar_color: data.avatarColor, is_active: data.isActive,
      });
      set((s) => ({ testimonials: [...s.testimonials, mapTestimonial(res.data)] }));
      toast.success("Testimonial added!");
    } catch { toast.error("Failed to add testimonial"); throw new Error(); }
  },

  updateTestimonial: async (id, data) => {
    try {
      const res = await api.put(`/admin/testimonials/${id}`, {
        ...data, avatar_color: data.avatarColor, is_active: data.isActive,
      });
      set((s) => ({ testimonials: s.testimonials.map((t) => t.id === id ? mapTestimonial(res.data) : t) }));
      toast.success("Testimonial updated!");
    } catch { toast.error("Failed to update"); throw new Error(); }
  },
  fetchTestimonials: async () => {
  try {
    const res = await api.get("/cms/public");
    set({ testimonials: (res.data.testimonials ?? []).map(mapTestimonial) });
  } catch {
  
  }
},

  deleteTestimonial: async (id) => {
    try {
      await api.delete(`/admin/testimonials/${id}`);
      set((s) => ({ testimonials: s.testimonials.filter((t) => t.id !== id) }));
      toast.success("Deleted");
    } catch { toast.error("Failed to delete"); }
  },

  // ── FAQs ──────────────────────────────────────────────────
  createFaq: async (data) => {
    try {
      const res = await api.post("/admin/faqs", { ...data, is_active: data.isActive });
      set((s) => ({ faqs: [...s.faqs, mapFaq(res.data)] }));
      toast.success("FAQ added!");
    } catch { toast.error("Failed to add FAQ"); throw new Error(); }
  },

  updateFaq: async (id, data) => {
    try {
      const res = await api.put(`/admin/faqs/${id}`, { ...data, is_active: data.isActive });
      set((s) => ({ faqs: s.faqs.map((f) => f.id === id ? mapFaq(res.data) : f) }));
      toast.success("FAQ updated!");
    } catch { toast.error("Failed to update"); throw new Error(); }
  },

  deleteFaq: async (id) => {
    try {
      await api.delete(`/admin/faqs/${id}`);
      set((s) => ({ faqs: s.faqs.filter((f) => f.id !== id) }));
      toast.success("Deleted");
    } catch { toast.error("Failed to delete"); }
  },

  // ── Team Members ──────────────────────────────────────────
  createTeamMember: async (data) => {
    try {
      const res = await api.post("/admin/team", {
        ...data, avatar_color: data.avatarColor, is_active: data.isActive,
      });
      set((s) => ({ team: [...s.team, mapTeam(res.data)] }));
      toast.success("Team member added!");
    } catch { toast.error("Failed to add member"); throw new Error(); }
  },

  updateTeamMember: async (id, data) => {
    try {
      const res = await api.put(`/admin/team/${id}`, {
        ...data, avatar_color: data.avatarColor, is_active: data.isActive,
      });
      set((s) => ({ team: s.team.map((m) => m.id === id ? mapTeam(res.data) : m) }));
      toast.success("Team member updated!");
    } catch { toast.error("Failed to update"); throw new Error(); }
  },

  deleteTeamMember: async (id) => {
    try {
      await api.delete(`/admin/team/${id}`);
      set((s) => ({ team: s.team.filter((m) => m.id !== id) }));
      toast.success("Deleted");
    } catch { toast.error("Failed to delete"); }
  },

  // ── Navigation ────────────────────────────────────────────
  createNavItem: async (data) => {
    try {
      const res = await api.post("/admin/navigation", {
        ...data, is_active: data.isActive,
      });
      set((s) => ({ navigation: [...s.navigation, mapNav(res.data)] }));
      toast.success("Nav item added!");
    } catch { toast.error("Failed to add"); throw new Error(); }
  },

  updateNavItem: async (id, data) => {
    try {
      const res = await api.put(`/admin/navigation/${id}`, {
        ...data, is_active: data.isActive,
      });
      set((s) => ({ navigation: s.navigation.map((n) => n.id === id ? mapNav(res.data) : n) }));
      toast.success("Updated!");
    } catch { toast.error("Failed to update"); throw new Error(); }
  },

  deleteNavItem: async (id) => {
    try {
      await api.delete(`/admin/navigation/${id}`);
      set((s) => ({ navigation: s.navigation.filter((n) => n.id !== id) }));
      toast.success("Deleted");
    } catch { toast.error("Failed to delete"); }
  },

  // ── SEO Settings ──────────────────────────────────────────
  updateSeoSettings: async (data) => {
    try {
      const settings = Object.entries(data).map(([key, value]) => ({ key, value }));
      await api.post("/admin/settings", { settings });
      set({ seoSettings: data });
      toast.success("SEO settings saved!");
    } catch { toast.error("Failed to save settings"); throw new Error(); }
  },
}));