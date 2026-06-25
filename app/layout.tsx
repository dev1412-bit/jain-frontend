import type { Metadata } from "next";
import { Inter, Geist, Geist_Mono, DM_Sans, Poppins, Nunito } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

import { ThemeProvider } from "@/components/layout/Themeprovider";
import SignInModal from "@/components/modals/signInModal";
import SignUpModal from "@/components/modals/signUpModal";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({ variable: "--font-mono", subsets: ["latin"] });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" });
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-poppins" }); // Poppins has no variable-weight file, needs explicit weights
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" });

export const metadata: Metadata = {
  title: "JainSoftware — Work Smarter, Scale Faster",
  description:
    "Professional software and services for global brands. Modernizing how service and B2B brands sell, operate, and grow.",
};

async function getPublicTheme() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/theme`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? null;
  } catch {
    return null;
  }
}

const FONT_VAR_MAP: Record<string, string> = {
  "Inter": "var(--font-inter)",
  "Geist": "var(--font-geist)",
  "DM Sans": "var(--font-dm-sans)",
  "Poppins": "var(--font-poppins)",
  "Nunito": "var(--font-nunito)",
  "SF Pro Display": '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
};

const RADIUS_MAP: Record<string, string> = {
  none: "0rem",
  small: "0.375rem",
  medium: "0.625rem",
  large: "1rem",
  full: "9999px",
};

function buildThemeOverrideCSS(theme: any): string {
  if (!theme) return "";

  const root: string[] = [];
  const dark: string[] = [];

  if (theme.primary_color)          root.push(`--brand: ${theme.primary_color};`);
  if (theme.secondary_color)        root.push(`--brand-secondary: ${theme.secondary_color};`);
  if (theme.accent_color)           root.push(`--brand-accent: ${theme.accent_color};`);
  if (theme.background_color)       root.push(`--background: ${theme.background_color};`);
  if (theme.text_color)             root.push(`--foreground: ${theme.text_color};`);
  if (theme.dark_background_color)  dark.push(`--background: ${theme.dark_background_color};`);

  const radius = RADIUS_MAP[theme.border_radius];
  if (radius) root.push(`--radius: ${radius};`);

  const fontVar = FONT_VAR_MAP[theme.font_family];
  if (fontVar) root.push(`--font-sans: ${fontVar};`);

  let css = "";
  if (root.length) css += `html:root { ${root.join(" ")} }\n`;
  if (dark.length) css += `html.dark { ${dark.join(" ")} }\n`;
  return css;
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const theme = await getPublicTheme();
  const siteDefault: "dark" | "light" = theme?.dark_mode_default ? "dark" : "light";
  const overrideCSS = buildThemeOverrideCSS(theme);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {overrideCSS && <style dangerouslySetInnerHTML={{ __html: overrideCSS }} />}
      </head>
      <body
        className={`${inter.variable} ${geist.variable} ${geistMono.variable} ${dmSans.variable} ${poppins.variable} ${nunito.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider attribute="class" defaultTheme={siteDefault} enableSystem={false} disableTransitionOnChange>
          {children}
          <SignInModal />
          <SignUpModal />
          <Toaster position="top-right" richColors />
        </ThemeProvider>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}