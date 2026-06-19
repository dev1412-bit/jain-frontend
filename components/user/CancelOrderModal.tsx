"use client";

import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOrderStore } from "@/store/orderStore";
import { cn } from "@/lib/utils";

type Props = {
  open:    boolean;
  onClose: () => void;
  orderId: string;
  orderUuid: string;
};

export default function CancelOrderModal({ open, onClose, orderId, orderUuid }: Props) {
  const { cancelOrder } = useOrderStore();
  const [cancelling, setCancelling] = useState(false);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      await cancelOrder(orderId);
      onClose();
    } catch {
      // error handled in store
    } finally {
      setCancelling(false);
    }
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="bg-background border border-border rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-5">

          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-base">Cancel Order</h3>
                <p className="text-xs text-muted-foreground font-mono">{orderUuid}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full hover:bg-accent flex items-center justify-center"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-3">
            <p className="text-sm text-foreground">
              Are you sure you want to cancel this order?
            </p>
            <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-3 space-y-1">
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">
                Please note:
              </p>
              <ul className="text-xs text-amber-600 dark:text-amber-500 space-y-0.5 list-disc list-inside">
                <li>This action cannot be undone</li>
                <li>Refund will be processed within 7 business days</li>
                <li>Amount will be credited to your original payment method</li>
              </ul>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 rounded-xl h-10 font-semibold"
            >
              Keep Order
            </Button>
            <Button
              onClick={handleCancel}
              disabled={cancelling}
              className="flex-1 rounded-xl h-10 font-semibold bg-red-500 hover:bg-red-600 text-white"
            >
              {cancelling ? "Cancelling..." : "Yes, Cancel"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}