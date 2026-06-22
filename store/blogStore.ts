import { create } from "zustand";
import api from "@/lib/axios";
import { toast } from "sonner";

// ── Types ────────────────────────────────────────
export type ContentBlock = {
  type: "heading" | "paragraph" | "image" | "list" | "quote" | "code";
  level?: 2 | 3 | 4;           // for heading
  content?: string;             // for heading, paragraph, quote, code
  url?: string;                 // for image
  alt?: string;                 // for image
  caption?: string;             // for image
  style?: "bullet" | "ordered"; // for list
  items?: string[];             // for list
  language?: string;            // for code
  author?: string;              // for quote
};

export type BlogCategory = {
  id: string;
  name: string;
  slug: string;
};

export type Blog = {
  id: string;
  uuid: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: ContentBlock[];
  coverImage?: string;
  status: "draft" | "published" | "archived" | "scheduled";
  featured: boolean;
  viewsCount: number;
  likesCount: number;
  authorName: string;
  publishedAt?: string;
  scheduledAt?: string;
  tags: string[];
  category?: BlogCategory;
  metaTitle?: string;
  metaDescription?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type BlogPost = Blog;

export type PaginationMeta = {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
};

type BlogStore = {
  // Public state
  posts: Blog[];
  featuredPost: Blog | null;
  currentPost: Blog | null;
  categories: BlogCategory[];
  pagination: PaginationMeta | null;
  loading: boolean;
  error: string | null;

  // Filters
  searchQuery: string;
  selectedCategory: string;

  // Admin state
  adminPosts: Blog[];
  adminLoading: boolean;

  // Public actions
  fetchPosts: (params?: { category?: string; search?: string; featured?: boolean; page?: number }) => Promise<void>;
  fetchPost: (slug: string) => Promise<void>;
  fetchCategories: () => Promise<void>;
  likePost: (id: string) => Promise<void>;
  setSearch: (q: string) => void;
  setCategory: (cat: string) => void;

  // Admin actions
  fetchAdminPosts: (params?: { status?: string; search?: string; page?: number }) => Promise<void>;
  fetchAdminPost: (id: string) => Promise<Blog>;
  createPost: (data: Partial<Blog>) => Promise<void>;
  updatePost: (id: string, data: Partial<Blog>) => Promise<void>;
  deletePost: (id: string) => Promise<void>;
  publishPost: (id: string) => Promise<void>;
  archivePost: (id: string) => Promise<void>;
  toggleFeatured: (id: string) => Promise<void>;
};

export const useBlogStore = create<BlogStore>((set, get) => ({
  posts: [],
  featuredPost: null,
  currentPost: null,
  categories: [],
  pagination: null,
  loading: false,
  error: null,
  searchQuery: "",
  selectedCategory: "All",
  adminPosts: [],
  adminLoading: false,

  // ── Public ─────────────────────────────────
  fetchPosts: async (params = {}) => {
    set({ loading: true, error: null });
    try {
      const res = await api.get("/blogs", { params });
      const data = res.data.data ?? res.data;
      const meta = res.data.meta;

      // separate featured from regular
      const featured = data.find((p: Blog) => p.featured) ?? null;
      const regular = featured 
        ? data.filter((p: Blog) => p.id !== featured.id)
        : data;

      set({
        posts: regular,
        featuredPost: featured,
        pagination: meta ? {
          currentPage: meta.current_page,
          lastPage:    meta.last_page,
          perPage:     meta.per_page,
          total:       meta.total,
        } : null,
        loading: false,
      });
    } catch {
      set({ error: "Failed to load posts", loading: false });
    }
  },

  fetchPost: async (slug) => {
    set({ loading: true, currentPost: null });
    try {
      const res = await api.get(`/blogs/${slug}`);
      set({ currentPost: res.data.data ?? res.data, loading: false });
    } catch {
      set({ error: "Post not found", loading: false });
    }
  },

  fetchCategories: async () => {
    try {
      const res = await api.get("/categories");
      set({ categories: res.data.data ?? res.data });
    } catch {}
  },

  likePost: async (id) => {
    try {
      const res = await api.post(`/blogs/${id}/like`);
      // update likes count in currentPost
      set((s) => ({
        currentPost: s.currentPost?.id === id
          ? { ...s.currentPost, likesCount: res.data.likes_count }
          : s.currentPost,
      }));
    } catch {}
  },

  setSearch:   (q)   => set({ searchQuery: q }),
  setCategory: (cat) => set({ selectedCategory: cat }),

  // ── Admin ───────────────────────────────────
  fetchAdminPosts: async (params = {}) => {
    set({ adminLoading: true });
    try {
      const res = await api.get("/admin/blogs", { params });
      set({ adminPosts: res.data.data ?? res.data, adminLoading: false });
    } catch {
      set({ adminLoading: false });
      toast.error("Failed to load posts");
    }
  },

  fetchAdminPost: async (id) => {
    const res = await api.get(`/admin/blogs/${id}`);
    return res.data.data ?? res.data;
  },

  createPost: async (data) => {
    try {
      const payload = {
      title:            data.title,
      slug:             data.slug,
      excerpt:          data.excerpt,
      content:          data.content,
      cover_image:      data.coverImage,     
      status:           data.status,
      featured:         data.featured,
      author_name:      data.authorName,       
      category_id:      data.category,      
      meta_title:       data.metaTitle,       
      meta_description: data.metaDescription,  
      tags:             data.tags,
    };
      const res = await api.post("/admin/blogs", payload);
      const newPost = res.data.data ?? res.data;
      set((s) => ({ adminPosts: [newPost, ...s.adminPosts] }));
      toast.success("Blog post created!");
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Failed to create post";
      toast.error(msg);
      throw err;
    }
  },

  updatePost: async (id, data) => {
    try {
       const payload = {
      title:            data.title,
      slug:             data.slug,
      excerpt:          data.excerpt,
      content:          data.content,
      cover_image:      data.coverImage,
      status:           data.status,
      featured:         data.featured,
      author_name:      data.authorName,
      category_id:      data.categoryId,
      meta_title:       data.metaTitle,
      meta_description: data.metaDescription,
      tags:             data.tags,
    };
      const res = await api.put(`/admin/blogs/${id}`, payload);
      const updated = res.data.data ?? res.data;
      set((s) => ({
        adminPosts: s.adminPosts.map((p) => p.id === id ? updated : p),
      }));
      toast.success("Post updated!");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update post");
      throw err;
    }
  },

  deletePost: async (id) => {
    try {
      await api.delete(`/admin/blogs/${id}`);
      set((s) => ({ adminPosts: s.adminPosts.filter((p) => p.id !== id) }));
      toast.success("Post deleted");
    } catch {
      toast.error("Failed to delete post");
    }
  },

  publishPost: async (id) => {
    try {
      await api.post(`/admin/blogs/${id}/publish`);
      set((s) => ({
        adminPosts: s.adminPosts.map((p) =>
          p.id === id ? { ...p, status: "published" } : p
        ),
      }));
      toast.success("Post published!");
    } catch {
      toast.error("Failed to publish post");
    }
  },

  archivePost: async (id) => {
    try {
      await api.post(`/admin/blogs/${id}/archive`);
      set((s) => ({
        adminPosts: s.adminPosts.map((p) =>
          p.id === id ? { ...p, status: "archived" } : p
        ),
      }));
      toast.success("Post archived");
    } catch {
      toast.error("Failed to archive post");
    }
  },

  toggleFeatured: async (id) => {
    try {
      const res = await api.post(`/admin/blogs/${id}/feature`);
      set((s) => ({
        adminPosts: s.adminPosts.map((p) =>
          p.id === id ? { ...p, featured: res.data.featured } : p
        ),
      }));
      toast.success(res.data.message);
    } catch {
      toast.error("Failed to update featured status");
    }
  },
}));