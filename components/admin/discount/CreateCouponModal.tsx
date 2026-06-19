"use client";

import { useEffect, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useCouponStore, type Coupon } from "@/store/couponStore";
import { cn } from "@/lib/utils";

const schema = z.object({
  code:        z.string().min(1, "Code is required").max(50),
  type:        z.enum(["percentage", "fixed"]),
  value:       z.coerce.number().min(0, "Value required"),
  usage_limit: z.coerce.number().min(1).optional().or(z.literal("")),
  expires_at:  z.string().optional(),
  is_active:   z.boolean(),
});

type FormFields = z.infer<typeof schema>;

type Props = {
  open: boolean;
  onClose: () => void;
  editCoupon?: Coupon | null;
};

export default function CreateCouponModal({ open, onClose, editCoupon }: Props) {
  const { createCoupon, updateCoupon, generateCode } = useCouponStore();
  const [generating, setGenerating] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } =
    useForm<FormFields, unknown, FormFields>({
      resolver: zodResolver(schema) as Resolver<FormFields>,
      defaultValues: { code: "", type: "percentage", value: 10, is_active: true },
    });

  useEffect(() => {
    if (editCoupon) {
      reset({
        code:        editCoupon.code,
        type:        editCoupon.type,
        value:       editCoupon.value,
        usage_limit: editCoupon.maxUses ?? "",
        expires_at:  editCoupon.expiresAt ?? "",
        is_active:   editCoupon.status === "active",
      });
    } else {
      reset({ code: "", type: "percentage", value: 10, is_active: true });
    }
  }, [editCoupon, open]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const code = await generateCode();
      setValue("code", code);
    } finally {
      setGenerating(false);
    }
  };

  const onSubmit = async (data: FormFields) => {
    const payload = {
      ...data,
      usage_limit: data.usage_limit === "" ? null : Number(data.usage_limit),
      expires_at:  data.expires_at || null,
    };
    if (editCoupon) {
      await updateCoupon(editCoupon.id, payload);
    } else {
      await createCoupon(payload);
    }
    onClose();
    reset();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-background rounded-2xl shadow-xl w-full max-w-md border border-border overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-bold text-foreground text-base">
            {editCoupon ? "Edit Coupon" : "Create Coupon"}
          </h2>
          <button onClick={onClose} className="w-7 h-7 rounded-full hover:bg-accent flex items-center justify-center">
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">

          {/* Coupon Code */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Coupon Code
            </Label>
            <div className="flex gap-2">
              <Input
                placeholder="SAVE10"
                className={cn("h-10 font-mono uppercase", errors.code && "border-destructive")}
                {...register("code")}
              />
              <Button type="button" variant="outline" onClick={handleGenerate}
                disabled={generating} className="h-10 px-4 shrink-0 text-brand border-brand hover:bg-brand/5">
                {generating ? "..." : "Generate"}
              </Button>
            </div>
            {errors.code && <p className="text-xs text-destructive">{errors.code.message}</p>}
          </div>

          {/* Type + Value */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Type
              </Label>
              <select
                className="w-full h-10 px-3 text-sm rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-brand/30"
                {...register("type")}
              >
                <option value="percentage">% Percentage</option>
                <option value="fixed">$ Fixed</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Value
              </Label>
              <Input
                type="number"
                placeholder="10"
                className={cn("h-10", errors.value && "border-destructive")}
                {...register("value")}
              />
              {errors.value && <p className="text-xs text-destructive">{errors.value.message}</p>}
            </div>
          </div>

          {/* Max Uses + Expiry */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Max Uses
              </Label>
              <Input
                type="number"
                placeholder="100"
                className="h-10"
                {...register("usage_limit")}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Expiry Date
              </Label>
              <Input
                type="date"
                className="h-10"
                {...register("expires_at")}
              />
            </div>
          </div>

          {/* Active Toggle */}
          <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3 bg-muted/30">
            <div>
              <p className="text-sm font-medium text-foreground">Active Status</p>
              <p className="text-xs text-muted-foreground">Inactive coupons can't be applied</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" {...register("is_active")} />
              <div className="w-10 h-6 rounded-full bg-muted peer-checked:bg-brand transition-colors duration-200" />
              <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 peer-checked:translate-x-4" />
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <Button type="button" variant="outline" onClick={onClose}
              className="flex-1 h-10 rounded-xl font-semibold">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}
              className="flex-1 h-10 bg-brand hover:bg-brand-hover text-white rounded-xl font-semibold">
              {isSubmitting ? "Saving..." : editCoupon ? "Update Coupon" : "Create Coupon"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}