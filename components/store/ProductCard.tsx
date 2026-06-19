"use client";

import Link from "next/link";
import { ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import type { Product } from "@/store/productStore";
import { cn } from "@/lib/utils";
import { useWishlistStore } from "@/store/wishlistStore";
import { useAuthStore } from "@/store/authStore";
import {toast} from 'sonner';

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  // const [wished, setWished] = useState(false);
const {toggleWishlist, isWishlisted} = useWishlistStore();
const {user} = useAuthStore();
const wished =  isWishlisted(product.id); 
  const name      = product.title;
  const price     = product.basePrice;
  const image     = product.media?.[0]?.url ?? null;
  const slug      = product.slug;
  const tagline   = product.description ?? "";
  // const lowestPlan = product.pricingPlans?.length
  //   ? Math.min(...product.pricingPlans.map((p) => p.price))
  //   : null;
  const displayPrice = product.emiPrice ?? price;
  const handleAddToCart = () => {
     addItem({
      id: product.id,
      name,
      price: displayPrice,
      image: image ?? "",
      slug,
    });
  };

  const handleWishlist = async () =>  {
    if(!user) {
      toast.error("Please sign in to add to wishlist");
      return;
    }
    await toggleWishlist(product.id);
  }


  return (
    <div className="group relative flex flex-col bg-background border border-border rounded-2xl overflow-hidden hover:shadow-lg hover:border-brand/20 transition-all duration-200">

      {/* Wishlist */}
      <button
        onClick={handleWishlist}
        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/80 dark:bg-background/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
      >
        <Heart className={cn("h-4 w-4 transition-colors", wished ? "fill-brand text-brand" : "text-muted-foreground")} />
      </button>

      <Link
        href={`/store/${slug}`}
        className="block overflow-hidden bg-muted aspect-[4/3]"
        aria-label={`View ${name}`}
      >
        {image ? (
          <div
            className="h-full w-full bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
            style={{ backgroundImage: `url(${image})` }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand/10 to-brand/5">
            <span className="text-brand/30 text-4xl font-bold">{name.charAt(0)}</span>
          </div>
        )}
      </Link>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div>
          <Link href={`/store/${slug}`}>
            <h3 className="font-semibold text-foreground text-sm sm:text-base hover:text-brand transition-colors line-clamp-1">
              {name}
            </h3>
          </Link>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{tagline}</p>
        </div>

        {/* Pricing */}
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-bold text-foreground">
            ₹{displayPrice.toLocaleString("en-IN")}
          </span>
          {product.pricingPlans?.length ? (
            <span className="text-xs text-muted-foreground">/ month</span>
          ) : null}
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto pt-1">
          <Button asChild variant="outline" size="sm" className="flex-1 rounded-full text-xs font-medium h-9">
            <Link href={`/store/${slug}`}>Learn More</Link>
          </Button>
          <Button size="sm" onClick={handleAddToCart}
            className="flex-1 rounded-full text-xs font-medium h-9 bg-brand hover:bg-brand-hover text-white gap-1.5">
            <ShoppingCart className="h-3.5 w-3.5" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
