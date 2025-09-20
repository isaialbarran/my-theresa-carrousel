import type { MovieRepository, MovieResponse } from '../../domain/repositories/MovieRepository';
import type { MovieDetails } from '../../domain/entities/Movie';
import type { Category } from '../../domain/entities/Category';
import { MovieCategory } from '../../domain/entities/Category';
import tmdbApi from '../api/tmdbApi';

export class MovieRepositoryImpl implements MovieRepository {
  async getMoviesByCategory(category: MovieCategory, page?: number): Promise<MovieResponse> {
    return tmdbApi.getMoviesByCategory(category, page);
  }

  async getMovieDetails(movieId: number): Promise<MovieDetails> {
    return tmdbApi.getMovieDetails(movieId);
  }

  async searchMovies(query: string, page?: number): Promise<MovieResponse> {
    return tmdbApi.searchMovies(query, page);
  }

  async getGenres(): Promise<Category[]> {
    return tmdbApi.getGenres();
  }

  async getPopularMovies(page?: number): Promise<MovieResponse> {
    return tmdbApi.getPopularMovies(page);
  }

  async getTopRatedMovies(page?: number): Promise<MovieResponse> {
    return tmdbApi.getTopRatedMovies(page);
  }

  async getUpcomingMovies(page?: number): Promise<MovieResponse> {
    return tmdbApi.getUpcomingMovies(page);
  }

  async getNowPlayingMovies(page?: number): Promise<MovieResponse> {
    return tmdbApi.getNowPlayingMovies(page);
  }
}

// Singleton instance
export const movieRepository = new MovieRepositoryImpl();
export default movieRepository;