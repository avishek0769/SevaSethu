import React from "react";
import { cn } from "../../utils/cn";

export function Select({
    className,
    ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
    return (
        <select
            className={cn(
                "h-10 w-full appearance-none rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 text-sm text-[var(--fg)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/25",
                className,
            )}
            {...props}
        />
    );
}
