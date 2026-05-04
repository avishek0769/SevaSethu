import React from "react";
import { cn } from "../../utils/cn";

type Tone = "neutral" | "success" | "warning" | "info" | "danger";

export function Badge({
    tone = "neutral",
    className,
    ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
    const tones: Record<Tone, string> = {
        neutral:
            "bg-[var(--surface-2)] text-[var(--fg-2)] border-[var(--border)]",
        success:
            "bg-[var(--success-bg)] text-[var(--success)] border-transparent",
        warning:
            "bg-[var(--warning-bg)] text-[var(--warning)] border-transparent",
        info: "bg-[var(--info-bg)] text-[var(--info)] border-transparent",
        danger: "bg-[var(--danger-bg)] text-[var(--danger)] border-transparent",
    };

    return (
        <span
            className={cn(
                "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold",
                tones[tone],
                className,
            )}
            {...props}
        />
    );
}
