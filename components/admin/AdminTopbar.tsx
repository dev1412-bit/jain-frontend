"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Search, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import NotificationBell from "@/components/NotificationBell";
import Image from "next/image";

export default function AdminTopbar() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { logout } = useAuthStore();
  const router = useRouter();
  useEffect(() => setMounted(true), []);

  return (
    <header className="h-14 border-b border-border bg-background flex items-center px-6 gap-4 shrink-0">

      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 shrink-0">
        {/* <div className="w-7 h-7 rounded-lg bg-brand flex items-center justify-center text-white font-bold text-xs">
          J
        </div> */}
        <Image
            src="/logo.png"
            alt="JainSoftware Logo"
            width={32}
            height={32}
            className="rounded-lg object-contain"
          />
      </Link>

      {/* Nav links — center */}
      <nav className="hidden md:flex items-center gap-10 text-sm text-muted-foreground mx-auto">
        {["Home", "Store", "About", "Support", "Blog"].map((l) => (
          <Link key={l}  href={l === "Home" ? "/" : `/${l.toLowerCase()}`}  className="hover:text-foreground transition-colors">
            {l}
          </Link>
        ))}
      </nav>

      {/* Right actions */}
      <div className="flex items-center gap-4 ml-auto">
        <Button variant="ghost" size="icon">
          <Search className="h-4 w-4" />
        </Button>
      <Link href="/cart">
        <Button variant="ghost" size="icon">
          {/* Cart icon placeholder */}
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.962-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
          </svg>
        </Button>
      </Link>
        <NotificationBell />
        <Button variant="ghost" size="icon" onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
          {mounted && resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
       

        
        <Button size="sm" className="bg-brand hover:bg-brand-hover text-white rounded-full px-4 text-sm font-medium"   onClick={async () => {
                      await logout();
                      toast.success("Signed out successfully");
                      router.push("/");
                    }}>
          Logout
        </Button>
      </div>
    </header>
  );
}