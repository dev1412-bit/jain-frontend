// "use client";

// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { CreditCard, Smartphone, ShieldCheck, ArrowRight } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { cn } from "@/lib/utils";

// const cardSchema = z.object({
//   cardNumber: z.string().min(16, "Enter valid card number").max(19),
//   expiry:     z.string().min(5, "Enter MM/YY"),
//   cvv:        z.string().min(3, "Enter CVV").max(4),
//   cardName:   z.string().min(2, "Enter cardholder name"),
// });

// const upiSchema = z.object({
//   upiId: z.string().min(5, "Enter valid UPI ID").includes("@", { message: "UPI ID must contain @" }),
// });

// type CardData = z.infer<typeof cardSchema>;
// type UpiData  = z.infer<typeof upiSchema>;
// type PaymentMethod = "card" | "upi";

// type Props = {
//   onNext: (data: { method: PaymentMethod; details: any }) => void;
//   onBack: () => void;
// };

// export default function PaymentStep({ onNext, onBack }: Props) {
//   const [method, setMethod] = useState<PaymentMethod>("card");

//   const cardForm = useForm<CardData>({ resolver: zodResolver(cardSchema) });
//   const upiForm  = useForm<UpiData>({ resolver: zodResolver(upiSchema) });

//   const handleSubmit = (data: any) => {
//     // Pass both the method selection and form inputs up to the parent layout
//     onNext({ method, details: data });
//   };

//   const formatCard = (val: string) =>
//     val.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim().slice(0, 19);

//   const formatExpiry = (val: string) =>
//     val.replace(/\D/g, "").replace(/(\d{2})(\d)/, "$1/$2").slice(0, 5);

//   return (
//     <div className="space-y-5">
//       <h2 className="text-lg font-bold text-foreground">Payment Method</h2>

//       {/* Payment method tabs */}
//       <div className="grid grid-cols-2 gap-3">
//         {[
//           { id: "card" as PaymentMethod, label: "Credit/Debit Card", icon: CreditCard },
//           { id: "upi"  as PaymentMethod, label: "UPI",               icon: Smartphone },
//         ].map(({ id, label, icon: Icon }) => (
//           <button
//             key={id}
//             type="button"
//             onClick={() => setMethod(id)}
//             className={cn(
//               "flex flex-col items-center gap-2 py-4 rounded-xl border-2 transition-colors",
//               method === id
//                 ? "border-brand bg-brand/5"
//                 : "border-border bg-background hover:border-brand/30"
//             )}
//           >
//             <Icon className={cn("h-5 w-5", method === id ? "text-brand" : "text-muted-foreground")} strokeWidth={1.5} />
//             <span className={cn("text-xs font-medium", method === id ? "text-brand" : "text-muted-foreground")}>
//               {label}
//             </span>
//           </button>
//         ))}
//       </div>

//       {/* Card form */}
//       {method === "card" && (
//         <form onSubmit={cardForm.handleSubmit(handleSubmit)} className="space-y-4">
//           <div className="space-y-1.5">
//             <Label className="text-xs text-muted-foreground">Card Number</Label>
//             <Input
//               placeholder="1234 5678 9012 3456"
//               className={cn("h-10", cardForm.formState.errors.cardNumber && "border-destructive")}
//               {...cardForm.register("cardNumber")}
//               onChange={(e) => {
//                 e.target.value = formatCard(e.target.value);
//                 cardForm.register("cardNumber").onChange(e);
//               }}
//             />
//             {cardForm.formState.errors.cardNumber && <p className="text-xs text-destructive">{cardForm.formState.errors.cardNumber.message}</p>}
//           </div>

//           <div className="grid grid-cols-2 gap-3">
//             <div className="space-y-1.5">
//               <Label className="text-xs text-muted-foreground">Expiry Date</Label>
//               <Input
//                 placeholder="MM / YY"
//                 className={cn("h-10", cardForm.formState.errors.expiry && "border-destructive")}
//                 {...cardForm.register("expiry")}
//                 onChange={(e) => {
//                   e.target.value = formatExpiry(e.target.value);
//                   cardForm.register("expiry").onChange(e);
//                 }}
//               />
//               {cardForm.formState.errors.expiry && <p className="text-xs text-destructive">{cardForm.formState.errors.expiry.message}</p>}
//             </div>
//             <div className="space-y-1.5">
//               <Label className="text-xs text-muted-foreground">CVV</Label>
//               <Input
//                 placeholder="123"
//                 type="password"
//                 maxLength={4}
//                 className={cn("h-10", cardForm.formState.errors.cvv && "border-destructive")}
//                 {...cardForm.register("cvv")}
//               />
//               {cardForm.formState.errors.cvv && <p className="text-xs text-destructive">{cardForm.formState.errors.cvv.message}</p>}
//             </div>
//           </div>

