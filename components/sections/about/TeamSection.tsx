"use client";

import { useEffect } from "react";
import { useCmsStore } from "@/store/cmsStore"; 
import { Skeleton } from "@/components/ui/skeleton";

export default function TeamSection() {
  const { team, loading, fetchAll } = useCmsStore();

  useEffect(() => {
    if (team.length === 0) {
      fetchAll();
    }
  }, [fetchAll, team.length]);

  const getInitials = (name: string) => {
    return name ? name.trim().charAt(0).toUpperCase() : "?";
  };

  const defaultColors = ["bg-pink-500", "bg-purple-500", "bg-teal-500", "bg-amber-500"];

  return (
    <section className="bg-[#f5f5f7] dark:bg-muted/40 py-16 px-4">
      {/* ─── CHANGED: Increased max-width to max-w-5xl to give 6 members breathing room ─── */}
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          Meet the team
        </h2>
        <p className="text-muted-foreground text-sm mb-12">
          Passionate builders dedicated to your success
        </p>

        {loading ? (
          /* ─── LOADING SKELETON STATE ─── */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 justify-items-center">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2 w-full max-w-[140px]">
                <Skeleton className="w-14 h-14 rounded-full" />
                <Skeleton className="h-4 w-24 rounded" />
                <Skeleton className="h-3 w-16 rounded" />
              </div>
            ))}
          </div>
        ) : (
          /* ─── DYNAMIC DATA PRESENTATION ─── */
          /* ─── CHANGED: Switched from flex-wrap to a responsive grid container ─── */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 justify-items-center items-start">
            {team.map((member, index) => {
              const bgAccent = member.avatarColor || defaultColors[index % defaultColors.length];

              return (
                /* Added a max-width and center tracking to keep individual items neat */
                <div key={member.id || member.name} className="flex flex-col items-center text-center gap-2 w-full max-w-[140px]">
                  <div
                    className={`w-14 h-14 rounded-full ${bgAccent} flex items-center justify-center text-white font-semibold text-sm uppercase shrink-0`}
                  >
                    {member.avatar || getInitials(member.name)}
                  </div>

                  <div className="space-y-0.5">
                    {/* leading-tight keeps multi-line names from looking disjointed */}
                    <p className="text-sm font-semibold text-foreground leading-tight">{member.name}</p>
                    <p className="text-xs text-muted-foreground leading-normal">{member.role}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}