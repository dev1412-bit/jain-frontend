"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Lock, Eye, EyeOff, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import api from "@/lib/axios";
import { useUIStore } from "@/store/uiStore";

const schema = z.object({
  password:              z.string().min(6, "At least 6 characters"),
  password_confirmation: z.string(),
}).refine((d) => d.password === d.password_confirmation, {
  message: "Passwords don't match",
  path:    ["password_confirmation"],
});

type FormFields = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router        = useRouter();
  const { openSignIn } = useUIStore();

  const token = searchParams.get("token") ?? "";
  const email = searchParams.get("email") ?? "";

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPw,  setShowPw]  = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormFields) => {
    setLoading(true);
    try {
      await api.post("/reset-password", {
        token, email,
        password: data.password,
        password_confirmation: data.password_confirmation,
      });
      setSuccess(true);
      toast.success("Password reset successfully!");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-sm text-muted-foreground">Invalid or expired reset link.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#f8fafc] dark:bg-background">
      <div className="w-full max-w-md bg-background border border-border rounded-2xl p-8 space-y-5">

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand flex items-center justify-center mx-auto">
            <Lock className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-foreground">
            {success ? "Password Reset!" : "Set New Password"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {success
              ? "Your password has been changed successfully"
              : `Resetting password for ${email}`}
          </p>
        </div>

        {success ? (
          <div className="text-center space-y-4">
            <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto" />
            <Button
              onClick={() => { router.push("/"); openSignIn(); }}
              className="w-full h-11 bg-brand hover:bg-brand-hover text-white font-semibold rounded-xl"
            >
              Sign In Now
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  className={cn("pl-9 pr-10 h-10", errors.password && "border-destructive")}
                  {...register("password")}
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Confirm Password</Label>
              <Input
                type={showPw ? "text" : "password"}
                placeholder="••••••••"
                className={cn("h-10", errors.password_confirmation && "border-destructive")}
                {...register("password_confirmation")}
              />
              {errors.password_confirmation && (
                <p className="text-xs text-destructive">{errors.password_confirmation.message}</p>
              )}
            </div>

            <Button type="submit" disabled={loading}
              className="w-full h-11 bg-brand hover:bg-brand-hover text-white font-semibold rounded-xl gap-2">
              {loading ? "Resetting..." : <>Reset Password <ArrowRight className="h-4 w-4" /></>}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}