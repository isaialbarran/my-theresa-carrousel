import type { MovieRepository, MovieResponse, ApiError } from '../../domain/repositories/MovieRepository';
import type { MovieDetails } from '../../domain/entities/Movie';
import type { Category } from '../../domain/entities/Category';
import { MovieCategory } from '../../domain/entities/Category';

const ACCESS_TOKEN = import.meta.env.VITE_TMDB_ACCESS_TOKEN;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;

class TMDBApi implements MovieRepository {
  private async makeRequest<T>(endpoint: string): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(`TMDB API Error: ${error.status_message}`);
    }

    return response.json();
  }

  async getMoviesByCategory(category: MovieCategory, page: number = 1): Promise<MovieResponse> {
    return this.makeRequest<MovieResponse>(`/movie/${category}?page=${page}`);
  }

  async getMovieDetails(movieId: number): Promise<MovieDetails> {
    return this.makeRequest<MovieDetails>(`/movie/${movieId}`);
  }

  async searchMovies(query: string, page: number = 1): Promise<MovieResponse> {
    const encodedQuery = encodeURIComponent(query);
    return this.makeRequest<MovieResponse>(`/search/movie?query=${encodedQuery}&page=${page}`);
  }

  async getGenres(): Promise<Category[]> {
    const response = await this.makeRequest<{ genres: Category[] }>('/genre/movie/list');
    return response.genres;
  }

  async getPopularMovies(page: number = 1): Promise<MovieResponse> {
    return this.getMoviesByCategory(MovieCategory.POPULAR, page);
  }

  async getTopRatedMovies(page: number = 1): Promise<MovieResponse> {
    return this.getMoviesByCategory(MovieCategory.TOP_RATED, page);
  }

  async getUpcomingMovies(page: number = 1): Promise<MovieResponse> {
    return this.getMoviesByCategory(MovieCategory.UPCOMING, page);
  }

  async getNowPlayingMovies(page: number = 1): Promise<MovieResponse> {
    return this.getMoviesByCategory(MovieCategory.NOW_PLAYING, page);
  }
}

export const tmdbApi = new TMDBApi();
export default tmdbApi;