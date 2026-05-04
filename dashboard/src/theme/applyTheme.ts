import { ThemeTokens, type ThemeMode } from "./tokens";
export function applyTheme(mode: ThemeMode) {
  const root = document.documentElement;
  root.dataset.theme = mode;
  root.style.colorScheme = mode;

  const t = ThemeTokens[mode];
  root.style.setProperty("--primary", t.primary);
  root.style.setProperty("--primary-dark", t.primaryDark);
  root.style.setProperty("--primary-light", t.primaryLight);
  root.style.setProperty("--primary-soft", t.primarySoft);
  root.style.setProperty("--primary-surface", t.primarySurface);

  root.style.setProperty("--bg", t.background);
  root.style.setProperty("--surface", t.surface);
  root.style.setProperty("--surface-2", t.surfaceVariant);
  root.style.setProperty("--border", t.border);

  root.style.setProperty("--fg", t.textPrimary);
  root.style.setProperty("--fg-2", t.textSecondary);
  root.style.setProperty("--fg-3", t.textTertiary);
  root.style.setProperty("--on-primary", t.textOnPrimary);

  root.style.setProperty("--success", t.success);
  root.style.setProperty("--success-bg", t.successLight);
  root.style.setProperty("--warning", t.warning);
  root.style.setProperty("--warning-bg", t.warningLight);
  root.style.setProperty("--info", t.info);
  root.style.setProperty("--info-bg", t.infoLight);
  root.style.setProperty("--danger", t.error);
  root.style.setProperty("--danger-bg", t.errorLight);

  root.style.setProperty("--gold", t.gold);
  root.style.setProperty("--silver", t.silver);
  root.style.setProperty("--bronze", t.bronze);
  root.style.setProperty("--platinum", t.platinum);
}

export function getInitialTheme(): ThemeMode {
  const stored = localStorage.getItem("sevasethu:theme");
  if (stored === "light" || stored === "dark") return stored;

  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
  return prefersDark ? "dark" : "light";
}
