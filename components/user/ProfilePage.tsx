"use client";

import { useEffect, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Camera } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import api from "@/lib/axios";
import { cn } from "@/lib/utils";

const schema = z.object({
  first_name: z.string().min(1, "First name required"),
  last_name:  z.string().optional(),
  email:      z.string().email("Invalid email"),
  phone:      z.string().optional(),
  company:    z.string().optional(),
  gstin:      z.string().optional(),
 avatar: z.any().optional(),
});

type FormFields = z.infer<typeof schema>;

export default function ProfilePage() {
  const { user, setAuth, role } = useAuthStore();
  const [saving, setSaving] = useState(false);

  const nameParts  = user?.name?.split(" ") ?? [];
  const firstName  = nameParts[0] ?? "";
  const lastName   = nameParts.slice(1).join(" ") ?? "";
  const initials   = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const { register, handleSubmit, reset, formState: { errors } } =
    useForm<FormFields, unknown, FormFields>({
      resolver: zodResolver(schema) as Resolver<FormFields>,
      defaultValues: {
        first_name: firstName,
        last_name:  lastName,
        email:      user?.email ?? "",
        phone:      "",
        company:    "",
        gstin:      "",
        avatar: undefined,
      },
    });

  // fetch full profile on mount
  useEffect(() => {
    api.get("/me").then((res) => {
      const u = res.data.data?.user ?? res.data;
      const parts = u.name?.split(" ") ?? [];
      reset({
        first_name: parts[0] ?? "",
        last_name:  parts.slice(1).join(" ") ?? "",
        email:      u.email ?? "",
        phone:      u.phone ?? "",
        company:    u.company ?? "",
        gstin:      u.gstin ?? "",

      });

if (u.avatar) {
  setAvatarPreview(
    u.avatar.startsWith("http")
      ? u.avatar
      : `${process.env.NEXT_PUBLIC_BASE_URL}/storage/${u.avatar}` // 👈 fixed
  );
}
    }).catch(() => {});
  }, []);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];

  if (!file) return;

  // image preview
  const previewUrl = URL.createObjectURL(file);
  setAvatarPreview(previewUrl);
};

  const onSubmit = async (data: FormFields) => {
    setSaving(true);
    try {
      const fullName = `${data.first_name} ${data.last_name ?? ""}`.trim();
      const formData = new FormData();

      formData.append("name", fullName);
      formData.append("email", data.email);
      formData.append("phone", data.phone ?? "");
      formData.append("company", data.company ?? "");
      formData.append("gstin", data.gstin ?? "");


      if (data.avatar?.[0]) {
        formData.append("avatar", data.avatar[0]);
      }


      const res = await api.post("/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
  });
      const updated = res.data.data?.user ?? res.data;
      setAuth({ ...user!, name: updated.name, email: updated.email }, role);
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="bg-background border border-border rounded-2xl px-6 py-5">
        <h1 className="text-xl font-bold text-foreground">Profile</h1>
      </div>

      <div className="bg-background border border-border rounded-2xl p-6 max-w-2xl">

        {/* Avatar + info */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-brand flex items-center justify-center text-white text-xl font-bold">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  className="w-full h-full object-cover"
                  alt="avatar"
                />
              ) : (
                initials
              )}
            </div>
            <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-brand border-2 border-background flex items-center justify-center">
              <Camera className="h-3 w-3 text-white" />
            </button>
          </div>
          <div>
            <p className="font-bold text-foreground text-lg">{user?.name}</p>
            <p className="text-sm text-muted-foreground">Member since January 2026</p>
            <span className="mt-1 inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand/10 text-brand">
              Pro Member
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* First + Last name */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                First Name
              </Label>
              <Input
                placeholder="John"
                className={cn("h-10", errors.first_name && "border-destructive")}
                {...register("first_name")}
              />
              {errors.first_name && (
                <p className="text-xs text-destructive">{errors.first_name.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Last Name
              </Label>
              <Input
                placeholder="Doe"
                className="h-10"
                {...register("last_name")}
              />
            </div>
          </div>

          {/* Email + Phone */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Email
              </Label>
              <Input
                type="email"
                placeholder="john@example.com"
                className={cn("h-10", errors.email && "border-destructive")}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Phone
              </Label>
              <Input
                placeholder="+91XXXXXXXXXX"
                className="h-10"
                {...register("phone")}
              />
            </div>
          </div>

          {/* Company */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Company
            </Label>
            <Input
              placeholder="Your company name"
              className="h-10"
              {...register("company")}
            />
          </div>

          {/* GSTIN */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              GSTIN (Optional)
            </Label>
            <Input
              placeholder="22AAAAA0000A1Z5"
              className="h-10 font-mono"
              {...register("gstin")}
            />
          </div>
          {/* GSTIN */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Avatar
            </Label>
           <Input
              type="file"
              accept="image/*"
              className="h-10"
              {...register("avatar")}
              onChange={(e) => {
                register("avatar").onChange(e);
                handleAvatarChange(e);
              }}
            />
          </div>
          <Button
            type="submit"
            disabled={saving}
            className="bg-brand hover:bg-brand-hover text-white font-semibold rounded-full px-6"
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </div>
    </div>
  );
}