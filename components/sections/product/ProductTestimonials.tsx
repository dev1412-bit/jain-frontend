import type { Testimonial } from "@/store/productDetailsStore";
import { Star } from "lucide-react";
import Link from "next/link";

type Props = { testimonials: Testimonial[] };
export default function ProductTestimonials({ testimonials }: Props) {
  // Helper to extract the first letter safely
  const getInitials = (name: string) => {
    return name ? name.trim().charAt(0).toUpperCase() : "?";
  };

  // ─── FIXED: Slice the array to show only the first 3 items on the frontend ───
  const displayTestimonials = testimonials.slice(0, 3);

  return (
    <div className="py-8 border-t border-border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-foreground">Testimonials</h2>
        <Link href="#" className="text-xs text-brand hover:underline">
          View More
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {displayTestimonials.map((t: any) => (
          <div key={t.id} className="bg-background border border-border rounded-2xl p-5 space-y-3">
            {/* Stars */}
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${i < t.rating ? "fill-brand text-brand" : "text-border"}`}
                />
              ))}
            </div>

            {/* Text - mapped from 'review' */}
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-4">
              &ldquo;{t.review}&rdquo;
            </p>

            {/* Author */}
            <div className="flex items-center gap-2 pt-1">
              <div className="w-7 h-7 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-[10px] font-bold shrink-0 uppercase">
                {t.avatar || getInitials(t.name)}
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">{t.name}</p>
                <p className="text-[11px] text-muted-foreground">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}