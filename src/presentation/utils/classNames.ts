/**
 * Utility to concatenate class names conditionally
 */
export function classNames(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Common CSS class generators
 */
export const classes = {
  // Loading states
  loading: "loading-spinner",
  loadingCard: "loading-card",

  // Error states
  error: "error-card",
  errorText: "error-text",

  // Layout utilities
  container: "container",
  mainContent: "main-content",
  flexCenter: "flex-center",
  flexBetween: "flex-between",

  // Common component states
  disabled: "disabled",
  active: "active",
  hidden: "hidden",

  // Card variants
  cardElevated: "card--elevated",
  cardOutlined: "card--outlined",

  // Button variants
  btnPrimary: "btn--primary",
  btnSecondary: "btn--secondary",
  btnGhost: "btn--ghost",
  btnSmall: "btn--small",
  btnMedium: "btn--medium",
  btnLarge: "btn--large",
} as const;

/**
 * Loading component utility
 */
export function createLoadingCard(message = "Loading..."): string {
  return classNames(classes.loadingCard, classes.flexCenter);
}

/**
 * Error component utility
 */
export function createErrorCard(message = "Error occurred"): string {
  return classNames(classes.error, classes.flexCenter);
}
