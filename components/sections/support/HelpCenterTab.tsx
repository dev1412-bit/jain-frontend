"use client";

import { useState } from "react";
import {
  MessageCircle, Mail, Phone, Headphones,
  BookOpen, Zap, Users, Clock, ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

const supportChannels = [
  {
    icon: MessageCircle,
    iconColor: "text-pink-500",
    iconBg: "bg-pink-50 dark:bg-pink-500/10",
    title: "Live Chat",
    description: "Chat with our support team in real-time",
    hours: "Mon-Sat, 9am-8pm IST",
    action: "Start Chat",
    actionStyle: "border border-brand text-brand hover:bg-brand hover:text-white",
  },
  {
    icon: Mail,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-50 dark:bg-blue-500/10",
    title: "Email Support",
    description: "Send us a detailed message, we reply within 24 hrs",
    hours: "24/7 inbox, replies within 24 hrs",
    action: "Send Email",
    actionStyle: "border border-blue-400 text-blue-500 hover:bg-blue-500 hover:text-white",
  },
  {
    icon: Phone,
    iconColor: "text-teal-500",
    iconBg: "bg-teal-50 dark:bg-teal-500/10",
    title: "Phone Support",
    description: "Speak directly with a specialist",
    hours: "Mon-Fri, 10am-5pm IST",
    action: "Call Now",
    actionStyle: "border border-teal-400 text-teal-500 hover:bg-teal-500 hover:text-white",
  },
  {
    icon: Headphones,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-50 dark:bg-amber-500/10",
    title: "Priority Support",
    description: "Dedicated support for Enterprise customers",
    hours: "24/7 dedicated line",
    action: "Upgrade Plan",
    actionStyle: "border border-amber-400 text-amber-500 hover:bg-amber-500 hover:text-white",
  },
];

const resources = [
  { icon: BookOpen, iconBg: "bg-pink-50 dark:bg-pink-500/10", iconColor: "text-pink-500", count: "150+ articles", title: "Documentation", desc: "Detailed guides for all products" },
  { icon: Zap,      iconBg: "bg-brand/10",                    iconColor: "text-brand",     count: "20+ guides",   title: "Quick Start Guides", desc: "Get up and running in minutes" },
  { icon: Users,    iconBg: "bg-purple-50 dark:bg-purple-500/10", iconColor: "text-purple-500", count: "5,000+ members", title: "Community Forum", desc: "Learn from other users" },
];

const faqCategories = ["All", "Billing & Payments", "Licenses", "Technical", "Products", "Account"];

const faqs = [
  { category: "All", q: "How do I get my license key after purchase?", a: "After a successful purchase, your license key is sent immediately to your registered email address. You can also find it in your User Dashboard under Downloads & Licenses." },
  { category: "All", q: "What is your refund policy?", a: "We offer a 30-day money-back guarantee on all products. If you're not satisfied, contact our support team and we'll process your refund within 5-7 business days." },
  { category: "All", q: "Can I use the software on multiple devices?", a: "Each license allows installation on up to 3 devices. If you need more, you can purchase additional licenses or contact us for an enterprise plan." },
  { category: "Billing & Payments", q: "What payment methods do you accept?", a: "We accept all major credit cards, UPI, net banking, and PayPal. All transactions are secured with SSL encryption." },
  { category: "Technical", q: "How do I get technical support?", a: "You can raise a support ticket from the New Ticket tab, use live chat, or email us. Our technical team typically responds within 4 hours on business days." },
];

export default function HelpCenterTab() {
  const [activeFaqCat, setActiveFaqCat] = useState("All");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const filteredFaqs = faqs.filter(
    (f) => activeFaqCat === "All" || f.category === activeFaqCat
  );

  return (
    <div className="space-y-8">

      {/* Support Channel Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {supportChannels.map(({ icon: Icon, iconColor, iconBg, title, description, hours, action, actionStyle }) => (
          <div key={title} className="bg-background border border-border rounded-2xl p-5 flex flex-col gap-3">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", iconBg)}>
              <Icon className={cn("h-5 w-5", iconColor)} strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm">{title}</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{description}</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-auto">
              <Clock className="h-3 w-3" />
              {hours}
            </div>
            <button className={cn("w-full py-2 rounded-lg text-xs font-medium transition-colors", actionStyle)}>
              {action}
            </button>
          </div>
        ))}
      </div>

      {/* Resource Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {resources.map(({ icon: Icon, iconBg, iconColor, count, title, desc }) => (
          <div key={title} className="bg-background border border-border rounded-2xl p-5 flex items-start gap-4 hover:border-brand/30 transition-colors cursor-pointer">
            <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0", iconBg)}>
              <Icon className={cn("h-4 w-4", iconColor)} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{count}</p>
              <p className="text-sm font-semibold text-foreground">{title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div>
        <h2 className="text-xl font-bold text-foreground mb-4">
          Frequently Asked Questions
        </h2>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-5">
          {faqCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFaqCat(cat)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium border transition-colors",
                activeFaqCat === cat
                  ? "bg-brand text-white border-brand"
                  : "bg-background text-foreground border-border hover:bg-accent"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Accordion */}
        <div className="space-y-2">
          {filteredFaqs.map((faq, i) => (
            <div key={i} className="bg-background border border-border rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium text-foreground hover:bg-accent transition-colors"
              >
                {faq.q}
                <ChevronDown className={cn("h-4 w-4 text-muted-foreground shrink-0 transition-transform", openFaq === i && "rotate-180")} />
              </button>
              {openFaq === i && (
                <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}