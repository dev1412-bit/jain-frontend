"use client";

import { useState } from "react";

import HelpCenterTab from "@/components/sections/support/HelpCenterTab";
import MyTicketsTab from "@/components/sections/support/MyTicketsTab";
import NewTicketTab from "@/components/sections/support/NewTicketTab";
import SupportTabs, {type Tab} from "@/components/sections/support/SupportTabs";

import SupportHero from "@/components/sections/support/SupportHero";

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState<Tab>("help");

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-background">
      <div className="bg-background">
        <SupportHero />
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SupportTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "help"    && <HelpCenterTab />}
        {activeTab === "ticket"  && (
          <NewTicketTab
            onSubmitSuccess={() => setActiveTab("tickets")} 
          />
        )}
        {activeTab === "tickets" && <MyTicketsTab />}
      </div>
    </div>
  );
}