"use client";

import { useState, useRef } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Paperclip, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSupportStore } from "@/store/supportTicketStore";
import { useAuthStore } from "@/store/authStore";

const ticketSchema = z.object({
  name:     z.string().min(2, "Name is required"),
  email:    z.string().email("Enter a valid email"),
  category: z.string().min(1, "Select a category"),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  subject:  z.string().min(5, "Subject must be at least 5 characters"),
  message:  z.string().min(20, "Please describe your issue in detail (min 20 chars)"),
});

type TicketForm = z.infer<typeof ticketSchema>;

const categories = ["Technical", "Billing & Payments", "Licenses", "Products", "Account", "Other"];
const priorities  = ["low", "medium", "high", "urgent"];

type Props = {
  onSubmitSuccess?: () => void; 
};

export default function NewTicketTab({ onSubmitSuccess }: Props) {
  const { user } = useAuthStore();
  const { submitTicket } = useSupportStore();

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [attachment, setAttachment] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, formState: { errors }, reset } =
    useForm<TicketForm, unknown, TicketForm>({
      resolver: zodResolver(ticketSchema) as Resolver<TicketForm>,
      defaultValues: {
        name:     user?.name  ?? "",
        email:    user?.email ?? "",
        category: "Technical",
        priority: "medium",
      },
    });

  const onSubmit = async (data: TicketForm) => {
    setLoading(true);
    try {
      await submitTicket({ ...data, attachment });
      // save email for guest tracking
      if (!user) {
        localStorage.setItem("guest_support_email", data.email);
      }
      reset();
      setAttachment(null);
      setSubmitted(true);
      onSubmitSuccess?.(); // switch tab
    } catch {
      // error handled in store
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="w-14 h-14 rounded-full bg-brand/10 flex items-center justify-center mx-auto mb-4">
          <Send className="h-6 w-6 text-brand" />
        </div>
        <h3 className="text-lg font-bold text-foreground">Ticket Submitted!</h3>
        <p className="text-sm text-muted-foreground mt-2">
          We typically respond within 24 hours on business days.
        </p>
        <Button
          onClick={() => setSubmitted(false)}
          className="mt-6 bg-brand hover:bg-brand-hover text-white rounded-full"
        >
          Submit Another
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-lg">
      <div className="bg-background border border-border rounded-2xl p-6">
        <h2 className="text-lg font-bold text-foreground">Submit a Support Ticket</h2>
        <p className="text-xs text-muted-foreground mt-1 mb-6">
          Our team typically responds within 24 hours on business days.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Your Name *</Label>
              <Input placeholder="John Doe" className={cn("h-10 text-sm", errors.name && "border-destructive")} {...register("name")} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Email Address *</Label>
              <Input placeholder="john@example.com" type="email" className={cn("h-10 text-sm", errors.email && "border-destructive")} {...register("email")} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Category</Label>
              <select className="w-full h-10 px-3 text-sm rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-brand/30" {...register("category")}>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Priority</Label>
              <select className="w-full h-10 px-3 text-sm rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-brand/30" {...register("priority")}>
                {priorities.map((p) => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Subject *</Label>
            <Input placeholder="Brief description of your issue" className={cn("h-10 text-sm", errors.subject && "border-destructive")} {...register("subject")} />
            {errors.subject && <p className="text-xs text-destructive">{errors.subject.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Message *</Label>
            <textarea
              rows={4}
              placeholder="Please describe your issue in detail..."
              className={cn("w-full px-3 py-2.5 text-sm rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-brand/30", errors.message && "border-destructive")}
              {...register("message")}
            />
            {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
          </div>

          {/* File Upload */}
          <div
            onClick={() => fileRef.current?.click()}
            className="border border-dashed border-border rounded-xl p-4 text-center cursor-pointer hover:bg-accent transition-colors"
          >
            <Paperclip className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
            {attachment ? (
              <p className="text-xs text-brand font-medium">{attachment.name}</p>
            ) : (
              <>
                <p className="text-xs text-muted-foreground">Attach screenshots (optional)</p>
                <p className="text-[11px] text-muted-foreground/60 mt-0.5">PNG, JPG up to 2MB</p>
              </>
            )}
            <input
              ref={fileRef}
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              className="hidden"
              onChange={(e) => setAttachment(e.target.files?.[0] ?? null)}
            />
          </div>

          <Button type="submit" disabled={loading}
            className="w-full h-11 bg-brand hover:bg-brand-hover text-white font-semibold rounded-xl gap-2">
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Submitting...
              </span>
            ) : (
              <><Send className="h-4 w-4" /> Submit Ticket</>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}