//           <div className="space-y-1.5">
//             <Label className="text-xs text-muted-foreground">Cardholder Name</Label>
//             <Input
//               placeholder="John Doe"
//               className={cn("h-10", cardForm.formState.errors.cardName && "border-destructive")}
//               {...cardForm.register("cardName")}
//             />
//             {cardForm.formState.errors.cardName && <p className="text-xs text-destructive">{cardForm.formState.errors.cardName.message}</p>}
//           </div>

//           <div className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20">
//             <ShieldCheck className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0" />
//             <p className="text-xs text-green-700 dark:text-green-400">Your payment information is encrypted and secure</p>
//           </div>

//           <div className="grid grid-cols-2 gap-3 pt-1">
//             <Button type="button" variant="outline" onClick={onBack} className="h-11 rounded-xl font-semibold">Back</Button>
//             <Button type="submit" className="h-11 bg-brand hover:bg-brand-hover text-white font-semibold rounded-xl gap-2">
//               Review Order <ArrowRight className="h-4 w-4" />
//             </Button>
//           </div>
//         </form>
//       )}

//       {/* UPI form */}
//       {method === "upi" && (
//         <form onSubmit={upiForm.handleSubmit(handleSubmit)} className="space-y-4">
//           <div className="space-y-1.5">
//             <Label className="text-xs text-muted-foreground">UPI ID</Label>
//             <Input
//               placeholder="yourname@upi"
//               className={cn("h-10", upiForm.formState.errors.upiId && "border-destructive")}
//               {...upiForm.register("upiId")}
//             />
//             {upiForm.formState.errors.upiId && <p className="text-xs text-destructive">{upiForm.formState.errors.upiId.message}</p>}
//           </div>

//           <div className="grid grid-cols-2 gap-3 pt-1">
//             <Button type="button" variant="outline" onClick={onBack} className="h-11 rounded-xl font-semibold">Back</Button>
//             <Button type="submit" className="h-11 bg-brand hover:bg-brand-hover text-white font-semibold rounded-xl gap-2">
//               Review Order <ArrowRight className="h-4 w-4" />
//             </Button>
//           </div>
//         </form>
//       )}
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { CreditCard, Smartphone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PaymentMethod = "card" | "upi";

type Props = {
  onNext: (data: { method: PaymentMethod }) => void;
  onBack: () => void;
};

export default function PaymentStep({ onNext, onBack }: Props) {
  const [method, setMethod] = useState<PaymentMethod>("card");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Pass the selected payment method up to the parent component
    onNext({ method });
  };

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-bold text-foreground">Select Payment Method</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Payment method tabs */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: "card" as PaymentMethod, label: "Credit/Debit Card", icon: CreditCard },
            { id: "upi"  as PaymentMethod, label: "UPI / QR Code",      icon: Smartphone },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setMethod(id)}
              className={cn(
                "flex flex-col items-center gap-2 py-4 rounded-xl border-2 transition-colors text-left w-full",
                method === id
                  ? "border-brand bg-brand/5"
                  : "border-border bg-background hover:border-brand/30"
              )}
            >
              <Icon className={cn("h-5 w-5", method === id ? "text-brand" : "text-muted-foreground")} strokeWidth={1.5} />
              <span className={cn("text-xs font-medium", method === id ? "text-brand" : "text-muted-foreground")}>
                {label}
              </span>
            </button>
          ))}
        </div>

        <div className="p-4 rounded-xl border border-border bg-muted/20 text-center">
          <p className="text-xs text-muted-foreground">
            You will securely complete your transaction using Razorpay's encrypted payment gateway in the next step.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <Button type="button" variant="outline" onClick={onBack} className="h-11 rounded-xl font-semibold">
            Back
          </Button>
          <Button type="submit" className="h-11 bg-brand hover:bg-brand-hover text-white font-semibold rounded-xl gap-2">
            Review Order <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}