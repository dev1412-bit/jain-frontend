import Image from "next/image";
import { useCartStore } from "@/store/cartStore";

const GST_RATE = 0.18;

export default function CheckoutOrderPanel() {
  const { items, total } = useCartStore();

  const subtotal   = total();
  const gst        = +(subtotal * GST_RATE).toFixed(2);
  const grandTotal = +(subtotal + gst).toFixed(2);

  return (
    <div className="space-y-4">
      {/* Cart items */}
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-3">
          <div className="relative w-16 h-11 rounded-lg overflow-hidden bg-muted shrink-0 border border-border">
            <Image
              src={item.image || "https://placehold.co/64x44/1e1b4b/818cf8?text=P"}
              alt={item.name}
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{item.name.split("(")[0].trim()}</p>
            {item.name.includes("(") && (
              <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-brand/10 text-brand">
                {item.name.match(/\(([^)]+)\)/)?.[1]}
              </span>
            )}
          </div>
          <div className="text-right shrink-0">
            <p className="text-sm font-semibold text-foreground">
              ₹{item.price.toLocaleString("en-IN")}
              <span className="text-xs font-normal text-muted-foreground">
                {item.name.toLowerCase().includes("monthly") ? "/mo" :
                 item.name.toLowerCase().includes("yearly")  ? "/yr" : ""}
              </span>
            </p>
            <p className="text-xs text-muted-foreground">×{item.quantity}</p>
          </div>
        </div>
      ))}

      {/* Order Summary */}
      <div className="border-t border-border pt-4 space-y-2.5 text-sm">
        <h3 className="font-bold text-foreground">Order Summary</h3>
        <div className="flex justify-between text-foreground">
          <span>Subtotal</span>
          <span>₹{subtotal.toLocaleString("en-IN")}.00</span>
        </div>
        <div className="flex justify-between text-foreground">
          <span>GST (18%)</span>
          <span>₹{gst.toLocaleString("en-IN")}</span>
        </div>
        <div className="border-t border-border pt-2.5 flex justify-between font-bold text-base">
          <span className="text-foreground">Total</span>
          <span className="text-brand">₹{grandTotal.toLocaleString("en-IN")}</span>
        </div>
      </div>
    </div>
  );
}