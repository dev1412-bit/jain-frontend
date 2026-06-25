"use client";

import { useEffect, useState } from "react";
import {
  Globe, CreditCard, Mail, Bell, Shield, Palette, Code2,
  Eye, EyeOff, RefreshCw, Send,
} from "lucide-react";
import { useSettingsStore } from "@/store/settingsStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// ─── Toggle Switch ────────────────────────────────────────────────────────────

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors",
        checked ? "bg-brand" : "bg-muted"
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-6 space-y-5">
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      {children}
    </div>
  );
}

// ─── Field wrapper ────────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        {label}
      </label>
      {children}
    </div>
  );
}

// ─── Notification / Security row ──────────────────────────────────────────────

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

// ─── Password field ───────────────────────────────────────────────────────────

function PasswordInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pr-10"
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

// ─── Gateway Card ─────────────────────────────────────────────────────────────

function GatewayCard({
  name,
  initial,
  enabled,
  onToggle,
  onSave,
  saving,
  fields,
}: {
  name: string;
  initial: string;
  enabled: boolean;
  onToggle: (v: boolean) => void;
  onSave: (keyId: string, keySecret: string) => void;
  saving: boolean;
  fields: { keyId: string; keySecret: string };
}) {
  const [keyId, setKeyId]         = useState(fields.keyId ?? "");
  const [keySecret, setKeySecret] = useState(fields.keySecret ?? "");

  return (
    <div className="rounded-2xl border border-border bg-background p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-brand flex items-center justify-center text-white font-bold text-sm">
            {initial}
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">{name}</span>
            {enabled && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-600">
                Active
              </span>
            )}
          </div>
        </div>
        <Toggle checked={enabled} onChange={onToggle} />
      </div>

      {enabled && (
        <>
          <Field label="Key ID">
            <Input
              placeholder={`${name.toLowerCase().replace(/\s/g, "_")}_live_xxxxxxxxxx`}
              value={keyId}
              onChange={(e) => setKeyId(e.target.value)}
            />
          </Field>
          <Field label="Key Secret">
            <PasswordInput
              value={keySecret}
              onChange={setKeySecret}
              placeholder="••••••••••••••••"
            />
          </Field>
          <Button
            className="w-full bg-brand hover:bg-brand-hover text-white"
            onClick={() => onSave(keyId, keySecret)}
            disabled={saving}
          >
            {saving ? "Saving..." : `Save ${name} Settings`}
          </Button>
        </>
      )}
    </div>
  );
}

// ─── Tab: General ─────────────────────────────────────────────────────────────

function GeneralTab() {
  const { general, loading, saving, fetchGeneral, saveGeneral } = useSettingsStore();
  const [form, setForm] = useState({
    business_name: "", business_email: "", phone: "",
    address: "", website_url: "", support_email: "", timezone: "Asia/Kolkata",
  });

  useEffect(() => { if (!general) fetchGeneral(); }, []);
  useEffect(() => { if (general) setForm({ ...form, ...general }); }, [general]);

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const TIMEZONES = [
    "Asia/Kolkata", "Asia/Dubai", "Asia/Singapore", "Asia/Tokyo",
    "Europe/London", "Europe/Paris", "America/New_York", "America/Los_Angeles",
    "UTC",
  ];

  return (
    <Section title="General Settings">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Business Name">
          <Input value={form.business_name} onChange={(e) => set("business_name", e.target.value)} placeholder="JSF" />
        </Field>
        <Field label="Business Email">
          <Input value={form.business_email} onChange={(e) => set("business_email", e.target.value)} placeholder="contact@jain.software" />
        </Field>
        <Field label="Phone">
          <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91 XXXXXXXXXX" />
        </Field>
        <Field label="Support Email">
          <Input value={form.support_email} onChange={(e) => set("support_email", e.target.value)} placeholder="support@jain.software" />
        </Field>
        <Field label="Address">
          <Input value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="Raipur, Chhattisgarh" />
        </Field>
        <Field label="Website URL">
          <Input value={form.website_url} onChange={(e) => set("website_url", e.target.value)} placeholder="www.jain.software" />
        </Field>
        <Field label="Timezone">
          <div className="relative">
            <select
              value={form.timezone}
              onChange={(e) => set("timezone", e.target.value)}
              className="w-full h-10 pl-3 pr-8 text-sm rounded-md border border-input bg-background text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-brand/30"
            >
              {TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>{tz.replace("_", " ")}</option>
              ))}
            </select>
          </div>
        </Field>
      </div>
      <Button
        className="bg-brand hover:bg-brand-hover text-white px-6"
        onClick={() => saveGeneral(form)}
        disabled={saving || loading}
      >
        {saving ? "Saving..." : "Save Changes"}
      </Button>
    </Section>
  );
}

