import { create } from "zustand";
import api from "@/lib/axios";
import { toast } from "sonner";

export type MediaFile = {
  id: string;
  uuid: string;
  name: string;
  fileName: string;
  mimeType: string;
  size: number;
  sizeLabel: string;
  url: string;
  path: string;
  collection: string | null;
  type: "image" | "video" | "pdf" | "file";
  uploadedAt: string;
};

export type MediaStats = {
  total: number;
  totalSize: string;
  images: number;
  videos: number;
};

type MediaStore = {
  files: MediaFile[];
  stats: MediaStats | null;
  loading: boolean;
  uploading: boolean;
  total: number;
  currentPage: number;
  fetchMedia: (page?: number, search?: string, type?: string) => Promise<void>;
  fetchStats: () => Promise<void>;
  uploadFile: (file: File, collection?: string) => Promise<MediaFile>;
  renameFile: (id: string, name: string) => Promise<void>;
  deleteFile: (id: string) => Promise<void>;
};

export const useMediaStore = create<MediaStore>((set, get) => ({
  files: [],
  stats: null,
  loading: false,
  uploading: false,
  total: 0,
  currentPage: 1,

  fetchMedia: async (page = 1, search = "", type = "") => {
    set({ loading: true });
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (search) params.append("search", search);
      if (type && type !== "all") params.append("type", type);
      const res = await api.get(`/media?${params}`);
      set({
        files: res.data.data,
        total: res.data.meta?.total ?? res.data.data.length,
        currentPage: page,
        loading: false,
      });
    } catch {
      toast.error("Failed to load media");
      set({ loading: false });
    }
  },

  fetchStats: async () => {
    try {
      const res = await api.get("/media/stats");
      set({ stats: res.data });
    } catch {
    //   console.error("Failed to load media stats");
    }
  },

  uploadFile: async (file, collection) => {
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    if (file.size > maxSize) {
        toast.error(`File too large. Max size is 2MB (your file: ${(file.size / 1024 / 1024).toFixed(1)}MB)`);
        return null as any;
    }
    set({ uploading: true });
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (collection) formData.append("collection", collection);
      const res = await api.post("/media", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const newFile = res.data.data ?? res.data;
      set((s) => ({ files: [newFile, ...s.files], uploading: false }));
      toast.success("File uploaded!");
      return newFile;
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Upload failed");
      set({ uploading: false });
      throw err;
    }
  },

  renameFile: async (id, name) => {
    try {
      const res = await api.put(`/media/${id}`, { name });
      const updated = res.data.data ?? res.data;
      set((s) => ({
        files: s.files.map((f) => (f.id === id ? updated : f)),
      }));
      toast.success("Renamed successfully!");
    } catch {
      toast.error("Failed to rename file");
    }
  },

  deleteFile: async (id) => {
    try {
      await api.delete(`/media/${id}`);
      set((s) => ({ files: s.files.filter((f) => f.id !== id) }));
      toast.success("File deleted");
    } catch {
      toast.error("Failed to delete file");
    }
  },
}));