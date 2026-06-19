import { create } from "zustand";
import api from "@/lib/axios";
import { toast } from "sonner";

// ── Types ─────────────────────────────────────────────────────────────────────

export type GeneralSettings = {
  business_name: string;
  business_email: string;
  phone: string;
  address: string;
  website_url: string;
  support_email: string;
  timezone: string;
};

export type PaymentSettings = {
  razorpay_enabled: boolean;
  razorpay_key_id: string;
  razorpay_key_secret: string;
  stripe_enabled: boolean;
  stripe_key_id: string;
  stripe_key_secret: string;
  paypal_enabled: boolean;
  paypal_client_id: string;
  paypal_client_secret: string;
};

export type EmailSettings = {
  smtp_host: string;
  smtp_port: number;
  smtp_username: string;
  smtp_password: string;
  from_name: string;
  from_email: string;
  encryption: "tls" | "ssl" | "none";
};

export type NotificationSettings = {
  email_notifications: boolean;
  new_order_notifications: boolean;
  low_stock_alerts: boolean;
  customer_signup: boolean;
  refund_requests: boolean;
};

export type SecuritySettings = {
  two_factor_enabled: boolean;
  login_alerts: boolean;
  ip_whitelist: boolean;
  session_timeout: boolean;
  session_timeout_minutes: number;
};

export type ThemeSettings = {
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  background_color: string;
  dark_background_color: string;
  text_color: string;
  dark_mode_default: boolean;
  border_radius: "none" | "small" | "medium" | "large" | "full";
  font_family: string;
};

export type ApiSettings = {
  api_enabled: boolean;
  api_key: string;
  webhook_url: string;
  webhook_secret: string;
};

type SettingsStore = {
  general:       GeneralSettings | null;
  payment:       PaymentSettings | null;
  email:         EmailSettings   | null;
  notifications: NotificationSettings | null;
  security:      SecuritySettings | null;
  theme:         ThemeSettings   | null;
  apiSettings:   ApiSettings     | null;
  loading:       boolean;
  saving:        boolean;

  fetchGeneral:       () => Promise<void>;
  fetchPayment:       () => Promise<void>;
  fetchEmail:         () => Promise<void>;
  fetchNotifications: () => Promise<void>;
  fetchSecurity:      () => Promise<void>;
  fetchTheme:         () => Promise<void>;
  fetchApi:           () => Promise<void>;

  saveGeneral:        (data: Partial<GeneralSettings>) => Promise<void>;
  savePayment:        (gateway: "razorpay" | "stripe" | "paypal", data: Partial<PaymentSettings>) => Promise<void>;
  saveEmail:          (data: Partial<EmailSettings>) => Promise<void>;
  sendTestEmail:      (to: string) => Promise<void>;
  saveNotifications:  (data: Partial<NotificationSettings>) => Promise<void>;
  saveSecurity:       (data: Partial<SecuritySettings>) => Promise<void>;
  updatePassword:     (current: string, newPass: string, confirm: string) => Promise<void>;
  saveTheme:          (data: Partial<ThemeSettings>) => Promise<void>;
  saveApi:            (data: Partial<ApiSettings>) => Promise<void>;
  regenerateApiKey:   () => Promise<string>;
};

// ── Store ─────────────────────────────────────────────────────────────────────

