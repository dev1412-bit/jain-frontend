"use client";

import { useEffect, useState } from "react";
import { Search, Copy, Download, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useLicenseStore, type License } from "@/store/licenseStore";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function DownloadsPage() {
  const { licenses, loading, total, currentPage, fetchLicenses } = useLicenseStore();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [sort,   setSort]   = useState("newest");

  useEffect(() => {
    fetchLicenses(1, "", "");
  }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchLicenses(1, search, status === "all" ? "" : status), 400);
    return () => clearTimeout(t);
  }, [search, status]);

  const totalPages = Math.ceil(total / 10);

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success("License key copied!");
  };

  const handleDownload = (url: string) => {
    window.open(url, "_blank");
  };

  const statusColor = (s: string) => ({
    active:  "bg-green-100 text-green-600",
    expired: "bg-orange-100 text-orange-600",
    revoked: "bg-red-100 text-red-600",
  }[s] ?? "");

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="bg-background border border-border rounded-2xl px-6 py-5">
        <h1 className="text-xl font-bold text-foreground">Downloads & Licenses</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Manage your software licenses and download the latest versions
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search your product licenses..."
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
            className="h-10 pl-3 pr-8 text-sm rounded-lg border border-input bg-background appearance-none focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="revoked">Revoked</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>

        {/* Sort */}
        <div className="relative">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="h-10 pl-3 pr-8 text-sm rounded-lg border border-input bg-background appearance-none focus:outline-none"
          >
            <option value="newest">Sort</option>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="expiry">Expiry</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>

        {/* Filter */}
        <div className="relative">
          <select
            className="h-10 pl-3 pr-8 text-sm rounded-lg border border-input bg-background appearance-none focus:outline-none"
          >
            <option>Filter</option>
            <option>Subscription</option>
            <option>One-time</option>
            <option>Lifetime</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-36 bg-muted animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : licenses.length === 0 ? (
        <div className="bg-background border border-border rounded-2xl py-16 text-center">
          <p className="text-sm font-medium text-foreground">No licenses found</p>
          <p className="text-xs text-muted-foreground mt-1">
            Purchase a product to get your license here
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {licenses.map((license) => (
            <LicenseCard
              key={license.id}
              license={license}
              onCopy={handleCopy}
              onDownload={handleDownload}
              statusColor={statusColor}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Showing {Math.min(10, licenses.length)} of {total}
          </p>
          <div className="flex items-center gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => fetchLicenses(currentPage - 1, search, status)}
              className="px-3 py-1.5 text-xs rounded-lg border border-border hover:bg-accent disabled:opacity-50"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => fetchLicenses(p, search, status)}
                className={cn(
                  "px-3 py-1.5 text-xs rounded-lg border transition-colors",
                  p === currentPage
                    ? "bg-brand text-white border-brand"
                    : "border-border hover:bg-accent"
                )}
              >
                {p}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => fetchLicenses(currentPage + 1, search, status)}
              className="px-3 py-1.5 text-xs rounded-lg border border-border hover:bg-accent disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── License Card ──────────────────────────────────────────────────────────────

function LicenseCard({ license, onCopy, onDownload, statusColor }: {
  license: License;
  onCopy: (key: string) => void;
  onDownload: (url: string) => void;
  statusColor: (s: string) => string;
}) {
  return (
    <div className="bg-background border border-border rounded-2xl p-4 space-y-3 hover:shadow-sm transition-shadow">

      {/* Header */}
      <div className="flex items-start gap-3">
        {/* Product image */}
        <div className="w-12 h-12 rounded-xl bg-muted overflow-hidden shrink-0">
          {license.productImage ? (
            <img src={license.productImage} alt={license.productTitle}
              className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-brand/10">
              <span className="text-brand/40 font-bold text-lg">
                {license.productTitle.charAt(0)}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-foreground truncate">
              {license.productTitle}
            </p>
            <span className={cn(
              "px-1.5 py-0.5 rounded-full text-[10px] font-semibold",
              statusColor(license.status)
            )}>
              {license.status}
            </span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground">
              {license.version}
            </span>
          </div>

          {/* Plan + expiry */}
          <p className="text-xs text-muted-foreground mt-0.5">
            {license.planName ?? "License valid"}
          </p>
          {license.daysLeft !== null ? (
            <p className="text-xs text-muted-foreground">
              {license.daysLeft > 0
                ? `${license.daysLeft} days left · Expires ${license.expiresAt}`
                : `Expired ${license.expiresAt}`
              }
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">Lifetime license</p>
          )}
        </div>
      </div>

      {/* License key */}
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-muted/50 rounded-lg px-3 py-2">
          <p className="text-xs font-mono text-foreground tracking-wider">
            {license.licenseKey}
          </p>
        </div>

        {/* Copy */}
        <button
          onClick={() => onCopy(license.licenseKey)}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border border-border hover:bg-accent transition-colors shrink-0"
        >
          <Copy className="h-3.5 w-3.5" />
          Copy
        </button>

        {/* Download */}
        {license.downloadableFile && (
          <button
            onClick={() => onDownload(license.downloadableFile!)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-brand text-white hover:bg-brand-hover transition-colors shrink-0"
          >
            <Download className="h-3.5 w-3.5" />
            Download
          </button>
        )}
      </div>
    </div>
  );
}