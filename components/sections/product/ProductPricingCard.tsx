"use client";

import { ShoppingCart, Zap, MessageCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProductDetailStore, type PricingPlan } from "@/store/productDetailsStore";
import { useCartStore } from "@/store/cartStore";
import type { ProductDetail } from "@/store/productDetailsStore";
import { cn } from "@/lib/utils";

type Props = { product: ProductDetail };

export default function ProductPricingCard({ product }: Props) {
  const { selectedPlan, setSelectedPlan } = useProductDetailStore();
  const addItem = useCartStore((s) => s.addItem);

  const activePlan = product.plans.find((p) => p.id === selectedPlan) ?? product.plans[0];

  const handleAddToCart = () => {
    if (!activePlan) return;
    addItem({
      id: `${product.id}-${activePlan.id}`,
      name: `${product.name} (${activePlan.name})`,
      price: activePlan.price,
      image: product.images[0] ?? "",
      slug: product.slug,
    });
  };

  return (
    <div className="bg-white dark:bg-background border border-border rounded-2xl p-5 space-y-3 lg:sticky lg:top-20 shadow-sm">
      <h3 className="font-bold text-foreground text-base">Choose Your Plan</h3>

      {/* Plan options */}
      <div className="space-y-2">
        {product.plans.map((plan) => (
          <PlanOption
            key={plan.id}
            plan={plan}
            selected={(selectedPlan || product.plans[0]?.id) === plan.id}
            onSelect={() => setSelectedPlan(plan.id)}
          />
        ))}
      </div>

      {/* Add to Cart */}
      <Button
        onClick={handleAddToCart}
        className="w-full h-11 bg-brand hover:bg-brand-hover text-white font-semibold rounded-xl gap-2 mt-1"
      >
        <ShoppingCart className="h-4 w-4" />
        Add to Cart
      </Button>

      {/* Buy Now */}
      <Button
        variant="outline"
        className="w-full h-11 font-semibold rounded-xl gap-2 border-brand text-brand hover:bg-brand hover:text-white"
      >
        <Zap className="h-4 w-4" />
        Buy Now
      </Button>

      {/* Specialist */}
      <div className="text-center pt-1">
        <a href="/support"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-brand transition-colors">
          <MessageCircle className="h-3.5 w-3.5" />
          Not sure? <span className="text-brand font-medium">Connect with a Specialist</span>
        </a>
      </div>
    </div>
  );
}

function PlanOption({ plan, selected, onSelect }: {
  plan: PricingPlan;
  selected: boolean;
  onSelect: () => void;
}) {
  const savings = plan.originalPrice
    ? Math.round(((plan.originalPrice - plan.price) / plan.originalPrice) * 100)
    : null;

  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full text-left rounded-xl border-2 p-3.5 transition-all",
        selected
          ? "border-brand bg-brand/5"
          : "border-border bg-background hover:border-brand/40"
      )}
    >
      {/* Badge */}
      {savings && (
        <div className="mb-1.5">
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand text-white">
            SAVE {savings}%
          </span>
        </div>
      )}

      <div className="flex items-center justify-between gap-2">
        {/* Left: radio + name + features */}
        <div className="flex items-start gap-2.5">
          <div className={cn(
            "w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5",
            selected ? "border-brand" : "border-muted-foreground/40"
          )}>
            {selected && <div className="w-2 h-2 rounded-full bg-brand" />}
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{plan.name}</p>
            <div className="mt-1 space-y-0.5">
              {plan.features.map((f) => (
                <p key={f} className="text-xs text-muted-foreground flex items-center gap-1">
                  <Check className="h-3 w-3 text-brand shrink-0" />
                  {f}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Right: price */}
        <div className="text-right shrink-0">
          <p className="text-base font-bold text-foreground">
            ₹{plan.price.toLocaleString("en-IN")}
            <span className="text-xs font-normal text-muted-foreground">
              /{plan.period?.toLowerCase() === "monthly" ? "mo" : "yr"}
            </span>
          </p>
          {plan.originalPrice && (
            <p className="text-[11px] text-muted-foreground line-through">
              ₹{plan.originalPrice.toLocaleString("en-IN")}/{plan.period?.toLowerCase() === "monthly" ? "mo" : "yr"}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}