const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export const getMoviePosterUrl = (posterPath: string | null, size: "w185" | "w342" | "w500" | "w780" = "w500"): string => {
  if (!posterPath) return "/placeholder-movie.jpg";
  return `${TMDB_IMAGE_BASE_URL}/${size}${posterPath}`;
};

export const getMovieBackdropUrl = (backdropPath: string | null, size: "w780" | "w1280" | "original" = "w1280"): string | null => {
  if (!backdropPath) return null;
  return `${TMDB_IMAGE_BASE_URL}/${size}${backdropPath}`;
};
