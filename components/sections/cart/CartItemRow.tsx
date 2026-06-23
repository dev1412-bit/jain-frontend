"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore, type CartItem } from "@/store/cartStore";

type Props = { item: CartItem };

export default function CartItemRow({ item }: Props) {
  const { updateQuantity, removeItem } = useCartStore();

  return (
    <div className="flex items-center gap-4 bg-background border border-border rounded-2xl p-4">

      <div className="relative w-24 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand/10 to-brand/5">
            <span className="text-brand/30 text-lg font-bold">
              {item.name.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-foreground text-sm truncate">{item.name}</p>
        <p className="text-xs text-muted-foreground mt-0.5">SaaS</p>
        {/* Plan badge — extracted from name if contains parentheses */}
        {item.name.includes("(") && (
          <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-brand/10 text-brand">
            {item.name.match(/\(([^)]+)\)/)?.[1]}
          </span>
        )}
      </div>

      {/* Price */}
      <div className="text-sm font-semibold text-foreground shrink-0">
        ₹{item.price.toLocaleString("en-IN")}
        <span className="text-xs font-normal text-muted-foreground">
          {item.name.toLowerCase().includes("monthly") ? "/mo" :
           item.name.toLowerCase().includes("yearly")  ? "/yr" : ""}
        </span>
      </div>

      {/* Qty controls */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
          className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-accent transition-colors"
        >
          <Minus className="h-3 w-3 text-foreground" />
        </button>
        <span className="text-sm font-medium text-foreground w-4 text-center">
          {item.quantity}
        </span>
        <button
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-accent transition-colors"
        >
          <Plus className="h-3 w-3 text-foreground" />
        </button>
      </div>

      {/* Delete */}
      <button
        onClick={() => removeItem(item.id)}
        className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}