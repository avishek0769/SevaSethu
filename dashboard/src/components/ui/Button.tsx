import React from "react";
import { cn } from "../../utils/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: Variant;
    size?: "sm" | "md";
};

export function Button({
    className,
    variant = "secondary",
    size = "md",
    ...props
}: Props) {
    const base =
        "inline-flex items-center justify-center gap-2 rounded-xl border px-3.5 font-medium transition focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 disabled:opacity-60 disabled:pointer-events-none";

    const sizes = {
        sm: "h-9 text-sm",
        md: "h-10 text-sm",
    };

    const variants: Record<Variant, string> = {
        primary:
            "border-transparent bg-[var(--primary)] text-[var(--on-primary)] hover:brightness-95",
        secondary:
            "border-[var(--border)] bg-[var(--surface)] text-[var(--fg)] hover:bg-[var(--surface-2)]",
        ghost: "border-transparent bg-transparent text-[var(--fg)] hover:bg-[var(--surface-2)]",
        danger: "border-transparent bg-[var(--danger)] text-[var(--on-primary)] hover:brightness-95",
    };

    return (
        <button
            className={cn(base, sizes[size], variants[variant], className)}
            {...props}
        />
    );
}
