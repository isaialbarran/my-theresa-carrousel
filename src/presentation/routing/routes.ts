export type AppRoute = "/" | "/wishlist" | `/movie/${string}`;

export const resolveRoutePath = (path: string): AppRoute => {
  const normalized = path.split("?")[0] ?? "/";

  if (normalized.startsWith("/wishlist")) {
    return "/wishlist";
  }

  if (normalized.startsWith("/movie/")) {
    return normalized as AppRoute;
  }

  return "/";
};
