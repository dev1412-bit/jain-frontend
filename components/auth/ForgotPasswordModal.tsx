"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUIStore } from "@/store/uiStore";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import api from "@/lib/axios";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
});

type FormFields = z.infer<typeof schema>;

export default function ForgotPasswordModal() {
  const { forgotPasswordOpen, closeForgotPassword, openSignIn } = useUIStore();
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, getValues } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormFields) => {
    setLoading(true);
    try {
      await api.post("/forgot-password", data);
      setSent(true);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    closeForgotPassword();
    reset();
    setSent(false);
  };

  const backToSignIn = () => {
    handleClose();
    openSignIn();
  };

  return (
    <Dialog open={forgotPasswordOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden gap-0">

        <div className="bg-brand/5 border-b border-border px-6 pt-6 pb-5">
          <DialogHeader>
            <div className="mx-auto mb-3 w-12 h-12 rounded-2xl bg-brand flex items-center justify-center shadow-lg shadow-brand/25">
              <Mail className="h-5 w-5 text-white" />
            </div>
            <DialogTitle className="text-center text-xl font-bold text-foreground">
              {sent ? "Check your email" : "Forgot Password"}
            </DialogTitle>
            <DialogDescription className="text-center text-sm text-muted-foreground">
              {sent
                ? "We've sent a password reset link to your email"
                : "Enter your email and we'll send you a reset link"}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="px-6 py-5 space-y-4">
          {sent ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-500/10 flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-7 w-7 text-green-600" />
              </div>
              <p className="text-sm text-muted-foreground">
                A reset link has been sent to{" "}
                <span className="font-medium text-foreground">{getValues("email")}</span>.
                Please check your inbox.
              </p>
              <Button
                onClick={backToSignIn}
                variant="outline"
                className="w-full h-10 gap-2 rounded-lg font-semibold"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Sign In
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="forgot-email" className="text-sm font-medium">
                  Email address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="forgot-email"
                    type="email"
                    placeholder="you@example.com"
                    className={cn(
                      "pl-9 h-10",
                      errors.email && "border-destructive focus-visible:ring-destructive"
                    )}
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-10 bg-brand hover:bg-brand-hover text-white font-semibold rounded-lg gap-2"
              >
                {loading ? "Sending..." : <>Send Reset Link <ArrowRight className="h-4 w-4" /></>}
              </Button>

              <button
                type="button"
                onClick={backToSignIn}
                className="w-full flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to Sign In
              </button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}