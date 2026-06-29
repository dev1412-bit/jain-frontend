import {
  LayoutDashboard,
  Building2,
  Stethoscope,
  GraduationCap,
  Banknote,
  ShoppingBag,
  Monitor,
  Truck,
} from "lucide-react";

const sectors = [
  { label: "SaaS", icon: LayoutDashboard },
  { label: "Enterprise", icon: Building2 },
  { label: "HealthTech", icon: Stethoscope },
  { label: "Edtech", icon: GraduationCap },
  { label: "Fintech", icon: Banknote },
  { label: "Marketplaces", icon: ShoppingBag },
  { label: "E-Commerce", icon: Monitor },
  { label: "Ops & Logistics", icon: Truck },
];



export default function SectorsSection() {
  return (
    <section className="w-full bg-[#f5f5f7] dark:bg-muted/40 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center mb-12">
          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            We build for Businesses in every sector
          </h3>
          <p className="mt-4 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            We cover the full range of design and development work,
            <br className="hidden sm:block" />
            from your first idea to a product used by thousands.
          </p>
        </div>

        {/* Sector Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {sectors.map(({ label, icon: Icon }) => (
            <div
              key={label}
              className="flex flex-col items-center justify-center gap-3 py-8 px-4 bg-card rounded-2xl border border-border hover:border-brand/30 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-default"
            >
              <Icon
                className="w-7 h-7 text-foreground"
                strokeWidth={1.5}
              />
              <span className="text-sm sm:text-base font-medium text-foreground">
                {label}
              </span>
            </div>
          ))}
        </div>

      
        

      </div>
    </section>
  );
}