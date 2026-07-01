"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, ChevronDown, Users, UserCheck, Eye } from "lucide-react";
import { useCustomerStore, Customer } from "@/store/customerStore";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";



function StatusBadge({ status }: { status: Customer["status"] }) {
  const label = status === "suspended" ? "Inactive" : status;
  return (
    <span className={cn(
      "px-2 py-0.5 rounded-full text-xs font-medium",
      status === "active"      && "bg-green-100  text-green-600",
      status === "suspended"   && "bg-yellow-100 text-yellow-600",
      status === "blacklisted" && "bg-red-100    text-red-500",
    )}>
      {label}
    </span>
  );
}

// ─── Active toggle ─────────────────────────────────────────────────────────────

function ActiveToggle({
  active,
  onChange,
}: {
  active: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={active}
      onClick={onChange}
      className={cn(
        "relative inline-flex h-5 w-9 items-center rounded-full transition-colors shrink-0",
        active ? "bg-green-500" : "bg-muted"
      )}
    >
      <span
        className={cn(
          "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform",
          active ? "translate-x-4.5" : "translate-x-0.5"
        )}
      />
    </button>
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
  const { customers, loading, total, currentPage, fetchCustomers, toggleActive } = useCustomerStore();

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

  const handleToggle = async (customer: Customer) => {
    if (!confirm(`${customer.is_active ? "Deactivate" : "Activate"} ${customer.name}?`)) return;
    await toggleActive(customer.uuid);
  };

  return (
    <div className="p-6 space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Customers</h1>
          <p className="text-sm text-muted-foreground">{total} total customers</p>
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

        {/* <div className="relative">
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
        </div> */}

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
              <th className="px-4 py-3 text-left">Active</th>
              <th className="px-4 py-3 text-left">View</th>
            </tr>
          </thead>
          <tbody>
            {loading && customers.length === 0 ? (
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="border-b border-border">
                  <td colSpan={8} className="px-4 py-3">
                    <div className="h-4 bg-muted animate-pulse rounded" />
                  </td>
                </tr>
              ))
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-12 text-muted-foreground">
                  No customers found
                </td>
              </tr>
            ) : customers.map((customer) => (
              <tr key={customer.id} className="border-b border-border hover:bg-muted/30 transition-colors">

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

                <td className="px-4 py-3 text-foreground font-medium">
                  {customer.total_orders}
                </td>

                <td className="px-4 py-3 font-medium text-foreground">
                 ₹{customer.total_spent.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </td>

                <td className="px-4 py-3">
                  <StatusBadge status={customer.status} />
                </td>

                <td className="px-4 py-3 text-muted-foreground text-xs">
                  {customer.created_at ? formatDate(customer.created_at) : "—"}
                </td>

                {/* Active toggle */}
                <td className="px-4 py-3">
                  <ActiveToggle
                    active={customer.is_active}
                    onChange={() => handleToggle(customer)}
                  />
                </td>

                {/* View */}
                <td className="px-4 py-3">
                  <Link href={`/admin/customers/${customer.uuid}`}>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </Button>
                  </Link>
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