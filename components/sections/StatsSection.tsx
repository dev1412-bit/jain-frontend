const stats = [
  { value: "3,000+", label: "Software Downloads" },
  { value: "15+", label: "Front-End Months" },
  { value: "2x", label: "Team Payments" },
  { value: "99.9%", label: "Uptime" },
];

export default function StatsSection()
{
    return(
    <section className="w-full py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-4">
                {stats.map(({ value, label }) => (
                    <div key={label} className="flex flex-col items-start sm:items-center gap-1">
                        <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-brand leading-none">
                            {value}
                        </span>
                        <span className="text-xs sm:text-sm text-muted-foreground mt-1">
                            {label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    </section>
    );
}