export type ClassValue = string | false | null | undefined;

/**
 * Joins conditional class names into a single string.
 */
export const classNames = (...values: ClassValue[]): string =>
  values.filter(Boolean).join(" ");
