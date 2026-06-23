import Link from "next/link";
import { XIcon, Mail, Phone, MapPin } from "lucide-react";
import {
  FaLinkedin,
  FaGithub,
  FaYoutube,
} from "react-icons/fa";
import Image from "next/image";
const footerLinks = {
  Products: [
    { label: "SaaS Solutions", href: "/store?category=saas" },
    { label: "JS Premium", href: "/store?category=js" },
    { label: "Custom Development", href: "/about#custom" },
    { label: "Maintenance", href: "/support#maintenance" },
    { label: "APIs", href: "/store?category=api" },
    { label: "Third Party", href: "/store?category=third-party" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Pricing", href: "/pricing" },
    { label: "Careers", href: "/careers" },
    { label: "Press", href: "/press" },
    { label: "Contact", href: "/support#contact" },
  ],
  Support: [
    { label: "Help Center", href: "/support" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Refund Policy", href: "/refund" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};

const socials = [
  { icon: XIcon, href: "#", label: "Twitter" },
  { icon: FaLinkedin, href: "#", label: "LinkedIn" },
  { icon: FaGithub, href: "#", label: "GitHub" },
  { icon: FaYoutube, href: "#", label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      {/* CTA Banner */}
      <div className="bg-brand text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            Ready to transform your business?
          </h2>
          <p className="text-white/80 mb-6 text-sm sm:text-base">
            Join thousands of businesses already using our platform.
            <br className="hidden sm:block" /> Start your journey today.
          </p>
          <Link
            href="/store"
            className="inline-flex items-center px-6 py-3 bg-white text-brand font-semibold rounded-full hover:bg-white/90 transition-colors text-sm"
          >
            Explore Products
          </Link>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg  flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="JainSoftware Logo"
                  width={32}
                  height={32}
                  className="rounded-lg"
                />
              </div>
              <span className="font-bold text-lg tracking-tight">
                Jain <span className="text-brand">Software</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5 max-w-xs">
              Professional software and services for global brands. Modernizing how
              service and B2B brands sell, operate, and grow.
            </p>
            <div className="space-y-2">
              <a
                href="mailto:contact@jain.software"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="h-4 w-4 text-brand" />
                contact@jain.software
              </a>
              <a
                href="tel:+91XXXXXXXXXX"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Phone className="h-4 w-4 text-brand" />
                +91 XXXXXXXXXX
              </a>
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-brand" />
                Raipur, Chattisgarh, India
              </span>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-foreground mb-4">{title}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} JainSoftware. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {socials.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}