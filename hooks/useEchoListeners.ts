"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useNotificationStore } from "@/store/notificationStore";
import { getEcho, disconnectEcho } from "@/lib/echo";
import { toast } from "sonner";

export function useEchoListeners() {
  const { user, role } = useAuthStore();
  const { addNotification, fetchUnreadCount } = useNotificationStore();

  useEffect(() => {
    if (!user) return;

    const echo = getEcho();

    const handle = (type: string, title: string, message: string, link: string, data: any) => {
      const n = {
        id:        crypto.randomUUID(),
        type,
        title,
        message,
        link,
        read:      false,
        createdAt: "just now",
      };
      addNotification(n);
      toast(title, { description: message });
      fetchUnreadCount();
    };

    if (role === "admin") {
      // admin listens to private admin channel
      echo.private("admin")
        .listen(".order.placed", (e: any) => {
          handle("order_placed", "New Order", `${e.customer} placed ₹${e.total}`, `/admin/orders`, e);
        })
        .listen(".order.cancelled", (e: any) => {
          handle("order_cancelled", "Order Cancelled", `${e.customer} cancelled order ${e.orderId}`, `/admin/orders`, e);
        })
        .listen(".ticket.raised", (e: any) => {
          handle("ticket_raised", "New Support Ticket", `${e.name}: ${e.subject}`, `/admin/support`, e);
        });
    }

    if (role === "user") {
      // user listens to own private channel
      echo.private(`user.${user.id}`)
        .listen(".ticket.status.updated", (e: any) => {
          handle("ticket_status_updated", "Ticket Updated", `Your ticket "${e.subject}" is now ${e.status}`, `/dashboard/support`, e);
        });

      // public channel for all users
      echo.channel("notifications")
        .listen(".blog.published", (e: any) => {
          handle("new_blog", "New Article", e.title, `/blog/${e.slug}`, e);
        })
        .listen(".product.launched", (e: any) => {
          handle("new_product", "New Product", e.title, `/store/${e.slug}`, e);
        });
    }

    return () => {
      if (role === "admin") echo.leave("admin");
      if (role === "user") {
        echo.leave(`user.${user.id}`);
        echo.leave("notifications");
      }
      disconnectEcho();
    };
  }, [user?.id, role]);
}