// ─── Tab: Payment Gateways ────────────────────────────────────────────────────

function PaymentTab() {
  const { payment, loading, saving, fetchPayment, savePayment } = useSettingsStore();

  useEffect(() => { if (!payment) fetchPayment(); }, []);

  const toggle = (gateway: string, enabled: boolean) => {
    savePayment(gateway as any, { [`${gateway}_enabled`]: enabled } as any);
  };

  const save = (gateway: string, keyId: string, keySecret: string) => {
    savePayment(gateway as any, {
      [`${gateway}_key_id`]:     keyId,
      [`${gateway}_key_secret`]: keySecret,
    } as any);
  };

  if (loading || !payment) return <div className="h-40 bg-muted animate-pulse rounded-2xl" />;

  return (
    <div className="space-y-4">
      <GatewayCard
        name="Razorpay" initial="R"
        enabled={payment.razorpay_enabled}
        onToggle={(v) => toggle("razorpay", v)}
        onSave={(id, sec) => save("razorpay", id, sec)}
        saving={saving}
        fields={{ keyId: payment.razorpay_key_id, keySecret: payment.razorpay_key_secret }}
      />
      <GatewayCard
        name="Stripe" initial="S"
        enabled={payment.stripe_enabled}
        onToggle={(v) => toggle("stripe", v)}
        onSave={(id, sec) => save("stripe", id, sec)}
        saving={saving}
        fields={{ keyId: payment.stripe_key_id, keySecret: payment.stripe_key_secret }}
      />
      <GatewayCard
        name="PayPal" initial="P"
        enabled={payment.paypal_enabled}
        onToggle={(v) => toggle("paypal", v)}
        onSave={(id, sec) => save("paypal", id, sec)}
        saving={saving}
        fields={{ keyId: payment.paypal_client_id, keySecret: payment.paypal_client_secret }}
      />
    </div>
  );
}

// ─── Tab: Email Settings ──────────────────────────────────────────────────────

function EmailTab() {
  const { email, loading, saving, fetchEmail, saveEmail, sendTestEmail } = useSettingsStore();
  const [form, setForm] = useState({
    smtp_host: "", smtp_port: 587, smtp_username: "",
    smtp_password: "", from_name: "", from_email: "", encryption: "tls" as "tls" | "ssl" | "none",
  });
  const [testEmail, setTestEmail] = useState("");

  useEffect(() => { if (!email) fetchEmail(); }, []);
  useEffect(() => {
    if (email) {
      setForm((prev) => ({
        ...prev,
        ...email,

        smtp_host: email.smtp_host ?? "",
        smtp_username: email.smtp_username ?? "",
        smtp_password: email.smtp_password ?? "",
        from_name: email.from_name ?? "",
        from_email: email.from_email ?? "",
        encryption: email.encryption ?? "tls",
        smtp_port: email.smtp_port ?? 587,
      }));
    }
  }, [email]);

  const set = (k: string, v: any) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <Section title="Email Configuration">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="SMTP Host">
          <Input value={form.smtp_host} onChange={(e) => set("smtp_host", e.target.value)} placeholder="smtp.gmail.com" />
        </Field>
        <Field label="SMTP Port">
          <Input type="number" value={form.smtp_port} onChange={(e) => set("smtp_port", Number(e.target.value))} placeholder="587" />
        </Field>
        <Field label="Username">
          <Input value={form.smtp_username} onChange={(e) => set("smtp_username", e.target.value)} placeholder="your@email.com" />
        </Field>
        <Field label="Password">
          <PasswordInput value={form.smtp_password} onChange={(v) => set("smtp_password", v)} placeholder="••••••••••••" />
        </Field>
        <Field label="From Name">
          <Input value={form.from_name} onChange={(e) => set("from_name", e.target.value)} placeholder="Jain Software Foundation" />
        </Field>
        <Field label="Encryption">
          <select
            value={form.encryption}
            onChange={(e) => set("encryption", e.target.value)}
            className="w-full h-10 pl-3 pr-8 text-sm rounded-md border border-input bg-background text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-brand/30"
          >
            <option value="tls">TLS</option>
            <option value="ssl">SSL</option>
            <option value="none">None</option>
          </select>
        </Field>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Input
          placeholder="Send test to: you@example.com"
          value={testEmail}
          onChange={(e) => setTestEmail(e.target.value)}
          className="max-w-xs"
        />
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => sendTestEmail(testEmail)}
          disabled={saving || !testEmail}
        >
          <Send className="h-4 w-4" /> Send Test Email
        </Button>
        <Button
          className="bg-brand hover:bg-brand-hover text-white ml-auto"
          onClick={() => saveEmail(form)}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </Section>
  );
}

