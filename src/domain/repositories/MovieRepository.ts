import type { Movie, MovieDetails } from "../entities/Movie";
import type { Category } from "../entities/Category";
import { MovieCategory } from "../entities/Category";

export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface MovieRepository {
  getMoviesByCategory(category: MovieCategory, page?: number): Promise<MovieResponse>;
  getMovieDetails(movieId: number): Promise<MovieDetails>;
  searchMovies(query: string, page?: number): Promise<MovieResponse>;
  getGenres(): Promise<Category[]>;
  getPopularMovies(page?: number): Promise<MovieResponse>;
  getTopRatedMovies(page?: number): Promise<MovieResponse>;
  getUpcomingMovies(page?: number): Promise<MovieResponse>;
  getNowPlayingMovies(page?: number): Promise<MovieResponse>;
}

export interface ApiError {
  success: boolean;
  status_code: number;
  status_message: string;
}
