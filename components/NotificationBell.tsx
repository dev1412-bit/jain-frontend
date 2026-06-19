  "use client";

  import { useEffect, useRef, useState } from "react";
  import { Bell, Check, CheckCheck, ExternalLink } from "lucide-react";
  import { useNotificationStore } from "@/store/notificationStore";
  import { useAuthStore } from "@/store/authStore";
  import { cn } from "@/lib/utils";
  import { useRouter } from "next/navigation";

  export default function NotificationBell() {
    const { user }  = useAuthStore();
    const router    = useRouter();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const {
      notifications, unreadCount,
      fetchNotifications, fetchUnreadCount,
      markRead, markAllRead,
    } = useNotificationStore();

    useEffect(() => {
      if (user) {
        fetchNotifications();
        fetchUnreadCount();
      }
    }, [user]);

    // close on outside click
    useEffect(() => {
      const handler = (e: MouseEvent) => {
        if (ref.current && !ref.current.contains(e.target as Node)) {
          setOpen(false);
        }
      };
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }, []);

    const typeIcon = (type: string) => ({
      order_placed:          "🛒",
      order_cancelled:       "❌",
      ticket_raised:         "🎫",
      ticket_status_updated: "🔄",
      new_blog:              "📝",
      new_product:           "🚀",
    }[type] ?? "🔔");

    const handleClick = (n: any) => {
      if (!n.read) markRead(n.id);
      if (n.link) router.push(n.link);
      setOpen(false);
    };

    return (
      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="relative w-9 h-9 rounded-full hover:bg-accent flex items-center justify-center transition-colors"
        >
          <Bell className="h-4 w-4 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-brand text-white text-[10px] font-bold flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {open && (
          <div className="absolute right-0 top-11 w-80 bg-background border border-border rounded-2xl shadow-xl z-50 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <p className="font-semibold text-foreground text-sm">Notifications</p>
              {unreadCount > 0 && (
                <button onClick={markAllRead}
                  className="flex items-center gap-1 text-xs text-brand hover:underline">
                  <CheckCheck className="h-3.5 w-3.5" />
                  Mark all read
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-border">
              {notifications.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  No notifications yet
                </div>
              ) : notifications.slice(0, 10).map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleClick(n)}
                  className={cn(
                    "flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors",
                    !n.read && "bg-brand/5"
                  )}
                >
                  <span className="text-lg shrink-0">{typeIcon(n.type)}</span>
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-xs font-semibold text-foreground", !n.read && "text-brand")}>
                      {n.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-1">{n.createdAt}</p>
                  </div>
                  {!n.read && (
                    <div className="w-2 h-2 rounded-full bg-brand shrink-0 mt-1" />
                  )}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-border px-4 py-2.5">
                <button
                  onClick={() => {
                    if (user?.role === 'admin') {
                      router.push("/admin/notifications");
                    } else {
                      router.push("/dashboard/notifications");
                    }
                    setOpen(false);
                  }}
                  className="text-xs text-brand hover:underline w-full text-center"
                >
                  View all notifications
                </button>
            </div>
          </div>
        )}
      </div>
    );
  }