import Link from "next/link";
import {
  LogIn, LogOut, UserPlus, Lock, ShoppingCart, XCircle,
  RefreshCw, User, Camera, Download, MessageCircle,
  CheckCircle, Package, Trash2, FileText, Tags,
  UserX, Activity, Tag,
} from "lucide-react";
import type { Activity as ActivityType } from "@/store/activityStore";
import { cn } from "@/lib/utils";

// Map icon name string → actual Lucide component
const ICONS: Record<string, React.ElementType> = {
  LogIn, LogOut, UserPlus, Lock, ShoppingCart, XCircle,
  RefreshCw, User, Camera, Download, MessageCircle,
  CheckCircle, Package, Trash2, FileText, Tags,
  UserX, Activity, Tag,
};

type Props = {
  activity: ActivityType;
  showUser?: boolean; // admin view shows user info
};

export default function ActivityItem({ activity, showUser = false }: Props) {
  const Icon = ICONS[activity.icon] ?? Activity;

  return (
    <div className="flex items-start gap-3 py-3.5 border-b border-border last:border-0 hover:bg-muted/20 px-4 transition-colors">

      {/* Icon */}
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5",
        activity.color
      )}>
        <Icon className="h-3.5 w-3.5" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            {/* User info (admin only) */}
            {showUser && activity.user && (
              <p className="text-xs text-muted-foreground mb-0.5">
                <span className="font-medium text-foreground">{activity.user.name}</span>
                {" · "}{activity.user.email}
              </p>
            )}

            {/* Title */}
            <p className="text-sm font-medium text-foreground line-clamp-1">
              {activity.title}
            </p>

            {/* Description */}
            {activity.description && (
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                {activity.description}
              </p>
            )}

            {/* Meta tags */}
            {activity.meta && Object.keys(activity.meta).length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {Object.entries(activity.meta).slice(0, 3).map(([key, val]) => (
                  <span
                    key={key}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                  >
                    {key}: {String(val)}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Time */}
          <div className="text-right shrink-0">
            <p className="text-xs text-muted-foreground whitespace-nowrap">
              {activity.timeAgo}
            </p>
            {activity.link && (
              <Link
                href={activity.link}
                className="text-[11px] text-brand hover:underline mt-0.5 block"
              >
                View →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}