"use client";

import { HelpCircle, TicketPlus, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export type Tab = "help" | "ticket" | "tickets";

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "help",    label: "Help Center",  icon: HelpCircle  },
  { id: "ticket",  label: "New Ticket",   icon: TicketPlus  },
  { id: "tickets", label: "My Tickets",   icon: Clock       },
];

type Props = {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
};

export default function SupportTabs({ activeTab, setActiveTab }: Props) {
  return (
    <div className="flex items-center gap-2 flex-wrap mb-8">
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => setActiveTab(id)}
          className={cn(
            "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-colors border",
            activeTab === id
              ? "bg-brand text-white border-brand"
              : "bg-background text-foreground border-border hover:bg-accent"
          )}
        >
          <Icon className="h-3.5 w-3.5" />
          {label}
        </button>
      ))}
    </div>
  );
}