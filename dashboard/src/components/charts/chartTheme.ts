function readCssVar(varName: string) {
    if (typeof window === "undefined") return "";
    return getComputedStyle(document.documentElement)
        .getPropertyValue(varName)
        .trim();
}

export function resolveChartColor(input: string) {
    const raw = input.trim();

    const m = raw.match(/^var\((--[^)]+)\)$/);
    if (!m) return raw;

    const resolved = readCssVar(m[1]);
    return resolved || raw;
}

export function resolveChartColors(inputs: string[]) {
    return inputs.map(resolveChartColor);
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const h = hex.replace("#", "").trim();
    if (h.length === 3) {
        const r = parseInt(h[0] + h[0], 16);
        const g = parseInt(h[1] + h[1], 16);
        const b = parseInt(h[2] + h[2], 16);
        return { r, g, b };
    }
    if (h.length === 6) {
        const r = parseInt(h.slice(0, 2), 16);
        const g = parseInt(h.slice(2, 4), 16);
        const b = parseInt(h.slice(4, 6), 16);
        return { r, g, b };
    }
    return null;
}

export function withAlpha(color: string, alpha: number) {
    const c = color.trim();

    if (c.startsWith("var(")) {
        return withAlpha(resolveChartColor(c), alpha);
    }

    const rgb = c.startsWith("#") ? hexToRgb(c) : null;
    if (rgb) {
        return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
    }

    // Fallback: if it's already rgb/rgba/hsl/etc, just return as-is.
    return c;
}
