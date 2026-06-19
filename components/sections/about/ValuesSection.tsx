import { Heart, Zap, CheckCircle, Globe } from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Customer First",
    description:
      "Everything we build starts with understanding what our customers truly need.",
  },
  {
    icon: Zap,
    title: "Innovation",
    description:
      "We leverage cutting-edge technology to solve real-world business challenges.",
  },
  {
    icon: CheckCircle,
    title: "Quality",
    description:
      "Every product we ship undergoes rigorous testing and quality assurance.",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description:
      "Built for businesses worldwide, with localization and compliance in mind.",
  },
];

export default function ValuesSection() {
  return (
     <section className="bg-[f5f5f7] dark:bg-muted/40 py-16 px-4">
      <div className="max-w-5xl mx-auto text-center">

        <h2 className="text-3xl font-bold text-foreground mb-2">
          What we stand for
        </h2>
        <p className="text-muted-foreground text-sm mb-10">
          Our core values guide every decision we make
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {values.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="bg-background rounded-2xl p-6 text-left shadow-sm border border-border"
            >
             
              <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center mb-4">

                <Icon className="w-5 h-5 text-brand" strokeWidth={1.8} />
              </div>

              <h3 className="text-sm font-semibold text-foreground mb-2">
                {title}
              </h3>

              {/* text-muted-foreground — was: text-gray-500 */}
              <p className="text-sm text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}