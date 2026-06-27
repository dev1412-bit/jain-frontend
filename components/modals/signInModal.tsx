"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Mail, Lock, ArrowRight, } from "lucide-react";
import {FaGithub} from "react-icons/fa";
import { useCartStore } from "@/store/cartStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,    
  DialogDescription,  
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUIStore } from "@/store/uiStore";
import { useAuthStore, Role } from "@/store/authStore";
import { cn } from "@/lib/utils";
import {toast} from "sonner";
import { loginUser } from "@/lib/api/auth";
import { useRouter } from "next/navigation"; 
import { useWishlistStore } from "@/store/wishlistStore";

const signInSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInForm = z.infer<typeof signInSchema>;

export default function SignInModal() {
  const { signInOpen, closeSignIn, switchToSignUp } = useUIStore();
  const { setAuth } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { setLoggedIn, mergeGuestCart } = useCartStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
  });
const onSubmit = async (data: SignInForm) => {
  setLoading(true);
  setError("");
  try {
    const res = await loginUser({
      email: data.email,
      password: data.password,
    });
    const role = res.user.role as Role;
    setAuth(res.user, role);
    setLoggedIn(true);        
    await mergeGuestCart(); 
    await fetchWishlist(); 
    closeSignIn();
    reset();

    toast.success("Welcome back!", {
      description: `Signed in as ${res.user.name}`,
    });
      if (role === "admin") {
      router.push("/admin");
    } else {
        const redirectTo = sessionStorage.getItem("checkout_redirect");
        if (redirectTo) {
          sessionStorage.removeItem("checkout_redirect");
          router.push(redirectTo);
        }else{
          router.push("/dashboard");
        }
    }

  } catch (err: any) {
    const msg =
      err?.response?.data?.message ||
      "Invalid email or password";
    setError(msg);
    toast.error("Sign in failed", { description: msg });
  } finally {
    setLoading(false);
  }
};

const handleSocialLogin = (provider: "google" | "github") => {
  window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/${provider}/redirect`;
};

  const handleClose = () => {
    closeSignIn();
    reset();
    setError("");
  };

  const handleSwitchToSignUp = () => {
    switchToSignUp();
    reset();
    setError("");
  };

  const { fetchWishlist } = useWishlistStore();
  return (
    <Dialog open={signInOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden gap-0">

        {/* Top brand strip */}
        <div className="bg-brand/5 border-b border-border px-6 pt-6 pb-5">
          <DialogHeader>
            {/* Icon */}
            <div className="mx-auto mb-3 w-12 h-12 rounded-2xl bg-brand flex items-center justify-center shadow-lg shadow-brand/25">
              <Mail className="h-5 w-5 text-white" />
            </div>
            <DialogTitle className="text-center text-xl font-bold text-foreground">
              Welcome back
            </DialogTitle>
            <DialogDescription className="text-center text-sm text-muted-foreground">
              Sign in to access your dashboard &amp; purchases
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 flex rounded-lg border border-border bg-background p-1 gap-1">
            <button className="flex-1 py-1.5 text-sm font-semibold rounded-md bg-foreground text-background transition-colors">
              Sign In
            </button>
            <button
              onClick={handleSwitchToSignUp}
              className="flex-1 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground rounded-md transition-colors"
            >
              Sign Up
            </button>
          </div>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" size="sm" className="h-9 text-sm font-medium gap-2" type="button" onClick={() => handleSocialLogin("google")}>
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </Button>
           <Button variant="outline" size="sm" className="h-9 text-sm font-medium gap-2" type="button" onClick={() => handleSocialLogin("github")}>
              <FaGithub className="h-4 w-4" />
              GitHub
            </Button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">
              or continue with email
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="signin-email" className="text-sm font-medium">
                Email address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="signin-email"
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

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="signin-password" className="text-sm font-medium">
                  Password
                </Label>
                <button
                  type="button"
                  className="text-xs text-brand hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="signin-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={cn(
                    "pl-9 pr-10 h-10",
                    errors.password && "border-destructive focus-visible:ring-destructive"
                  )}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* API Error */}
            {error && (
              <div className="rounded-md bg-destructive/10 border border-destructive/20 px-3 py-2">
                <p className="text-xs text-destructive">{error}</p>
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-10 bg-brand hover:bg-brand-hover text-white font-semibold rounded-lg gap-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Footer */}
          <p className="text-center text-xs text-muted-foreground pb-1">
            By signing in you agree to our{" "}
            <a href="/terms" className="text-brand hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-brand hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}