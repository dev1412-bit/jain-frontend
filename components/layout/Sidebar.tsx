"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {MenuItem} from "@/types/menu";

interface SidebarProps {
  title: string;
  subtitle?: string;
  items: MenuItem[];
}

export default function Sidebar({
  title,
  subtitle,
  items,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-background h-full overflow-y-auto shrink-0">
      <div className="border-b p-4">
        <h2 className="font-semibold">{title}</h2>

        {subtitle && (
          <p className="text-sm text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>

      <nav className="p-3 space-y-1">
        {items.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}