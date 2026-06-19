"use client";
import { UseFormReturn } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { type ProductFormFields } from "@/components/admin/product/AddProductPage";

type Props = { form: UseFormReturn<ProductFormFields> };

export default function SettingsTab({ form }: Props) {
  const { register, watch, setValue } = form;
  const subscriptionEnabled = watch("settings.subscription_enabled");

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          License Key Format
        </Label>
        <Input placeholder="XXXX-XXXX-XXXX-XXXX" className="h-10 font-mono"
          {...register("settings.license_key_format")} />
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Downloadable File URL
        </Label>
        <Input placeholder="https://cdn.yoursite.com/downloads/..." className="h-10"
          {...register("settings.downloadable_file")} />
      </div>

      {/* Subscription toggle */}
      <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3 bg-muted/30">
        <p className="text-sm font-medium text-foreground">Subscription enabled</p>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer"
            {...register("settings.subscription_enabled")} />
          <div className="w-10 h-6 rounded-full bg-muted peer-checked:bg-brand transition-colors duration-200" />
          <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 peer-checked:translate-x-4" />
        </label>
      </div>
    </div>
  );
}