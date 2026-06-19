"use client";

import { Search, X, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useActivityStore } from "@/store/activityStore";
import { cn } from "@/lib/utils";

const GROUPS = [
  { value: "",             label: "All Activity" },
  { value: "auth",         label: "Auth"         },
  { value: "order",        label: "Orders"       },
  { value: "subscription", label: "Subscriptions"},
  { value: "download",     label: "Downloads"    },
  { value: "support",      label: "Support"      },
  { value: "profile",      label: "Profile"      },
];

const ADMIN_GROUPS = [
  ...GROUPS,
  { value: "admin", label: "Admin Actions" },
];

type Props = {
  isAdmin?: boolean;
  onFilter: () => void;
};

export default function ActivityFilters({ isAdmin = false, onFilter }: Props) {
  const {
    search, setSearch,
    groupFilter, setGroupFilter,
    dateFrom, setDateFrom,
    dateTo, setDateTo,
    sortBy, setSortBy,
    userSearch, setUserSearch,
    resetFilters,
  } = useActivityStore();

  const groups = isAdmin ? ADMIN_GROUPS : GROUPS;
  const hasFilters = search || groupFilter || dateFrom || dateTo || userSearch;

  const handleReset = () => { resetFilters(); onFilter(); };

  return (
    <div className="space-y-3">
      {/* Search row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Main search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onFilter()}
            placeholder="Search activity..."
            className="pl-9 h-9 text-sm"
          />
        </div>

        {/* Admin user search */}
        {isAdmin && (
          <div className="relative min-w-[180px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onFilter()}
              placeholder="Search by user..."
              className="pl-9 h-9 text-sm"
            />
          </div>
        )}

        {/* Date from */}
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="h-9 px-3 text-sm rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-brand/30"
        />

        {/* Date to */}
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="h-9 px-3 text-sm rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-brand/30"
        />

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => { setSortBy(e.target.value); onFilter(); }}
          className="h-9 px-3 text-sm rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-brand/30"
        >
          <option value="latest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>

        {/* Apply + Reset */}
        <Button onClick={onFilter} size="sm" className="h-9 bg-brand hover:bg-brand-hover text-white rounded-lg gap-1.5">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Apply
        </Button>

        {hasFilters && (
          <Button onClick={handleReset} variant="outline" size="sm" className="h-9 rounded-lg gap-1.5 text-muted-foreground">
            <X className="h-3.5 w-3.5" />
            Clear
          </Button>
        )}
      </div>

      {/* Group filter pills */}
      <div className="flex flex-wrap gap-2">
        {groups.map((g) => (
          <button
            key={g.value}
            onClick={() => { setGroupFilter(g.value); onFilter(); }}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
              groupFilter === g.value
                ? "bg-brand text-white border-brand"
                : "bg-background text-foreground border-border hover:bg-accent"
            )}
          >
            {g.label}
          </button>
        ))}
      </div>
    </div>
  );
}