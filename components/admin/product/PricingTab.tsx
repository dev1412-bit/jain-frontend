"use client";

import { useState } from "react";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { Plus, Trash2, X, ChevronDown, ChevronUp } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { type ProductFormFields } from "@/components/admin/product/AddProductPage";

type Props = { form: UseFormReturn<ProductFormFields> };

export default function PricingTab({ form }: Props) {
  const { register, control, watch, setValue } = form;
  const { fields, append, remove } = useFieldArray({ control, name: "pricing_plans" });

  // track which plan's feature input is open
  const [featureInputs, setFeatureInputs] = useState<Record<number, string>>({});
  const [expandedPlan,  setExpandedPlan]  = useState<number | null>(null);

  const allPlans = watch("pricing_plans") ?? [];

  const addPlanFeature = (index: number) => {
    const val = (featureInputs[index] ?? "").trim();
    if (!val) return;
    const current = allPlans[index]?.features ?? [];
    setValue(`pricing_plans.${index}.features`, [...current, val]);
    setFeatureInputs((prev) => ({ ...prev, [index]: "" }));
  };

  const removePlanFeature = (planIndex: number, featureIndex: number) => {
    const current = allPlans[planIndex]?.features ?? [];
    setValue(
      `pricing_plans.${planIndex}.features`,
      current.filter((_, i) => i !== featureIndex)
    );
  };

  return (
    <div className="space-y-5">

      {/* Base + EMI */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Base Price (₹)
          </Label>
          <Input type="number" placeholder="0" className="h-10" {...register("base_price")} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            EMI Price/Month (₹)
          </Label>
          <Input type="number" placeholder="0" className="h-10" {...register("emi_price")} />
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Pricing Plans
          </Label>
          <button
            type="button"
            onClick={() => append({
              plan_name: "", price: 0,
              original_price: null, period: "Monthly", features: [],
            })}
            className="text-xs text-brand flex items-center gap-1 hover:underline"
          >
            <Plus className="h-3.5 w-3.5" /> Add Plan
          </button>
        </div>

        {fields.map((field, index) => {
          const planFeatures = allPlans[index]?.features ?? [];
          const isExpanded   = expandedPlan === index;

          return (
            <div key={field.id}
              className="rounded-xl border border-border bg-muted/20 overflow-hidden">

              {/* Plan header row */}
              <div className="flex items-center gap-2 p-3">
                <Input
                  placeholder="Plan name"
                  className="h-9 flex-1 bg-background"
                  {...register(`pricing_plans.${index}.plan_name`)}
                />
                <Input
                  type="number"
                  placeholder="Price"
                  className="h-9 w-24 bg-background"
                  {...register(`pricing_plans.${index}.price`)}
                />
                <Input
                  type="number"
                  placeholder="Original"
                  className="h-9 w-24 bg-background"
                  {...register(`pricing_plans.${index}.original_price`)}
                />
                <select
                  className="h-9 px-2 text-sm rounded-md border border-input bg-background"
                  {...register(`pricing_plans.${index}.period`)}
                >
                  <option>Monthly</option>
                  <option>Yearly</option>
                  <option>3 Year</option>
                  <option>Lifetime</option>
                  <option>One-time</option>
                </select>

                {/* Toggle features */}
                <button
                  type="button"
                  onClick={() => setExpandedPlan(isExpanded ? null : index)}
                  className="h-9 px-2 text-xs text-brand border border-brand/30 rounded-md hover:bg-brand/5 flex items-center gap-1 shrink-0"
                >
                  Features
                  {isExpanded
                    ? <ChevronUp className="h-3 w-3" />
                    : <ChevronDown className="h-3 w-3" />
                  }
                  {planFeatures.length > 0 && (
                    <span className="ml-1 w-4 h-4 rounded-full bg-brand text-white text-[10px] flex items-center justify-center">
                      {planFeatures.length}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-muted-foreground hover:text-destructive shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Plan features (collapsible) */}
              {isExpanded && (
                <div className="px-3 pb-3 space-y-2 border-t border-border pt-3">
                  <p className="text-xs font-medium text-muted-foreground">
                    Plan Features
                  </p>

                  {/* Feature input */}
                  <div className="flex gap-2">
                    <Input
                      value={featureInputs[index] ?? ""}
                      onChange={(e) =>
                        setFeatureInputs((prev) => ({ ...prev, [index]: e.target.value }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addPlanFeature(index);
                        }
                      }}
                      placeholder="e.g. Unlimited users"
                      className="h-8 text-xs flex-1 bg-background"
                    />
                    <button
                      type="button"
                      onClick={() => addPlanFeature(index)}
                      disabled={!(featureInputs[index] ?? "").trim()}
                      className="h-8 px-2.5 text-xs font-semibold text-white bg-brand rounded-md hover:bg-brand-hover disabled:opacity-50 flex items-center gap-1 shrink-0"
                    >
                      <Plus className="h-3 w-3" /> Add
                    </button>
                  </div>

                  {/* Feature list */}
                  {planFeatures.length > 0 ? (
                    <div className="space-y-1">
                      {planFeatures.map((f: string, fi: number) => (
                        <div key={fi}
                          className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-background border border-border">
                          <span className="text-xs text-foreground flex-1">{f}</span>
                          <button
                            type="button"
                            onClick={() => removePlanFeature(index, fi)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      No features yet — type and press Enter
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {fields.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">
            No plans added — click "Add Plan" to create one
          </p>
        )}
      </div>
    </div>
  );
}