import { CheckCircle2 } from "lucide-react";

type Props = { features: string[] };

export default function ProductFeatures({ features }: Props) {
  if (!features?.length) return null;

  return (
    <div className="bg-white dark:bg-background border border-border rounded-2xl p-6 mt-4">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-foreground">Features</h2>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          Want to know more?{" "}
          <a href="/support" className="text-brand hover:underline font-medium ml-1">
            Contact for a DEMO
          </a>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
        {features.map((feature) => (
          <div key={feature} className="flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-brand shrink-0" strokeWidth={2} />
            <span className="text-sm text-foreground">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
}