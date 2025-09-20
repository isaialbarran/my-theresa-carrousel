export interface Category {
  id: number;
  name: string;
}

export const MovieCategory = {
  POPULAR: "popular",
  TOP_RATED: "top_rated",
  UPCOMING: "upcoming",
  NOW_PLAYING: "now_playing",
} as const;

export type MovieCategory = typeof MovieCategory[keyof typeof MovieCategory];

export interface CategoryResponse {
  page: number;
  results: Category[];
  total_pages: number;
  total_results: number;
}
