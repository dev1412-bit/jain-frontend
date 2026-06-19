"use client";

import { useEffect, useState } from "react";
import { Search, ChevronDown, Users, UserCheck, UserX } from "lucide-react";
import { useCustomerStore, Customer } from "@/store/customerStore";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Customer["status"] }) {
  return (
    <span className={cn(
      "px-2 py-0.5 rounded-full text-xs font-medium",
      status === "active"      && "bg-green-100  text-green-600",
      status === "suspended"   && "bg-yellow-100 text-yellow-600",
      status === "blacklisted" && "bg-red-100    text-red-500",
    )}>
      {status}
    </span>
  );
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ─── Customers Page ───────────────────────────────────────────────────────────

export default function CustomersPage() {
  const { customers, loading, total, currentPage, fetchCustomers, updateStatus } = useCustomerStore();

  const [search, setSearch]       = useState("");
  const [statusFilter, setStatus] = useState("");
  const [typeFilter, setType]     = useState("");

  useEffect(() => {
    if (customers.length === 0 && total === 0) fetchCustomers(1);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchCustomers(1, search, statusFilter, typeFilter), 400);
    return () => clearTimeout(t);
  }, [search, statusFilter, typeFilter]);

  const totalPages = Math.ceil(total / 10);

  const handleStatusChange = async (customer: Customer, status: Customer["status"]) => {
    if (!confirm(`Set ${customer.name} as ${status}?`)) return;
    await updateStatus(customer.id, status);
  };

  return (
    <div className="p-6 space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Customers</h1>
          <p className="text-sm text-muted-foreground">{total} total customers</p>
        </div>

        {/* Quick stats */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-background text-sm text-muted-foreground">
            <UserCheck className="h-4 w-4 text-blue-500" />
            <span>Registered</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-background text-sm text-muted-foreground">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>Guests</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            className="pl-9 h-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Type filter */}
        <div className="relative">
          <select
            value={typeFilter}
            onChange={(e) => setType(e.target.value)}
            className="h-10 pl-3 pr-8 text-sm rounded-md border border-input bg-background text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-brand/30"
          >
            <option value="">All Types</option>
            <option value="registered">Registered</option>
            <option value="guest">Guest</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>

        {/* Status filter */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatus(e.target.value)}
            className="h-10 pl-3 pr-8 text-sm rounded-md border border-input bg-background text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-brand/30"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="blacklisted">Blacklisted</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border bg-background overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground text-xs uppercase">
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Orders</th>
              <th className="px-4 py-3 text-left">Total Spent</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Joined</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && customers.length === 0 ? (
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="border-b border-border">
                  <td colSpan={7} className="px-4 py-3">
                    <div className="h-4 bg-muted animate-pulse rounded" />
                  </td>
                </tr>
              ))
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-muted-foreground">
                  No customers found
                </td>
              </tr>
            ) : customers.map((customer) => (
              <tr key={customer.id} className="border-b border-border hover:bg-muted/30 transition-colors">

                {/* Customer */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center text-brand font-semibold text-xs shrink-0">
                      {customer.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{customer.name}</p>
                      <p className="text-xs text-muted-foreground">{customer.email}</p>
                    </div>
                  </div>
                </td>

                {/* Type */}
                <td className="px-4 py-3">
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-medium",
                    customer.is_registered
                      ? "bg-blue-100 text-blue-600"
                      : "bg-muted text-muted-foreground"
                  )}>
                    {customer.is_registered ? "Registered" : "Guest"}
                  </span>
                </td>

                {/* Orders */}
                <td className="px-4 py-3 text-foreground font-medium">
                  {customer.total_orders}
                </td>

                {/* Total Spent */}
                <td className="px-4 py-3 font-medium text-foreground">
                  ₹{Number(customer.total_spent).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  <StatusBadge status={customer.status} />
                </td>

                {/* Joined */}
                <td className="px-4 py-3 text-muted-foreground text-xs">
                  {customer.created_at ? formatDate(customer.created_at) : "—"}
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="relative group inline-block">
                    <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground border border-border rounded-md px-2 py-1">
                      Actions <ChevronDown className="h-3 w-3" />
                    </button>
                    <div className="absolute right-0 top-full mt-1 w-36 bg-background border border-border rounded-xl shadow-lg z-10 hidden group-hover:block">
                      {customer.status !== "active" && (
                        <button
                          onClick={() => handleStatusChange(customer, "active")}
                          className="w-full text-left px-3 py-2 text-xs hover:bg-muted/50 text-green-600 rounded-t-xl"
                        >
                          Set Active
                        </button>
                      )}
                      {customer.status !== "suspended" && (
                        <button
                          onClick={() => handleStatusChange(customer, "suspended")}
                          className="w-full text-left px-3 py-2 text-xs hover:bg-muted/50 text-yellow-600"
                        >
                          Suspend
                        </button>
                      )}
                      {customer.status !== "blacklisted" && (
                        <button
                          onClick={() => handleStatusChange(customer, "blacklisted")}
                          className="w-full text-left px-3 py-2 text-xs hover:bg-muted/50 text-red-500 rounded-b-xl"
                        >
                          Blacklist
                        </button>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Showing 1–{Math.min(10, customers.length)} of {total}
          </p>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm"
              disabled={currentPage === 1}
              onClick={() => fetchCustomers(currentPage - 1, search, statusFilter, typeFilter)}
            >
              Prev
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button key={p} size="sm"
                variant={p === currentPage ? "default" : "outline"}
                className={p === currentPage ? "bg-brand text-white" : ""}
                onClick={() => fetchCustomers(p, search, statusFilter, typeFilter)}
              >
                {p}
              </Button>
            ))}
            <Button variant="outline" size="sm"
              disabled={currentPage === totalPages}
              onClick={() => fetchCustomers(currentPage + 1, search, statusFilter, typeFilter)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}