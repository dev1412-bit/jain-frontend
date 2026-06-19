"use client";

import { ArrowLeft } from "lucide-react";

export default function GoBackButton() {
  return (
    <button
      onClick={() => history.back()}
      className="w-full flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border border-border bg-background hover:bg-accent text-sm font-medium text-foreground transition-colors"
    >
      <ArrowLeft className="h-4 w-4" />
      Go Back
    </button>
  );
}