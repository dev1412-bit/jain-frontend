"use client";

import { useEffect, useState } from "react";
import { Mail, Phone, Clock } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useSupportStore } from "@/store/supportTicketStore";
import { cn } from "@/lib/utils";
import TicketDrawer from "./TicketDrawer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const contactCards = [
  { icon: Mail,  label: "Email",          value: "support@jsinfoway.com", iconBg: "bg-pink-50 dark:bg-pink-500/10",   iconColor: "text-pink-500"  },
  { icon: Phone, label: "Phone",          value: "+91 98765 43210",       iconBg: "bg-brand/10",                      iconColor: "text-brand"     },
  { icon: Clock, label: "Business Hours", value: "Mon–Sat, 9am–6pm IST", iconBg: "bg-amber-50 dark:bg-amber-500/10", iconColor: "text-amber-500" },
];

const statusStyles: Record<string, string> = {
  open:     "bg-blue-100 text-blue-700",
  pending:  "bg-yellow-100 text-yellow-700",
  resolved: "bg-green-100 text-green-700",
  closed:   "bg-muted text-muted-foreground",
};

const priorityStyles: Record<string, string> = {
  low:    "bg-green-100 text-green-600",
  medium: "bg-yellow-100 text-yellow-600",
  high:   "bg-orange-100 text-orange-600",
  urgent: "bg-red-100 text-red-600",
};

export default function MyTicketsTab() {
  const { user } = useAuthStore();
  console.log('User is ', user);
  const {
    myTickets, myTicketsLoading,
    fetchMyTickets, fetchTicketsByEmail,
    selectedTicket, setSelectedTicket,
  } = useSupportStore();

  const [drawerOpen,  setDrawerOpen]  = useState(false);
  const [guestEmail,  setGuestEmail]  = useState("");
  const [searched,    setSearched]    = useState(false);

  useEffect(() => {
    if (user) {
      fetchMyTickets();
    } else {
      // auto-load if guest email saved
      const saved = localStorage.getItem("guest_support_email");
      if (saved) {
        setGuestEmail(saved);
        fetchTicketsByEmail(saved);
        setSearched(true);
      }
    }
  }, [user]);

  const handleGuestSearch = () => {
    if (!guestEmail) return;
    localStorage.setItem("guest_support_email", guestEmail);
    fetchTicketsByEmail(guestEmail);
    setSearched(true);
  };

  const handleView = (ticket: any) => {
    setSelectedTicket(ticket);
    setDrawerOpen(true);
  };

  if (!user && !searched) {
    return (
      <div className="space-y-6">
        <div className="bg-background border border-border rounded-2xl p-6 max-w-lg space-y-3">
          <h3 className="font-semibold text-foreground">Find your tickets</h3>
          <p className="text-xs text-muted-foreground">
            Enter the email you used when submitting your ticket.
          </p>
          <div className="flex gap-2">
            <Input
              placeholder="your@email.com"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGuestSearch()}
              className="h-9 text-sm"
            />
            <Button onClick={handleGuestSearch} size="sm"
              className="bg-brand text-white h-9 px-4 shrink-0">
              Search
            </Button>
          </div>
        </div>

        {/* Contact cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {contactCards.map(({ icon: Icon, label, value, iconBg, iconColor }) => (
            <div key={label} className="bg-background border border-border rounded-2xl px-5 py-4 flex items-center gap-3">
              <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0", iconBg)}>
                <Icon className={cn("h-4 w-4", iconColor)} strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-sm font-semibold text-foreground">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-background border border-border rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-bold text-foreground">My Support Tickets</h2>
          {!user && (
            <button
              onClick={() => { setSearched(false); setGuestEmail(""); }}
              className="text-xs text-brand hover:underline"
            >
              Search different email
            </button>
          )}
        </div>

        {myTicketsLoading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">Loading tickets...</div>
        ) : myTickets.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No tickets found. Submit one from the New Ticket tab.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Ticket ID</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Subject</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Priority</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Date</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Action</th>
                </tr>
              </thead>
              <tbody>
                {myTickets.map((ticket, i) => (
                  <tr key={ticket.id}
                    className={cn("border-b border-border last:border-0", i % 2 !== 0 && "bg-muted/10")}>
                    <td className="px-5 py-4 font-semibold text-brand font-mono text-xs">
                      {ticket.ticketId}
                    </td>
                    <td className="px-5 py-4 text-foreground max-w-[200px] truncate">
                      {ticket.subject}
                    </td>
                    <td className="px-5 py-4">
                      <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium capitalize", priorityStyles[ticket.priority])}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium capitalize", statusStyles[ticket.status])}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground text-xs">{ticket.createdAt}</td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => handleView(ticket)}
                        className="text-xs font-semibold text-brand hover:underline"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Contact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {contactCards.map(({ icon: Icon, label, value, iconBg, iconColor }) => (
          <div key={label} className="bg-background border border-border rounded-2xl px-5 py-4 flex items-center gap-3">
            <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0", iconBg)}>
              <Icon className={cn("h-4 w-4", iconColor)} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-sm font-semibold text-foreground">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Ticket Drawer */}
      <TicketDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        ticket={selectedTicket}
        isAdmin={false}
      />
    </div>
  );
}