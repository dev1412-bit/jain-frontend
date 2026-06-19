"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { AxiosError } from "axios";
import { AlertTriangle, Bell, KeyRound, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";

type UserSettings = {
  order_confirmations: boolean;
  license_renewals: boolean;
  product_updates: boolean;
  promotional_emails: boolean;
};

type PasswordForm = {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
};

type ApiErrorResponse = {
  message?: string;
};

const notificationItems: Array<{
  key: keyof UserSettings;
  title: string;
  description: string;
}> = [
  {
    key: "order_confirmations",
    title: "Order confirmations",
    description: "Get notified when an order is placed",
  },
  {
    key: "license_renewals",
    title: "License renewals",
    description: "Reminder before subscription expires",
  },
  {
    key: "product_updates",
    title: "Product updates",
    description: "New versions of your purchased software",
  },
  {
    key: "promotional_emails",
    title: "Promotional emails",
    description: "Offers and new product announcements",
  },
];

const defaultSettings: UserSettings = {
  order_confirmations: true,
  license_renewals: true,
  product_updates: false,
  promotional_emails: false,
};

const defaultPasswordForm: PasswordForm = {
  current_password: "",
  new_password: "",
  new_password_confirmation: "",
};

function getErrorMessage(error: unknown, fallback: string) {
  const axiosError = error as AxiosError<ApiErrorResponse>;
  return axiosError.response?.data?.message || fallback;
}

export default function UserSettingsPage() {
  const router = useRouter();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<keyof UserSettings | null>(null);
  const [passwordForm, setPasswordForm] = useState<PasswordForm>(defaultPasswordForm);
  const [savingPassword, setSavingPassword] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  useEffect(() => {
    api
      .get("/user/settings")
      .then((res) => {
        setSettings({ ...defaultSettings, ...(res.data.data ?? {}) });
      })
      .catch(() => {
        toast.error("Failed to load settings");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const updateSetting = async (key: keyof UserSettings) => {
    const nextSettings = { ...settings, [key]: !settings[key] };
    setSettings(nextSettings);
    setSavingKey(key);

    try {
      const res = await api.put("/user/settings", nextSettings);
      setSettings({ ...defaultSettings, ...(res.data.data ?? nextSettings) });
      toast.success("Settings updated");
    } catch (err: unknown) {
      setSettings(settings);
      toast.error(getErrorMessage(err, "Failed to update settings"));
    } finally {
      setSavingKey(null);
    }
  };

  const updatePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSavingPassword(true);

    try {
      await api.put("/user/settings/password", passwordForm);
      setPasswordForm(defaultPasswordForm);
      toast.success("Password updated successfully");
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Failed to update password"));
    } finally {
      setSavingPassword(false);
    }
  };

  const deleteAccount = async () => {
    const confirmed = window.confirm(
      "Delete your account? Your account will be deactivated but kept in the system for records."
    );

    if (!confirmed) {
      return;
    }

    setDeletingAccount(true);

    try {
      await api.delete("/user/settings/account");
      clearAuth();
      toast.success("Account deleted successfully");
      router.push("/");
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Failed to delete account"));
    } finally {
      setDeletingAccount(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="bg-background border border-border rounded-2xl px-6 py-5">
        <h1 className="text-xl font-bold text-foreground">Account Settings</h1>
      </div>

      <section className="bg-background border border-border rounded-2xl p-5 max-w-2xl">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="h-4 w-4 text-brand" />
          <h2 className="font-semibold text-foreground text-sm">Notifications</h2>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground py-6">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading settings...
          </div>
        ) : (
          <div className="divide-y divide-border">
            {notificationItems.map((item) => (
              <div key={item.key} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
                <button
                      type="button"
                      role="switch"
                      aria-checked={settings[item.key]}
                      disabled={savingKey === item.key}
                      onClick={() => updateSetting(item.key)}
                      className={cn(
                        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 shrink-0",
                        settings[item.key]
                          ? "bg-brand"
                          : "bg-muted",
                        "disabled:opacity-60"
                      )}
                    >
                      <span
                        className={cn(
                          "block h-4 w-4 rounded-full bg-white shadow transition-transform duration-200",
                          settings[item.key]
                            ? "translate-x-6"
                            : "translate-x-1"
                        )}
                      />
                    </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="bg-background border border-border rounded-2xl p-5 max-w-2xl">
        <div className="flex items-center gap-2 mb-4">
          <KeyRound className="h-4 w-4 text-brand" />
          <h2 className="font-semibold text-foreground text-sm">Security</h2>
        </div>

        <form onSubmit={updatePassword} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Current Password
            </Label>
            <Input
              type="password"
              value={passwordForm.current_password}
              onChange={(event) =>
                setPasswordForm((form) => ({ ...form, current_password: event.target.value }))
              }
              className="h-10"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              New Password
            </Label>
            <Input
              type="password"
              value={passwordForm.new_password}
              onChange={(event) =>
                setPasswordForm((form) => ({ ...form, new_password: event.target.value }))
              }
              className="h-10"
              required
              minLength={8}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Confirm Password
            </Label>
            <Input
              type="password"
              value={passwordForm.new_password_confirmation}
              onChange={(event) =>
                setPasswordForm((form) => ({ ...form, new_password_confirmation: event.target.value }))
              }
              className="h-10"
              required
              minLength={8}
            />
          </div>

          <Button
            type="submit"
            disabled={savingPassword}
            className="bg-brand hover:bg-brand-hover text-white font-semibold rounded-full px-6"
          >
            {savingPassword ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </section>

      <section className="bg-background border border-destructive/25 rounded-2xl p-5 max-w-2xl">
        <div className="flex items-center gap-2 mb-3 text-destructive">
          <AlertTriangle className="h-4 w-4" />
          <h2 className="font-semibold text-sm">Danger Zone</h2>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Once you delete your account, it will be deactivated and hidden from login.
        </p>
        <Button
          type="button"
          variant="destructive"
          disabled={deletingAccount}
          onClick={deleteAccount}
          className="rounded-full"
        >
          <Trash2 className="h-4 w-4" />
          {deletingAccount ? "Deleting..." : "Delete Account"}
        </Button>
      </section>
    </div>
  );
}
