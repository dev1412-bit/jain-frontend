"use client";

import { useEffect, useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { useSupportStore } from "@/store/supportTicketStore";
import TicketDrawer from "@/components/sections/support/TicketDrawer";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

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

export default function AdminSupportPage() {
  const {
    adminTickets, adminLoading, adminTotal,
    fetchAdminTickets,
    selectedTicket, setSelectedTicket,
  } = useSupportStore();

  const [search,     setSearch]     = useState("");
  const [status,     setStatus]     = useState("");
  const [priority,   setPriority]   = useState("");
  const [page,       setPage]       = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    fetchAdminTickets(1);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      fetchAdminTickets(1, search, status, priority);
    }, 400);
    return () => clearTimeout(t);
  }, [search, status, priority]);

  const totalPages = Math.ceil(adminTotal / 15);

  const handleView = (ticket: any) => {
    setSelectedTicket(ticket);
    setDrawerOpen(true);
  };

  const handlePageChange = (p: number) => {
    setPage(p);
    fetchAdminTickets(p, search, status, priority);
  };

  return (
    <div className="p-6 space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Support Tickets</h1>
          <p className="text-sm text-muted-foreground">{adminTotal} total tickets</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, subject..."
            className="pl-9 h-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Status */}
        <div className="relative">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-10 pl-3 pr-8 text-sm rounded-md border border-input bg-background appearance-none focus:outline-none"
          >
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>

        {/* Priority */}
        <div className="relative">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="h-10 pl-3 pr-8 text-sm rounded-md border border-input bg-background appearance-none focus:outline-none"
          >
            <option value="">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border bg-background overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase text-muted-foreground">
              <th className="px-4 py-3 text-left">Ticket ID</th>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-left">Subject</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Priority</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {adminLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="border-b border-border">
                  <td colSpan={8} className="px-4 py-3">
                    <div className="h-4 bg-muted animate-pulse rounded" />
                  </td>
                </tr>
              ))
            ) : adminTickets.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-12 text-sm text-muted-foreground">
                  No tickets found
                </td>
              </tr>
            ) : adminTickets.map((ticket) => (
              <tr key={ticket.id}
                className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <span className="font-mono text-xs font-semibold text-brand">
                    {ticket.ticketId}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-foreground text-sm">{ticket.name}</p>
                  <p className="text-xs text-muted-foreground">{ticket.email}</p>
                </td>
                <td className="px-4 py-3 max-w-[180px]">
                  <p className="truncate text-sm text-foreground">{ticket.subject}</p>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {ticket.category}
                </td>
                <td className="px-4 py-3">
                  <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium capitalize", priorityColor(ticket.priority))}>
                    {ticket.priority}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium capitalize", statusColor(ticket.status))}>
                    {ticket.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {ticket.createdAt}
                </td>
                <td className="px-4 py-3">
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Showing {Math.min(15, adminTickets.length)} of {adminTotal} tickets
            </p>
            <div className="flex items-center gap-1">
              <button
                disabled={page === 1}
                onClick={() => handlePageChange(page - 1)}
                className="px-3 py-1.5 text-xs rounded-lg border border-border hover:bg-accent disabled:opacity-50"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={cn(
                    "px-3 py-1.5 text-xs rounded-lg border transition-colors",
                    p === page
                      ? "bg-brand text-white border-brand"
                      : "border-border hover:bg-accent"
                  )}
                >
                  {p}
                </button>
              ))}
              <button
                disabled={page === totalPages}
                onClick={() => handlePageChange(page + 1)}
                className="px-3 py-1.5 text-xs rounded-lg border border-border hover:bg-accent disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Drawer — admin view (isAdmin=true) */}
      <TicketDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        ticket={selectedTicket}
        isAdmin={true}
      />
    </div>
  );
}