"use client";
import { useAdminDashboardStore } from "@/store/adminDashboardStore";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";


const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-background border border-border rounded-lg px-3 py-2 shadow-md text-xs">
        <p className="font-semibold text-foreground">{payload[0].name}</p>
        <p className="text-brand">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

export default function SalesByCategoryChart() {
   const { categoryData } = useAdminDashboardStore();
  return (
    <div className="bg-background border border-border rounded-2xl p-5">
      <div className="mb-2">
        <h3 className="font-semibold text-foreground text-sm">Sales by Category</h3>
        <p className="text-xs text-muted-foreground">Distribution this month</p>
      </div>

      <ResponsiveContainer width="100%" height={160}>
       <PieChart>
          <Pie data={categoryData} cx="50%" cy="50%"
            innerRadius={45} outerRadius={70} paddingAngle={2} dataKey="value">
            {categoryData.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
       <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-1">
        {categoryData.map((item) => (
          <div key={item.name} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
            <span className="text-xs text-muted-foreground">{item.name}</span>
            <span className="text-xs font-medium text-foreground ml-auto">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}