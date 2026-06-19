"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = { images: string[]; name: string };

export default function ProductImageSlider({ images, name }: Props) {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-muted border border-border group">
        <img
            src={images[current]}
            alt={`${name} screenshot ${current + 1}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Arrows — only show if more than 1 image */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-background"
            >
              <ChevronLeft className="h-4 w-4 text-foreground" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-background"
            >
              <ChevronRight className="h-4 w-4 text-foreground" />
            </button>
          </>
        )}
      </div>

      {/* Dot indicators */}
      {images.length > 1 && (
        <div className="flex items-center justify-center gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={cn(
                "rounded-full transition-all",
                current === i
                  ? "w-4 h-1.5 bg-brand"
                  : "w-1.5 h-1.5 bg-border hover:bg-muted-foreground"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}