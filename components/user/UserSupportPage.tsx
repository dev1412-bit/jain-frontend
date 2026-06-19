"use client";

import { useEffect, useState } from "react";
import { useSupportStore } from "@/store/supportTicketStore";
import TicketDrawer from "@/components/sections/support/TicketDrawer";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const statusColor = (s: string) => ({
  open:     "bg-blue-100 text-blue-600",
  pending:  "bg-yellow-100 text-yellow-600",
  resolved: "bg-green-100 text-green-600",
  closed:   "bg-muted text-muted-foreground",
}[s] ?? "");

const priorityColor = (p: string) => ({
  low:    "bg-green-100 text-green-600",
  medium: "bg-yellow-100 text-yellow-600",
  high:   "bg-orange-100 text-orange-600",
  urgent: "bg-red-100 text-red-600",
}[p] ?? "");

export default function UserSupportPage() {
  const {
    myTickets, myTicketsLoading,
    fetchMyTickets,
    selectedTicket, setSelectedTicket,
  } = useSupportStore();

  const [search,     setSearch]     = useState("");
  const [status,     setStatus]     = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    fetchMyTickets();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchMyTickets(search, status), 400);
    return () => clearTimeout(t);
  }, [search, status]);

  const handleView = (ticket: any) => {
    setSelectedTicket(ticket);
    setDrawerOpen(true);
  };

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="bg-background border border-border rounded-2xl px-6 py-5">
        <h1 className="text-xl font-bold text-foreground">My Support Tickets</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Track and manage your support requests
        </p>
      </div>

      {/* Filters */}
      <div className="bg-background border border-border rounded-2xl p-4 flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tickets..."
            className="pl-9 h-9 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="h-9 px-3 text-sm rounded-lg border border-input bg-background focus:outline-none"
        >
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-background border border-border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase text-muted-foreground">
              <th className="px-5 py-3 text-left">Ticket ID</th>
              <th className="px-5 py-3 text-left">Subject</th>
              <th className="px-5 py-3 text-left">Category</th>
              <th className="px-5 py-3 text-left">Priority</th>
              <th className="px-5 py-3 text-left">Status</th>
              <th className="px-5 py-3 text-left">Date</th>
              <th className="px-5 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {myTicketsLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="border-b border-border">
                  <td colSpan={7} className="px-5 py-4">
                    <div className="h-4 bg-muted animate-pulse rounded" />
                  </td>
                </tr>
              ))
            ) : myTickets.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-sm text-muted-foreground">
                  No tickets found. Submit one from the{" "}
                  <a href="/support" className="text-brand hover:underline">Support page</a>.
                </td>
              </tr>
            ) : myTickets.map((ticket, i) => (
              <tr key={ticket.id}
                className={cn("border-b border-border last:border-0 hover:bg-muted/20 transition-colors",
                  i % 2 !== 0 && "bg-muted/10"
                )}>
                <td className="px-5 py-3">
                  <span className="font-mono text-xs font-semibold text-brand">{ticket.ticketId}</span>
                </td>
                <td className="px-5 py-3 font-medium text-foreground max-w-[180px] truncate">
                  {ticket.subject}
                </td>
                <td className="px-5 py-3 text-muted-foreground text-xs">{ticket.category}</td>
                <td className="px-5 py-3">
                  <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium capitalize", priorityColor(ticket.priority))}>
                    {ticket.priority}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium capitalize", statusColor(ticket.status))}>
                    {ticket.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-muted-foreground text-xs">{ticket.createdAt}</td>
                <td className="px-5 py-3">
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

      {/* Drawer — user view (isAdmin=false) */}
      <TicketDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        ticket={selectedTicket}
        isAdmin={false}
      />
    </div>
  );
}