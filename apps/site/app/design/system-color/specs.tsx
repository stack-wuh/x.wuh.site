import type { Theme } from "@/app/components/theme/ThemeModeProvider";

export const THEME_OPTIONS: Theme[] = ["wine", "plain"];

export const THEME_LABELS: Record<Theme, string> = {
  wine: "酒红",
  plain: "素雅",
};

export const COLOR_NAMES = [
  "primary",
  "normal",
  "background",
  "success",
  "danger",
  "warning",
] as const;

export const SEMANTIC_VARS = [
  "--primary-color",
  "--secondary-color",
  "--success-color",
  "--danger-color",
  "--warning-color",
  "--text-primary",
  "--text-secondary",
  "--text-muted",
  "--background-color",
  "--accent-color",
] as const;

export const SCALE_LABELS = [100, 200, 300, 400, 500, 600, 700, 800, 900];
