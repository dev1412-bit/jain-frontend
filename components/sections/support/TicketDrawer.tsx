"use client";

import { X, Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SupportTicket } from "@/store/supportTicketStore";
import { useState } from "react";
import { useSupportStore } from "@/store/supportTicketStore";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  onClose: () => void;
  ticket: SupportTicket | null;
  isAdmin?: boolean;
};

const STATUS_OPTIONS = ["open", "pending", "resolved", "closed"];

export default function TicketDrawer({ open, onClose, ticket, isAdmin = false }: Props) {
  const { updateTicketStatus } = useSupportStore();
  const [newStatus, setNewStatus] = useState("");
  const [note,      setNote]      = useState("");
  const [saving,    setSaving]    = useState(false);

  if (!ticket) return null;

  const handleUpdate = async () => {
    if (!newStatus) return;
    setSaving(true);
    await updateTicketStatus(ticket.id, newStatus, note);
    setNewStatus("");
    setNote("");
    setSaving(false);
  };

  const priorityColor = (p: string) => ({
    low:    "bg-green-100 text-green-600",
    medium: "bg-yellow-100 text-yellow-600",
    high:   "bg-orange-100 text-orange-600",
    urgent: "bg-red-100 text-red-600",
  }[p] ?? "");

  const statusColor = (s: string) => ({
    open:     "bg-blue-100 text-blue-600",
    pending:  "bg-yellow-100 text-yellow-600",
    resolved: "bg-green-100 text-green-600",
    closed:   "bg-muted text-muted-foreground",
  }[s] ?? "");

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div className={cn(
        "fixed top-0 right-0 h-full w-full max-w-md bg-background border-l border-border z-50 flex flex-col transition-transform duration-300 shadow-2xl",
        open ? "translate-x-0" : "translate-x-full"
      )}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <div>
            <p className="font-bold text-foreground">{ticket.ticketId}</p>
            <p className="text-xs text-muted-foreground">{ticket.createdAt}</p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-accent flex items-center justify-center">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">

          {/* Ticket details */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground text-sm">{ticket.subject}</h3>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", statusColor(ticket.status))}>
                {ticket.status}
              </span>
              <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", priorityColor(ticket.priority))}>
                {ticket.priority}
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                {ticket.category}
              </span>
            </div>
          </div>

          {/* Submitter info */}
          <div className="bg-muted/30 rounded-xl p-4 space-y-1.5 text-sm">
            <p><span className="text-muted-foreground">Name:</span> <span className="font-medium">{ticket.name}</span></p>
            <p><span className="text-muted-foreground">Email:</span> <span className="font-medium">{ticket.email}</span></p>
          </div>

          {/* Message */}
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Message</p>
            <p className="text-sm text-foreground leading-relaxed bg-muted/20 rounded-xl p-4">
              {ticket.message}
            </p>
          </div>

          {/* Attachment */}
          {ticket.attachment && (
            <a href={ticket.attachment} target="_blank"
              className="flex items-center gap-2 text-xs text-brand hover:underline">
              View Attachment <ArrowRight className="h-3 w-3" />
            </a>
          )}

          {/* Status history / logs */}
          {ticket.logs && ticket.logs.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Status History
              </p>
              <div className="space-y-2">
                {ticket.logs.map((log) => (
                  <div key={log.id} className="flex items-start gap-3 text-xs">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="text-foreground">
                        <span className="font-medium capitalize">{log.from}</span>
                        {" → "}
                        <span className="font-medium capitalize">{log.to}</span>
                      </p>
                      {log.note && <p className="text-muted-foreground mt-0.5">{log.note}</p>}
                      <p className="text-muted-foreground/60 mt-0.5">{log.createdAt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Admin update section */}
          {isAdmin && (
            <div className="space-y-3 border-t border-border pt-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Update Status
              </p>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full h-9 px-3 text-sm rounded-lg border border-input bg-background focus:outline-none"
              >
                <option value="">Select new status</option>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <textarea
                rows={3}
                placeholder="Add a note (optional)..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded-lg border border-input bg-background resize-none focus:outline-none focus:ring-2 focus:ring-brand/30"
              />
              <Button
                onClick={handleUpdate}
                disabled={!newStatus || saving}
                className="w-full bg-brand hover:bg-brand-hover text-white rounded-xl h-9"
              >
                {saving ? "Updating..." : "Update Ticket"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}