// ─── Tab: Notifications ───────────────────────────────────────────────────────

function NotificationsTab() {
  const { notifications, loading, saving, fetchNotifications, saveNotifications } = useSettingsStore();
  const [form, setForm] = useState({
    email_notifications: true, new_order_notifications: true,
    low_stock_alerts: true, customer_signup: true, refund_requests: true,
  });

  useEffect(() => { if (!notifications) fetchNotifications(); }, []);
  useEffect(() => { if (notifications) setForm({ ...form, ...notifications }); }, [notifications]);

  const toggle = (k: keyof typeof form, v: boolean) => {
    const updated = { ...form, [k]: v };
    setForm(updated);
    saveNotifications(updated);
  };

  return (
    <Section title="Notification Preferences">
      <ToggleRow label="Email notifications"     description="Receive email notifications for key events"        checked={form.email_notifications}     onChange={(v) => toggle("email_notifications", v)} />
      <ToggleRow label="New order notifications" description="Get notified when a new order is placed"           checked={form.new_order_notifications} onChange={(v) => toggle("new_order_notifications", v)} />
      <ToggleRow label="Low stock alerts"        description="Alert when download limits are running low"        checked={form.low_stock_alerts}        onChange={(v) => toggle("low_stock_alerts", v)} />
      <ToggleRow label="Customer signup"         description="Notification when new customers register"         checked={form.customer_signup}         onChange={(v) => toggle("customer_signup", v)} />
      <ToggleRow label="Refund requests"         description="Get notified of refund requests"                  checked={form.refund_requests}         onChange={(v) => toggle("refund_requests", v)} />
    </Section>
  );
}

// ─── Tab: Security ────────────────────────────────────────────────────────────

