import { create } from "zustand";
import api from "@/lib/axios";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";

export type TicketLog = {
  id: string;
  from: string;
  to: string;
  note?: string;
  createdAt: string;
};

export type SupportTicket = {
  id: string;
  uuid: string;
  ticketId: string;
  name: string;
  email: string;
  category: string;
  priority: "low" | "medium" | "high" | "urgent";
  subject: string;
  message: string;
  attachment?: string | null;
  status: "open" | "pending" | "resolved" | "closed";
  logs?: TicketLog[];
  createdAt: string;
};

export type CreateTicketPayload = {
  name: string;
  email: string;
  category: string;
  priority: string;
  subject: string;
  message: string;
  attachment?: File | null;
};

type SupportStore = {
  // user/guest tickets
  myTickets: SupportTicket[];
  myTicketsLoading: boolean;
  selectedTicket: SupportTicket | null;

  // admin tickets
  adminTickets: SupportTicket[];
  adminLoading: boolean;
  adminTotal: number;

  submitTicket: (data: CreateTicketPayload) => Promise<SupportTicket>;
  fetchMyTickets: (search?: string, status?: string) => Promise<void>;
  fetchTicketsByEmail: (email: string) => Promise<void>;
  fetchTicket: (id: string, email?: string) => Promise<void>;
  setSelectedTicket: (ticket: SupportTicket | null) => void;

  // admin
  fetchAdminTickets: (page?: number, search?: string, status?: string, priority?: string) => Promise<void>;
  updateTicketStatus: (id: string, status: string, note?: string) => Promise<void>;
};

export const useSupportStore = create<SupportStore>((set) => ({
  myTickets: [],
  myTicketsLoading: false,
  selectedTicket: null,
  adminTickets: [],
  adminLoading: false,
  adminTotal: 0,

  submitTicket: async (data) => {
    const formData = new FormData();
    formData.append("name",     data.name);
    formData.append("email",    data.email);
    formData.append("category", data.category);
    formData.append("priority", data.priority);
    formData.append("subject",  data.subject);
    formData.append("message",  data.message);
    if (data.attachment) formData.append("attachment", data.attachment);

const isLoggedIn = !!useAuthStore.getState().user;
  const url = isLoggedIn ? "/user/support/tickets" : "/support/tickets";

  const res = await api.post(url, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
    const ticket = res.data.data ?? res.data;
    toast.success("Ticket submitted successfully!");
    return ticket;
  },

  fetchMyTickets: async (search = "", status = "") => {
    set({ myTicketsLoading: true });
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (status) params.append("status", status);
      const res = await api.get(`/user/support/tickets?${params}`);
      set({ myTickets: res.data.data ?? res.data, myTicketsLoading: false });
    } catch {
      set({ myTicketsLoading: false });
    }
  },

  fetchTicketsByEmail: async (email) => {
    set({ myTicketsLoading: true });
    try {
      const res = await api.get(`/support/tickets/by-email?email=${email}`);
      set({ myTickets: res.data.data ?? res.data, myTicketsLoading: false });
    } catch {
      set({ myTicketsLoading: false });
    }
  },

  fetchTicket: async (id, email) => {
    try {
      const url = email
        ? `/support/tickets/${id}?email=${email}`
        : `/support/tickets/${id}`;
      const res = await api.get(url);
      set({ selectedTicket: res.data.data ?? res.data });
    } catch {
      toast.error("Failed to load ticket");
    }
  },

  setSelectedTicket: (ticket) => set({ selectedTicket: ticket }),

  fetchAdminTickets: async (page = 1, search = "", status = "", priority = "") => {
    set({ adminLoading: true });
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (search)   params.append("search", search);
      if (status)   params.append("status", status);
      if (priority) params.append("priority", priority);
      const res = await api.get(`/admin/support/tickets?${params}`);
      set({
        adminTickets: res.data.data,
        adminTotal:   res.data.meta?.total ?? 0,
        adminLoading: false,
      });
    } catch {
      set({ adminLoading: false });
      toast.error("Failed to load tickets");
    }
  },

  updateTicketStatus: async (id, status, note) => {
    try {
      const res = await api.patch(`/admin/support/tickets/${id}/status`, { status, note });
      const updated = res.data.data ?? res.data;
      set((s) => ({
        adminTickets: s.adminTickets.map((t) => t.id === id ? updated : t),
        selectedTicket: s.selectedTicket?.id === id ? updated : s.selectedTicket,
      }));
      toast.success("Ticket status updated!");
    } catch {
      toast.error("Failed to update ticket");
    }
  },
}));