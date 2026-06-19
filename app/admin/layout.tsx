"use client";
import { adminMenu } from "@/lib/admin-menu";
import AdminTopbar from "@/components/admin/AdminTopbar";
import Sidebar from "@/components/layout/Sidebar";
import { useEchoListeners } from "@/hooks/useEchoListeners";
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  useEchoListeners();
  return (
    <div className="flex h-screen overflow-hidden bg-muted/30">
      <Sidebar title="ADMIN PANEL" subtitle="contact@jain.software" items={adminMenu} />
      <div className="flex flex-col flex-1 min-w-0">
        <AdminTopbar />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}