function SecurityTab() {
  const { security, saving, fetchSecurity, saveSecurity, updatePassword } = useSettingsStore();
  const [sec, setSec]     = useState({ two_factor_enabled: false, login_alerts: true, ip_whitelist: false, session_timeout: true });
  const [current, setCurrent]   = useState("");
  const [newPass, setNewPass]   = useState("");
  const [confirm, setConfirm]   = useState("");

  useEffect(() => { if (!security) fetchSecurity(); }, []);
  useEffect(() => { if (security) setSec({ ...sec, ...security }); }, [security]);

  const toggleSec = (k: string, v: boolean) => {
    const updated = { ...sec, [k]: v };
    setSec(updated as any);
    saveSecurity(updated as any);
  };

  const handlePassword = async () => {
    if (newPass !== confirm) { return; }
    await updatePassword(current, newPass, confirm);
    setCurrent(""); setNewPass(""); setConfirm("");
  };

  // Mock sessions — replace with real API
  const sessions = [
    { device: "Chrome on macOS", ip: "192.168.1.1 • Mumbai, India", current: true },
    { device: "Safari on iPhone", ip: "192.168.1.5 • Mumbai, India", current: false },
  ];

  return (
    <div className="space-y-4">
      <Section title="Admin Password">
        <div className="space-y-3 max-w-md">
          <Field label="Current Password">
            <PasswordInput value={current} onChange={setCurrent} placeholder="••••••••" />
          </Field>
          <Field label="New Password">
            <PasswordInput value={newPass} onChange={setNewPass} placeholder="••••••••" />
          </Field>
          <Field label="Confirm Password">
            <PasswordInput value={confirm} onChange={setConfirm} placeholder="••••••••" />
          </Field>
          {newPass && confirm && newPass !== confirm && (
            <p className="text-xs text-destructive">Passwords do not match</p>
          )}
        </div>
        <Button
          className="bg-brand hover:bg-brand-hover text-white w-full max-w-md"
          onClick={handlePassword}
          disabled={saving || !current || !newPass || newPass !== confirm}
        >
          {saving ? "Updating..." : "Update Password"}
        </Button>
      </Section>

      <Section title="Two-Factor Authentication">
        <ToggleRow label="Enable 2FA"        description="Add an extra layer of security to your admin account" checked={sec.two_factor_enabled} onChange={(v) => toggleSec("two_factor_enabled", v)} />
        <ToggleRow label="Login alerts"      description="Email alert on new admin login"                       checked={sec.login_alerts}        onChange={(v) => toggleSec("login_alerts", v)} />
        <ToggleRow label="IP whitelist"      description="Restrict access to specific IP addresses"             checked={sec.ip_whitelist}        onChange={(v) => toggleSec("ip_whitelist", v)} />
        <ToggleRow label="Session timeout"   description="Auto-logout after 30 min of inactivity"              checked={sec.session_timeout}     onChange={(v) => toggleSec("session_timeout", v)} />
      </Section>

      <Section title="Active Sessions">
        <div className="space-y-2">
          {sessions.map((s, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground">{s.device}</p>
                  {s.current && (
                    <span className="px-1.5 py-0.5 rounded text-xs bg-green-100 text-green-600">Current</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{s.ip}</p>
              </div>
              {!s.current && (
                <button className="text-xs text-destructive hover:underline">Revoke</button>
              )}
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

// ─── Tab: Theme ───────────────────────────────────────────────────────────────

function ThemeTab() {
  const { theme, saving, fetchTheme, saveTheme } = useSettingsStore();
const [form, setForm] = useState<{
    primary_color: string;
    secondary_color: string;
    accent_color: string;
    background_color: string;
    dark_background_color: string;
    text_color: string;
    dark_mode_default: boolean;
    border_radius: "none" | "small" | "medium" | "large" | "full"; 
    font_family: string;
  }>({
    primary_color: "#be1966", 
    secondary_color: "#6366f1", 
    accent_color: "#10b981",
    background_color: "#f5f5f7", 
    dark_background_color: "#0B0D12", 
    text_color: "#1d1d1f",
    dark_mode_default: false, 
    border_radius: "medium", // Default fallback value
    font_family: "SF Pro Display",
  });

  useEffect(() => { if (!theme) fetchTheme(); }, []);
  useEffect(() => { if (theme) setForm({ ...form, ...theme }); }, [theme]);

  const set = (k: string, v: any) => setForm((p) => ({ ...p, [k]: v }));

  const RADII  = ["none", "small", "medium", "large", "full"];
  const FONTS  = ["SF Pro Display", "Inter", "Geist", "DM Sans", "Poppins", "Nunito"];

  return (
    <div className="space-y-4">
      <Section title="Brand Colors">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { key: "primary_color", label: "Primary Color" },
            { key: "secondary_color", label: "Secondary Color" },
            { key: "accent_color", label: "Accent Color" },
            { key: "background_color", label: "Background" },
            { key: "dark_background_color", label: "Dark Background" },
            { key: "text_color", label: "Text Color" },
          ].map(({ key, label }) => (
            <Field key={key} label={label}>
              <div className="flex items-center gap-2 h-10 px-3 rounded-md border border-input bg-background">
                <input
                  type="color"
                  value={(form as any)[key]}
                  onChange={(e) => set(key, e.target.value)}
                  className="w-6 h-6 rounded-full border-0 cursor-pointer bg-transparent"
                />
                <span className="text-sm text-foreground font-mono">{(form as any)[key]}</span>
              </div>
            </Field>
          ))}
        </div>
      </Section>

      <Section title="Appearance">
        <ToggleRow
          label="Dark Mode (Default)"
          description="Set default theme for new visitors"
          checked={form.dark_mode_default}
          onChange={(v) => set("dark_mode_default", v)}
        />

        <Field label="Border Radius">
          <div className="flex items-center gap-2 flex-wrap">
            {RADII.map((r) => (
              <button
                key={r}
                onClick={() => set("border_radius", r)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm border transition-colors capitalize",
                  form.border_radius === r
                    ? "border-brand bg-brand/10 text-brand"
                    : "border-border text-muted-foreground hover:bg-muted/50"
                )}
              >
                {r}
              </button>
            ))}
          </div>
        </Field>

        <Field label="Font Family">
          <select
            value={form.font_family}
            onChange={(e) => set("font_family", e.target.value)}
            className="w-full h-10 pl-3 pr-8 text-sm rounded-md border border-input bg-background text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-brand/30"
          >
            {FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </Field>

        <Button
          className="bg-brand hover:bg-brand-hover text-white px-6"
          onClick={() => saveTheme(form)}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Theme Settings"}
        </Button>
      </Section>
    </div>
  );
}

// ─── Tab: API & Integrations ──────────────────────────────────────────────────

function ApiTab() {
  const { apiSettings, saving, fetchApi, saveApi, regenerateApiKey } = useSettingsStore();
  const [webhookUrl, setWebhookUrl] = useState("");
  const [apiEnabled, setApiEnabled] = useState(false);
  const [freshKey, setFreshKey]     = useState("");

  useEffect(() => { if (!apiSettings) fetchApi(); }, []);
  useEffect(() => {
    if (apiSettings) {
      setWebhookUrl(apiSettings.webhook_url ?? "");
      setApiEnabled(apiSettings.api_enabled);
    }
  }, [apiSettings]);

  const handleRegenerate = async () => {
    if (!confirm("Regenerate API key? The old key will stop working immediately.")) return;
    const key = await regenerateApiKey();
    if (key) setFreshKey(key);
  };

  return (
    <Section title="API & Integrations">
      <ToggleRow
        label="Enable API Access"
        description="Allow external applications to connect via API"
        checked={apiEnabled}
        onChange={(v) => { setApiEnabled(v); saveApi({ api_enabled: v }); }}
      />

      <Field label="API Key">
        <div className="flex items-center gap-2">
          <Input
            value={freshKey || apiSettings?.api_key || ""}
            readOnly
            className="font-mono text-xs"
            placeholder="No key generated yet"
          />
          <Button
            variant="outline"
            className="shrink-0 gap-2"
            onClick={handleRegenerate}
            disabled={saving}
          >
            <RefreshCw className="h-4 w-4" /> Regenerate
          </Button>
        </div>
        {freshKey && (
          <p className="text-xs text-amber-500 mt-1">
            ⚠ Copy this key now — it will be masked after you leave this page.
          </p>
        )}
      </Field>

      <Field label="Webhook URL">
        <Input
          value={webhookUrl}
          onChange={(e) => setWebhookUrl(e.target.value)}
          placeholder="https://yourapp.com/webhooks/jain"
        />
      </Field>

      <Button
        className="bg-brand hover:bg-brand-hover text-white px-6"
        onClick={() => saveApi({ webhook_url: webhookUrl })}
        disabled={saving}
      >
        {saving ? "Saving..." : "Save Settings"}
      </Button>
    </Section>
  );
}

// ─── Tabs config ──────────────────────────────────────────────────────────────

const TABS = [
  { id: "general",      label: "General",           icon: Globe },
  { id: "payment",      label: "Payment Gateways",  icon: CreditCard },
  { id: "email",        label: "Email Settings",    icon: Mail },
  { id: "notification", label: "Notifications",     icon: Bell },
  { id: "security",     label: "Security",          icon: Shield },
  { id: "theme",        label: "Theme",             icon: Palette },
  { id: "api",          label: "API & Integrations",icon: Code2 },
];

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");

  const renderTab = () => {
    switch (activeTab) {
      case "general":      return <GeneralTab />;
      case "payment":      return <PaymentTab />;
      case "email":        return <EmailTab />;
      case "notification": return <NotificationsTab />;
      case "security":     return <SecurityTab />;
      case "theme":        return <ThemeTab />;
      case "api":          return <ApiTab />;
      default:             return null;
    }
  };

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your platform settings</p>
      </div>

      <div className="flex gap-5 items-start">
        {/* Left nav */}
        <div className="w-56 shrink-0 rounded-2xl border border-border bg-background overflow-hidden">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 text-left text-sm transition-colors border-l-2",
                  activeTab === tab.id
                    ? "bg-brand/10 border-brand text-brand font-medium"
                    : "border-transparent text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Right content */}
        <div className="flex-1 min-w-0">
          {renderTab()}
        </div>
      </div>
    </div>
  );
}