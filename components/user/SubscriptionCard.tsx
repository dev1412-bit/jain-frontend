"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar, Key, RefreshCw, X,
  AlertTriangle, CheckCircle, Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSubscriptionStore, type Subscription } from "@/store/subscriptionStore";
import { cn } from "@/lib/utils";

const statusStyle = {
  active:  "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
  expired: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-500",
  revoked: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
};

const statusIcon = {
  active:  CheckCircle,
  expired: Clock,
  revoked: X,
};

type Props = { subscription: Subscription };

export default function SubscriptionCard({ subscription: sub }: Props) {
  const { cancelSubscription, renewSubscription } = useSubscriptionStore();
  const [cancelling, setCancelling] = useState(false);
  const [renewing, setRenewing]     = useState(false);

  const StatusIcon = statusIcon[sub.licenseStatus];

  const handleCancel = async () => {
    if (!confirm(`Cancel subscription for ${sub.productTitle}? This cannot be undone.`)) return;
    setCancelling(true);
    try { await cancelSubscription(sub.id); }
    finally { setCancelling(false); }
  };

  const handleRenew = async () => {
    setRenewing(true);
    try { await renewSubscription(sub.id); }
    finally { setRenewing(false); }
  };

  return (
    <div className={cn(
      "bg-background border rounded-2xl p-5 space-y-4 transition-all",
      sub.isExpiringSoon ? "border-yellow-300 dark:border-yellow-500/40" : "border-border",
      sub.licenseStatus === "revoked" && "opacity-60"
    )}>

      {/* Top row: product info + price + manage button */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Product icon */}
          <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center shrink-0">
            <span className="text-brand font-bold text-sm">
              {sub.productTitle.slice(0, 2).toUpperCase()}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold text-foreground text-sm">{sub.productTitle}</p>
              {/* Status badge */}
              <span className={cn(
                "flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold",
                statusStyle[sub.licenseStatus]
              )}>
                <StatusIcon className="h-3 w-3" />
                {sub.licenseStatus}
              </span>
              {/* Version */}
              {sub.softwareVersion && (
                <span className="px-2 py-0.5 rounded-full text-[11px] bg-muted text-muted-foreground">
                  v{sub.softwareVersion}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {sub.planName} · Renews {sub.expiresAtFormatted ?? "—"}
            </p>
          </div>
        </div>

        {/* Price + Manage */}
        <div className="text-right shrink-0">
          <p className="font-bold text-foreground">
            ₹{sub.totalPrice.toLocaleString("en-IN")}.00
          </p>
          <p className="text-xs text-muted-foreground">per year</p>
          <Button
            size="sm"
            onClick={sub.licenseStatus === "revoked" ? handleRenew : handleRenew}
            disabled={renewing}
            className="mt-2 h-7 px-3 text-xs bg-brand hover:bg-brand-hover text-white rounded-lg"
          >
            {renewing ? "..." : "Manage"}
          </Button>
        </div>
      </div>

      {/* Expiry warning */}
      {sub.isExpiringSoon && sub.licenseStatus === "active" && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20">
          <AlertTriangle className="h-3.5 w-3.5 text-yellow-600 dark:text-yellow-400 shrink-0" />
          <p className="text-xs text-yellow-700 dark:text-yellow-400">
            Expires in {sub.renewsIn} days — renew now to avoid interruption
          </p>
        </div>
      )}

      {/* Feature pills */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <CheckCircle className="h-3 w-3 text-brand" /> Full access
        </span>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <CheckCircle className="h-3 w-3 text-brand" /> Priority support
        </span>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <CheckCircle className="h-3 w-3 text-brand" /> {sub.quantity} license{sub.quantity > 1 ? "s" : ""}
        </span>
      </div>

      {/* License key */}
      {sub.licenseKey && (
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/40 border border-border">
          <Key className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <code className="text-xs text-foreground font-mono flex-1 truncate">{sub.licenseKey}</code>
          <button
            onClick={() => { navigator.clipboard.writeText(sub.licenseKey!); }}
            className="text-xs text-brand hover:underline shrink-0"
          >
            Copy
          </button>
        </div>
      )}

      {/* Footer: cancel button */}
      {sub.licenseStatus === "active" && (
        <div className="flex items-center justify-between pt-1 border-t border-border">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            Renews {sub.expiresAtFormatted ?? "—"}
          </div>
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="text-xs text-muted-foreground hover:text-destructive transition-colors"
          >
            {cancelling ? "Cancelling..." : "Cancel"}
          </button>
        </div>
      )}
    </div>
  );
}