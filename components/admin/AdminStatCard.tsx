import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  icon: React.ReactNode;
  value: string;
  label: string;
  growth: string;      // e.g. "+18.2%" or "-3.2%"
  positive?: boolean;
};

export default function AdminStatCard({ icon, value, label, growth, positive = true }: Props) {
  return (
    <div className="bg-background border border-border rounded-2xl p-5 flex flex-col gap-3">
      {/* Icon */}
      <div className="text-muted-foreground">
        {icon}
      </div>

      {/* Value */}
      <div>
        <p className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          {value}
        </p>

        {/* Growth badge */}
        <div className={cn(
          "flex items-center gap-1 mt-1 text-xs font-medium",
          positive ? "text-green-600 dark:text-green-400" : "text-red-500"
        )}>
          {positive
            ? <TrendingUp className="h-3 w-3" />
            : <TrendingDown className="h-3 w-3" />
          }
          {growth}
        </div>
      </div>

      {/* Label */}
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}