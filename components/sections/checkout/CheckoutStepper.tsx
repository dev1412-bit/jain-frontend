import { cn } from "@/lib/utils";

const steps = [
  { id: 1, label: "Billing"  },
  { id: 2, label: "Payment"  },
  { id: 3, label: "Review"   },
];

type Props = { currentStep: number };

export default function CheckoutStepper({ currentStep }: Props) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {steps.map((step, i) => (
        <div key={step.id} className="flex items-center">
          {/* Step circle + label */}
          <div className="flex flex-col items-center gap-1.5">
            <div className={cn(
              "w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors",
              currentStep >= step.id
                ? "bg-brand text-white"
                : "bg-muted text-muted-foreground border border-border"
            )}>
              {step.id}
            </div>
            <span className={cn(
              "text-xs font-medium",
              currentStep >= step.id ? "text-brand" : "text-muted-foreground"
            )}>
              {step.label}
            </span>
          </div>

          {/* Connecting line between steps */}
          {i < steps.length - 1 && (
            <div className={cn(
              "w-24 sm:w-32 h-0.5 mx-1 mb-5 transition-colors",
              currentStep > step.id ? "bg-brand" : "bg-border"
            )} />
          )}
        </div>
      ))}
    </div>
  );
}