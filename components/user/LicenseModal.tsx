"use client";

import { X, Key, ShieldCheck, Copy, Check, Download, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { type Order } from "@/store/orderStore";
import { cn } from "@/lib/utils";

interface LicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

export default function LicenseModal({ isOpen, onClose, order }: LicenseModalProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  if (!isOpen || !order) return null;

  const handleCopy = (key: string, itemId: string) => {
    navigator.clipboard.writeText(key);
    setCopiedId(itemId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-background border border-border w-full max-w-lg rounded-2xl p-6 shadow-xl relative z-10 animate-in fade-in zoom-in-95 duration-150">
        
        <button onClick={onClose} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-brand/10 flex items-center justify-center text-brand">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-foreground">Licenses & Downloads</h3>
            <p className="text-xs text-muted-foreground">Order ID: {order.orderId}</p>
          </div>
        </div>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {order.items && order.items.length > 0 ? (
            order.items.map((item) => {
              const hasLicense = !!item.licenseKey;
              
              return (
                <div key={item.id} className="p-4 bg-muted/40 rounded-xl border border-border space-y-3 text-xs">
                  {/* Title & Metadata Headers */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-sm text-foreground">{item.product_title}</p>
                      <p className="text-muted-foreground text-[11px] mt-0.5 capitalize">
                        {item.plan_name ?? "Standard"} Plan 
                        {item.isSubscription ? ` — Subscription (${item.subscriptionPeriod})` : " — Lifetime License"}
                      </p>
                    </div>

                    {/* Status Badge */}
                    {hasLicense && (
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider",
                        item.licenseStatus === "active"   && "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
                        item.licenseStatus === "expired"  && "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
                        item.licenseStatus === "revoked"  && "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                      )}>
                        {item.licenseStatus}
                      </span>
                    )}
                  </div>

                  {/* License Key Actions Row */}
                  {hasLicense ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 bg-background border border-border rounded-lg p-2 font-mono text-[11px] text-foreground">
                        <Key className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <span className="flex-1 select-all truncate">{item.licenseKey}</span>
                        <button 
                          onClick={() => handleCopy(item.licenseKey!, item.id)} 
                          className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {copiedId === item.id ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                      
                      {item.expiresAt && (
                        <p className="text-[10px] text-muted-foreground pl-1">
                          License Valid Until: <span className="font-medium text-foreground">{item.expiresAt}</span>
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] bg-background/50 p-2 rounded-lg border border-dashed">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                      <span>No activation license key required for this product.</span>
                    </div>
                  )}

                  {/* Software Version & File Downloads */}
                  <div className="flex items-center justify-between gap-4 pt-2 border-t border-border/60">
                    {item.softwareVersion && (
                      <span className="text-[11px] text-muted-foreground">
                        Version: <strong className="text-foreground font-medium">{item.softwareVersion}</strong>
                      </span>
                    )}

                    {item.downloadableFile ? (
                      <a 
                        href={item.downloadableFile} 
                        download
                        target="_blank"
                        rel="noreferrer"
                        className="ml-auto flex items-center gap-1 text-xs text-brand font-semibold hover:underline"
                      >
                        <Download className="h-3.5 w-3.5" /> Download Software File
                      </a>
                    ) : (
                      <span className="text-[11px] text-muted-foreground italic ml-auto">No downloadable file attached</span>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-xs text-muted-foreground italic py-4 text-center">No order contents available.</p>
          )}
        </div>

      </div>
    </div>
  );
}