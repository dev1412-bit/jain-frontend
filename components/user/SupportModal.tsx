"use client";

import { X, Headphones, Mail, ExternalLink, MessageSquare } from "lucide-react";
import { type Order } from "@/store/orderStore";

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

export default function SupportModal({ isOpen, onClose, order }: SupportModalProps) {
  // If the modal isn't open or there's no order selected, don't render anything
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop Blur/Overlay */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm" 
        onClick={onClose} 
      />

      {/* Modal Box */}
      <div className="bg-background border border-border w-full max-w-md rounded-2xl p-6 shadow-xl relative z-10 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header Icon & Title */}
        <div className="flex items-center gap-3 mb-5">
          <div className="h-10 w-10 rounded-xl bg-brand/10 flex items-center justify-center text-brand">
            <Headphones className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-foreground">Get Order Support</h3>
            <p className="text-xs text-muted-foreground">Assistance for Ticket #{order.orderId}</p>
          </div>
        </div>

        {/* Support Action Options */}
        <div className="space-y-3">
          
          {/* Option 1: Email Support Link */}
          <a 
            href={`mailto:support@jain.software?subject=Support Request for Order ${order.orderId}`}
            className="flex items-center gap-3 p-3 rounded-xl border border-border bg-background hover:bg-muted/40 text-left transition-colors text-xs text-foreground group"
          >
            <Mail className="h-4 w-4 text-muted-foreground group-hover:text-brand transition-colors" />
            <div className="flex-1">
              <p className="font-semibold">Email Customer Helpdesk</p>
              <p className="text-muted-foreground text-[11px] mt-0.5">Response expected within 12–24 hours</p>
            </div>
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
          </a>

          {/* Option 2: Technical Ticket System Button */}
          <button 
            onClick={() => {
              // Add your ticket system routing or alert system logic here if needed
              alert(`Opening ticket creation workflow for Order: ${order.orderId}`);
            }}
            className="w-full flex items-center gap-3 p-3 rounded-xl border border-border bg-background hover:bg-muted/40 text-left transition-colors text-xs text-foreground group"
          >
            <MessageSquare className="h-4 w-4 text-muted-foreground group-hover:text-brand transition-colors" />
            <div className="flex-1">
              <p className="font-semibold">Open Technical Ticket</p>
              <p className="text-muted-foreground text-[11px] mt-0.5">Links your purchase records straight to live agents</p>
            </div>
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
          </button>

        </div>
      </div>
    </div>
  );
}