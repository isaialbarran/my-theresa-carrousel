import type { Movie, MovieDetails } from "../../domain/entities/Movie";
import type { MovieResponse } from "../../domain/repositories/MovieRepository";
import type { Category } from "../../domain/entities/Category";

export const createMockMovie = (overrides: Partial<Movie> = {}): Movie => ({
  id: 1,
  title: "Test Movie",
  overview: "Test overview",
  release_date: "2023-01-01",
  poster_path: "/test-poster.jpg",
  backdrop_path: "/test-backdrop.jpg",
  vote_average: 8.5,
  vote_count: 1000,
  genre_ids: [1, 2, 3],
  adult: false,
  original_language: "en",
  original_title: "Test Movie",
  popularity: 100,
  video: false,
  ...overrides,
});

export const createMockMovieDetails = (overrides: Partial<MovieDetails> = {}): MovieDetails => ({
  ...createMockMovie(),
  runtime: 120,
  genres: [{ id: 1, name: "Action" }],
  budget: 50000000,
  revenue: 100000000,
  status: "Released",
  tagline: "Test tagline",
  production_companies: [],
  production_countries: [],
  spoken_languages: [],
  ...overrides,
});

export const createMockMovieResponse = (overrides: Partial<MovieResponse> = {}): MovieResponse => ({
  page: 1,
  results: [createMockMovie()],
  total_pages: 10,
  total_results: 200,
  ...overrides,
});

export const createMockGenres = (): Category[] => [
  { id: 1, name: "Action" },
  { id: 2, name: "Adventure" },
  { id: 3, name: "Comedy" },
];

// Helper para crear múltiples películas
export const createMockMovies = (count: number, baseOverrides: Partial<Movie> = {}): Movie[] => {
  return Array.from({ length: count }, (_, index) =>
    createMockMovie({
      id: index + 1,
      title: `Test Movie ${index + 1}`,
      ...baseOverrides,
    }),
  );
};
