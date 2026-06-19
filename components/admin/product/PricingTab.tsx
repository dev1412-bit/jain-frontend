"use client";
import { useFieldArray, UseFormReturn } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { type ProductFormFields } from "@/components/admin/product/AddProductPage";

type Props = { form: UseFormReturn<ProductFormFields> };

export default function PricingTab({ form }: Props) {
  const { register, control, formState: { errors } } = form;
  const { fields, append, remove } = useFieldArray({ control, name: "pricing_plans" });

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
          <button type="button"
            onClick={() => append({ plan_name: "", price: 0, original_price: null, period: "Monthly" })}
            className="text-xs text-brand flex items-center gap-1 hover:underline"
          >
            <Plus className="h-3.5 w-3.5" /> Add Plan
          </button>
        </div>

        {fields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-2 rounded-lg border border-border p-3">
            <Input placeholder="Plan name" className="h-9 flex-1"
              {...register(`pricing_plans.${index}.plan_name`)} />
            <Input type="number" placeholder="0" className="h-9 w-24"
              {...register(`pricing_plans.${index}.price`)} />
            <select className="h-9 px-2 text-sm rounded-md border border-input bg-background"
              {...register(`pricing_plans.${index}.period`)}>
              <option>Monthly</option>
              <option>Yearly</option>
              <option>Lifetime</option>
              <option>One-time</option>
            </select>
            <button type="button" onClick={() => remove(index)}
              className="text-muted-foreground hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}