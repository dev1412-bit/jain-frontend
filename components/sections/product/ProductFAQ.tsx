"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── CHANGED: Accepting an array of any to match your generic CMS DB array structure ───
type Props = { faqs: any[] };

export default function ProductFAQ({ faqs }: Props) {
  const [open, setOpen] = useState<number | null>(null);

  // ─── FIXED: Slice to show a clean maximum of 5 FAQs on the frontend ───
  const displayFaqs = faqs.slice(0, 5);

  return (
    <div className="py-8 border-t border-border">
      <h2 className="text-lg font-bold text-foreground mb-5">FAQs</h2>

      <div className="space-y-2">
        {displayFaqs.map((faq, i) => (
          <div key={i} className="border border-border rounded-xl overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left text-sm font-medium text-foreground hover:bg-accent transition-colors"
            >
              {/* Uses your DB column 'question' */}
              {faq.question} 
              <ChevronDown className={cn(
                "h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200",
                open === i && "rotate-180"
              )} />
            </button>
            
            {open === i && (
              <div className="px-5 pb-4 pt-2 text-sm text-muted-foreground leading-relaxed border-t border-border">
                {/* Uses your DB column 'answer' */}
                {faq.answer} 
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}