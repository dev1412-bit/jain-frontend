"use client";

import { useEffect } from "react";
import { useNotificationStore } from "@/store/notificationStore";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function NotificationsPage() {
  const router = useRouter();
  const {
    notifications, loading, unreadCount,
    page, lastPage,
    fetchNotifications, markRead, markAllRead,
  } = useNotificationStore();

  useEffect(() => { fetchNotifications(1); }, []);

  const typeIcon = (type: string) => ({
    order_placed:          "🛒",
    order_cancelled:       "❌",
    ticket_raised:         "🎫",
    ticket_status_updated: "🔄",
    new_blog:              "📝",
    new_product:           "🚀",
  }[type] ?? "🔔");

  return (
    <div className="space-y-5">
      <div className="bg-background border border-border rounded-2xl px-6 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-muted-foreground">{unreadCount} unread</p>
          )}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead}
            className="text-xs text-brand hover:underline font-medium">
            Mark all as read
          </button>
        )}
      </div>

      <div className="bg-background border border-border rounded-2xl overflow-hidden">
        {loading && notifications.length === 0 ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="px-5 py-4 border-b border-border animate-pulse">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2 mt-2" />
            </div>
          ))
        ) : notifications.length === 0 ? (
          <div className="py-16 text-center text-sm text-muted-foreground">
            No notifications yet
          </div>
        ) : notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => {
              if (!n.read) markRead(n.id);
              if (n.link) router.push(n.link);
            }}
            className={cn(
              "flex items-start gap-4 px-5 py-4 border-b border-border last:border-0 cursor-pointer hover:bg-muted/20 transition-colors",
              !n.read && "bg-brand/5"
            )}
          >
            <span className="text-2xl shrink-0">{typeIcon(n.type)}</span>
            <div className="flex-1">
              <p className={cn("text-sm font-semibold text-foreground", !n.read && "text-brand")}>
                {n.title}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
              <p className="text-xs text-muted-foreground/60 mt-1">{n.createdAt}</p>
            </div>
            {!n.read && <div className="w-2.5 h-2.5 rounded-full bg-brand shrink-0 mt-1.5" />}
          </div>
        ))}
      </div>

      {/* Load more */}
      {page < lastPage && (
        <div className="text-center">
          <button
            onClick={() => fetchNotifications(page + 1)}
            disabled={loading}
            className="text-sm text-brand hover:underline font-medium"
          >
            {loading ? "Loading..." : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
}