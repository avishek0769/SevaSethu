import React from "react";
import { cn } from "../../utils/cn";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--fg)] placeholder:text-[var(--fg-3)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/25",
        className
      )}
      {...props}
    />
  );
}
