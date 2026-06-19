"use client";

import { useAdminDashboardStore } from "@/store/adminDashboardStore";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from "recharts";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-background border border-border rounded-lg px-3 py-2 shadow-md text-xs">
        <p className="font-semibold text-foreground">{label}</p>
        <p className="text-brand">₹{Number(payload[0].value).toLocaleString("en-IN")}</p>
      </div>
    );
  }
  return null;
};

export default function RevenueChart() {
  const { revenueData, period, setPeriod } = useAdminDashboardStore();

  return (
    <div className="bg-background border border-border rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-foreground text-sm">Revenue Overview</h3>
          <p className="text-xs text-muted-foreground">
            {period === "week" ? "Last 7 days" : period === "year" ? "Last 5 years" : "Monthly 2026"}
          </p>
        </div>
        {/* Period selector */}
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          {(["week", "month", "year"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors capitalize ${
                period === p
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={revenueData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="brandGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#d4006e" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#d4006e" stopOpacity={0}    />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            axisLine={false} tickLine={false} />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="revenue" stroke="#d4006e" strokeWidth={2}
            fill="url(#brandGrad)" dot={false} activeDot={{ r: 4, fill: "#d4006e" }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}