"use client";

import ActivityItem from "./ActivityItem";
import type { Activity } from "@/store/activityStore";

type Props = {
  activities: Activity[];
  loading?: boolean;
  showUser?: boolean;
};

export default function ActivityList({
  activities,
  loading = false,
  showUser = false
}: Props) {

  if (loading) {
    return (
      <div className="p-5 text-sm text-muted-foreground">
        Loading activity...
      </div>
    );
  }


  if (!activities.length) {
    return (
      <div className="p-5 text-sm text-muted-foreground">
        No activity found.
      </div>
    );
  }


  return (
    <div className="rounded-xl border bg-background overflow-hidden">
      {
        activities.map((activity)=>(
          <ActivityItem
            key={activity.id}
            activity={activity}
            showUser={showUser}
          />
        ))
      }
    </div>
  );
}