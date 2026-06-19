"use client";

import Navbar from "@/components/layout/Navbar";
import UserSidebar from "@/components/user/UserSidebar";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AdminTopbar from "@/components/admin/AdminTopbar";
import Sidebar from "@/components/layout/Sidebar";
import { userMenu } from "@/lib/user-menu";
import { useEchoListeners } from "@/hooks/useEchoListeners";
export default function UserLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  const router = useRouter();
  useEchoListeners();
  return (
    <div className="flex h-screen overflow-hidden bg-muted/30">
      <Sidebar title="USER PANEL" subtitle={user?.email || ''} items={userMenu} />
      <div className="flex flex-col flex-1 min-w-0">
        <AdminTopbar />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}