export const useSettingsStore = create<SettingsStore>((set) => ({
  general: null, payment: null, email: null,
  notifications: null, security: null, theme: null, apiSettings: null,
  loading: false, saving: false,

  // ── Fetchers ──────────────────────────────────────────────────────────────

  fetchGeneral: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/settings/general");
      set({ general: res.data.data });
    } catch { toast.error("Failed to load general settings"); }
    finally { set({ loading: false }); }
  },

  fetchPayment: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/settings/payment");
      set({ payment: res.data.data });
    } catch { toast.error("Failed to load payment settings"); }
    finally { set({ loading: false }); }
  },

  fetchEmail: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/settings/email");
      set({ email: res.data.data });
    } catch { toast.error("Failed to load email settings"); }
    finally { set({ loading: false }); }
  },

  fetchNotifications: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/settings/notifications");
      set({ notifications: res.data.data });
    } catch { toast.error("Failed to load notification settings"); }
    finally { set({ loading: false }); }
  },

  fetchSecurity: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/settings/security");
      set({ security: res.data.data });
    } catch { toast.error("Failed to load security settings"); }
    finally { set({ loading: false }); }
  },

  fetchTheme: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/settings/theme");
      set({ theme: res.data.data });
    } catch { toast.error("Failed to load theme settings"); }
    finally { set({ loading: false }); }
  },

  fetchApi: async () => {
    set({ loading: true });
    try {
      const res = await api.get("/settings/api");
      set({ apiSettings: res.data.data });
    } catch { toast.error("Failed to load API settings"); }
    finally { set({ loading: false }); }
  },

  // ── Savers ────────────────────────────────────────────────────────────────

  saveGeneral: async (data) => {
    set({ saving: true });
    try {
      const res = await api.put("/settings/general", data);
      set({ general: res.data.data });
      toast.success("General settings saved");
    } catch (e: any) { const errors = e?.response?.data?.errors;
    if (errors) {
      // Show first validation error
      const first = Object.values(errors)[0] as string[];
      toast.error(first[0]);
    } else {
      toast.error(e?.response?.data?.message ?? "Failed to save");
    }
}
    finally { set({ saving: false }); }
  },

  savePayment: async (_gateway, data) => {
    set({ saving: true });
    try {
      await api.put("/settings/payment", data);
      toast.success("Payment settings saved");
    } catch { toast.error("Failed to save"); }
    finally { set({ saving: false }); }
  },

  saveEmail: async (data) => {
    set({ saving: true });
    try {
      await api.put("/settings/email", data);
      toast.success("Email settings saved");
    } catch { toast.error("Failed to save"); }
    finally { set({ saving: false }); }
  },

  sendTestEmail: async (to) => {
    set({ saving: true });
    try {
      await api.post("/settings/email/test", { to });
      toast.success("Test email sent to " + to);
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Failed to send test email");
    } finally { set({ saving: false }); }
  },

  saveNotifications: async (data) => {
    set({ saving: true });
    try {
      const res = await api.put("/settings/notifications", data);
      set({ notifications: res.data.data ?? data as NotificationSettings });
      toast.success("Notification settings saved");
    } catch { toast.error("Failed to save"); }
    finally { set({ saving: false }); }
  },

  saveSecurity: async (data) => {
    set({ saving: true });
    try {
      const res = await api.put("/settings/security", data);
      set({ security: res.data.data ?? data as SecuritySettings });
      toast.success("Security settings saved");
    } catch { toast.error("Failed to save"); }
    finally { set({ saving: false }); }
  },

  updatePassword: async (current, newPass, confirm) => {
    set({ saving: true });
    try {
      await api.post("/settings/security/password", {
        current_password: current,
        new_password: newPass,
        new_password_confirmation: confirm,
      });
      toast.success("Password updated successfully");
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? "Failed to update password");
    } finally { set({ saving: false }); }
  },

  saveTheme: async (data) => {
    set({ saving: true });
    try {
      const res = await api.put("/settings/theme", data);
      set({ theme: res.data.data ?? data as ThemeSettings });
      toast.success("Theme settings saved");
    } catch { toast.error("Failed to save"); }
    finally { set({ saving: false }); }
  },

  saveApi: async (data) => {
    set({ saving: true });
    try {
      await api.put("/settings/api", data);
      toast.success("API settings saved");
    } catch { toast.error("Failed to save"); }
    finally { set({ saving: false }); }
  },

  regenerateApiKey: async () => {
    set({ saving: true });
    try {
      const res = await api.post("/settings/api/regenerate");
      const key = res.data.data.api_key;
      set((s) => ({ apiSettings: s.apiSettings ? { ...s.apiSettings, api_key: key } : null }));
      toast.success(res.data.message);
      return key;
    } catch {
      toast.error("Failed to regenerate key");
      return "";
    } finally { set({ saving: false }); }
  },
}));