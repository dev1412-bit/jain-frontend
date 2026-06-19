"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const billingSchema = z.object({
  firstName: z.string().min(2, "Required"),
  lastName:  z.string().min(2, "Required"),
  email:     z.string().email("Invalid email"),
  phone:     z.string().min(10, "Enter valid phone"),
  company:   z.string().optional(),
  address:   z.string().min(5, "Required"),
  city:      z.string().min(2, "Required"),
  state:     z.string().min(2, "Required"),
  pinCode:   z.string().min(6, "Enter valid pin code"),
  country:   z.string().min(2, "Required"),
});

export type BillingData = z.infer<typeof billingSchema>;

type Props = {
  onNext: (data: BillingData) => void;
  defaultValues?: Partial<BillingData>;
};

export default function BillingStep({ onNext, defaultValues }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<BillingData>({
    resolver: zodResolver(billingSchema),
    defaultValues: {
      city: "Raipur", state: "Chattisgarh",
      pinCode: "492001", country: "India",
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-4">
      <h2 className="text-lg font-bold text-foreground mb-5">Billing Information</h2>

      {/* First + Last name */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">First Name</Label>
          <Input placeholder="John" className={cn("h-10", errors.firstName && "border-destructive")} {...register("firstName")} />
          {errors.firstName && <p className="text-xs text-destructive">{errors.firstName.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Last Name</Label>
          <Input placeholder="Doe" className={cn("h-10", errors.lastName && "border-destructive")} {...register("lastName")} />
          {errors.lastName && <p className="text-xs text-destructive">{errors.lastName.message}</p>}
        </div>
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Email Address</Label>
        <Input placeholder="john@example.com" type="email" className={cn("h-10", errors.email && "border-destructive")} {...register("email")} />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>

      {/* Phone + Company */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Phone Number</Label>
          <Input placeholder="+91 XXXXXXXXXX" className={cn("h-10", errors.phone && "border-destructive")} {...register("phone")} />
          {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Company (Optional)</Label>
          <Input placeholder="Acme Inc." className="h-10" {...register("company")} />
        </div>
      </div>

      {/* Address */}
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Address</Label>
        <Input placeholder="123 Main Street" className={cn("h-10", errors.address && "border-destructive")} {...register("address")} />
        {errors.address && <p className="text-xs text-destructive">{errors.address.message}</p>}
      </div>

      {/* City + State */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">City</Label>
          <Input placeholder="Raipur" className={cn("h-10", errors.city && "border-destructive")} {...register("city")} />
          {errors.city && <p className="text-xs text-destructive">{errors.city.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">State</Label>
          <Input placeholder="Chattisgarh" className={cn("h-10", errors.state && "border-destructive")} {...register("state")} />
          {errors.state && <p className="text-xs text-destructive">{errors.state.message}</p>}
        </div>
      </div>

      {/* Pin + Country */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Pin Code</Label>
          <Input placeholder="492001" className={cn("h-10", errors.pinCode && "border-destructive")} {...register("pinCode")} />
          {errors.pinCode && <p className="text-xs text-destructive">{errors.pinCode.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Country</Label>
          <Input placeholder="India" className={cn("h-10", errors.country && "border-destructive")} {...register("country")} />
          {errors.country && <p className="text-xs text-destructive">{errors.country.message}</p>}
        </div>
      </div>

      <Button type="submit" className="w-full h-11 bg-brand hover:bg-brand-hover text-white font-semibold rounded-xl gap-2 mt-2">
        Continue to Payment <ArrowRight className="h-4 w-4" />
      </Button>
    </form>
  );
}