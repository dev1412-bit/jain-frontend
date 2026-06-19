import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner"; 
import "./globals.css";

import { ThemeProvider } from "@/components/layout/Themeprovider";
import SignInModal from "@/components/modals/signInModal";
import SignUpModal from "@/components/modals/signUpModal";
import Script from "next/script";
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JainSoftware — Work Smarter, Scale Faster",
  description:
    "Professional software and services for global brands. Modernizing how service and B2B brands sell, operate, and grow.",
};

export default function RootLayout({   
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
        <body className={`${inter.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <SignInModal />
          <SignUpModal />
          <Toaster position="top-right" richColors />
        </ThemeProvider>
        <Script 
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}