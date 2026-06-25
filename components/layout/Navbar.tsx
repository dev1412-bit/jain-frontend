"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useProductStore } from "@/store/productStore";
import {
  Sun,
  Moon,
  ShoppingCart,
  Search,
  Menu,
  X,
  ChevronDown,
  User,
  LayoutDashboard,
  LogOut,
  Settings,
  Package,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useUIStore } from "@/store/uiStore";
import { cn } from "@/lib/utils";

const guestLinks = [
  { label: "Home", href: "/" },
  { label: "Store", href: "/store" },
  { label: "About", href: "/about" },
  { label: "Support", href: "/support" },
  { label: "Blog", href: "/blog" },
];

export default function Navbar() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { user, role, logout } = useAuthStore();
  const cartCount = useCartStore((s) => s.items.length);
  const { openSignIn, openSignUp } = useUIStore();
  const router = useRouter();
const setSearch = useProductStore((s) => s.setSearch);
const [searchOpen, setSearchOpen] = useState(false);
const [searchValue, setSearchValue] = useState("");

const handleSearch = (e: React.FormEvent) => {
  e.preventDefault();
  const trimmed = searchValue.trim();
  if (!trimmed) return;
  setSearch(trimmed);
  router.push(`/store?search=${encodeURIComponent(trimmed)}`);
  setSearchOpen(false);
  setSearchValue("");
};

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () =>
    setTheme(resolvedTheme === "dark" ? "light" : "dark");

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-background border-b border-border"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6">
        <div className="flex items-center justify-between h-16">

          {/* ── LEFT: Logo ── */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image
              src="/logo.png"
              alt="JainSoftware Logo"
              width={32}
              height={32}
              className="rounded-lg"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </Link>

          {/* ── CENTER: Desktop Nav ── */}
          <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {guestLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* ── RIGHT: Actions + Sign In ── */}
          <div className="flex items-center gap-1.5">

           {/* Search */}
            <div className="hidden sm:block">
              {searchOpen ? (
                <form onSubmit={handleSearch} className="relative flex items-center">
                  <Search className="absolute left-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                  <input
                    autoFocus
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onBlur={() => setSearchOpen(false)}
                    onKeyDown={(e) => { if (e.key === "Escape") setSearchOpen(false); }}
                    placeholder="Search products..."
                    className="w-44 h-9 pl-8 pr-3 text-sm rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-brand/30 transition-all"
                  />
                </form>
              ) : (
                <Button variant="ghost" size="icon" className="text-foreground" onClick={() => setSearchOpen(true)}>
                  <Search className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative text-foreground">
                <ShoppingCart className="h-4 w-4" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-brand text-white border-0">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>

            <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-foreground">
              {mounted && resolvedTheme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

            {!user ? (
              <Button
                size="sm"
                onClick={openSignIn}
                className="hidden sm:flex bg-brand hover:bg-brand-hover text-white rounded-full px-5 text-sm font-medium"
              >
                Sign In
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <div className="w-7 h-7 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center">
                      <User className="h-3.5 w-3.5 text-brand" />
                    </div>
                    <ChevronDown className="h-3 w-3 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {role === "admin" ? (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="flex items-center gap-2">
                          <LayoutDashboard className="h-4 w-4" />
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/admin/settings"
                          className="flex items-center gap-2"
                        >
                          <Settings className="h-4 w-4" />
                          Settings
                        </Link>
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-2"
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/dashboard/orders"
                          className="flex items-center gap-2"
                        >
                          <Package className="h-4 w-4" />
                          My Orders
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/dashboard/profile"
                          className="flex items-center gap-2"
                        >
                          <User className="h-4 w-4" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/dashboard/settings"
                          className="flex items-center gap-2"
                        >
                          <Settings className="h-4 w-4" />
                          Settings
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={async () => {
                      await logout();
                      toast.success("Signed out successfully");
                    }}
                    className="text-destructive focus:text-destructive flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-foreground"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-4 py-3 space-y-1">
            {guestLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {!user && (
              <div className="pt-2 pb-1 flex flex-col gap-2 border-t border-border mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    openSignIn();
                    setMobileOpen(false);
                  }}
                  className="w-full"
                >
                  Sign In
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    openSignUp();
                    setMobileOpen(false);
                  }}
                  className="w-full bg-brand hover:bg-brand-hover text-white"
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}