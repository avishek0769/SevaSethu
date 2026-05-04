import React from "react";
import { cn } from "../../utils/cn";

export function Table({
    className,
    ...props
}: React.TableHTMLAttributes<HTMLTableElement>) {
    return (
        <div
            className={cn(
                "overflow-x-auto rounded-2xl border border-[var(--border)]",
                className,
            )}
        >
            <table
                className={cn(
                    "min-w-[900px] w-full bg-[var(--surface)]",
                    className,
                )}
                {...props}
            />
        </div>
    );
}

export function Th({
    className,
    ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
    return (
        <th
            className={cn(
                "bg-[var(--surface-2)] px-4 py-3 text-left text-xs font-semibold tracking-wide text-[var(--fg-2)]",
                className,
            )}
            {...props}
        />
    );
}

export function Td({
    className,
    ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
    return (
        <td
            className={cn(
                "border-t border-[var(--border)] px-4 py-3 text-sm text-[var(--fg)]",
                className,
            )}
            {...props}
        />
    );
}
