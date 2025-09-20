import type { MovieRepository, MovieResponse } from '../../domain/repositories/MovieRepository';
import type { Movie, MovieDetails } from '../../domain/entities/Movie';
import type { Category } from '../../domain/entities/Category';
import { MovieCategory } from '../../domain/entities/Category';
import { movieRepository } from '../../infrastructure/repositories/movieRepository.impl';

export class MovieService {
  private readonly repository: MovieRepository;

  constructor(repository: MovieRepository = movieRepository) {
    this.repository = repository;
  }

  async getPopularMovies(page: number = 1): Promise<MovieResponse> {
    try {
      return await this.repository.getPopularMovies(page);
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      throw error;
    }
  }

  async getTopRatedMovies(page: number = 1): Promise<MovieResponse> {
    try {
      return await this.repository.getTopRatedMovies(page);
    } catch (error) {
      console.error('Error fetching top rated movies:', error);
      throw error;
    }
  }

  async getUpcomingMovies(page: number = 1): Promise<MovieResponse> {
    try {
      return await this.repository.getUpcomingMovies(page);
    } catch (error) {
      console.error('Error fetching upcoming movies:', error);
      throw error;
    }
  }

  async getNowPlayingMovies(page: number = 1): Promise<MovieResponse> {
    try {
      return await this.repository.getNowPlayingMovies(page);
    } catch (error) {
      console.error('Error fetching now playing movies:', error);
      throw error;
    }
  }

  async getMoviesByCategory(category: MovieCategory, page: number = 1): Promise<MovieResponse> {
    try {
      return await this.repository.getMoviesByCategory(category, page);
    } catch (error) {
      console.error(`Error fetching ${category} movies:`, error);
      throw error;
    }
  }

  async getMovieDetails(movieId: number): Promise<MovieDetails> {
    try {
      return await this.repository.getMovieDetails(movieId);
    } catch (error) {
      console.error(`Error fetching movie details for ID ${movieId}:`, error);
      throw error;
    }
  }

  async searchMovies(query: string, page: number = 1): Promise<MovieResponse> {
    if (!query.trim()) {
      throw new Error('Search query cannot be empty');
    }

    try {
      return await this.repository.searchMovies(query.trim(), page);
    } catch (error) {
      console.error(`Error searching movies with query "${query}":`, error);
      throw error;
    }
  }

  async getGenres(): Promise<Category[]> {
    try {
      return await this.repository.getGenres();
    } catch (error) {
      console.error('Error fetching genres:', error);
      throw error;
    }
  }

  // Business logic methods
  async getFeaturedMovies(): Promise<{ popular: Movie[]; topRated: Movie[]; upcoming: Movie[] }> {
    try {
      const [popular, topRated, upcoming] = await Promise.all([
        this.getPopularMovies(1),
        this.getTopRatedMovies(1),
        this.getUpcomingMovies(1)
      ]);

      return {
        popular: popular.results.slice(0, 10),
        topRated: topRated.results.slice(0, 10),
        upcoming: upcoming.results.slice(0, 10)
      };
    } catch (error) {
      console.error('Error fetching featured movies:', error);
      throw error;
    }
  }

  async getMoviesByGenre(genreId: number, page: number = 1): Promise<MovieResponse> {
    try {
      // For now, we'll get popular movies and filter by genre
      // In a real implementation, you might want to use a specific endpoint
      const response = await this.getPopularMovies(page);

      // Filter movies by genre
      const filteredMovies = response.results.filter(movie =>
        movie.genre_ids.includes(genreId)
      );

      return {
        ...response,
        results: filteredMovies,
        total_results: filteredMovies.length
      };
    } catch (error) {
      console.error(`Error fetching movies for genre ${genreId}:`, error);
      throw error;
    }
  }

  getImageUrl(path: string | null, size: 'w200' | 'w300' | 'w400' | 'w500' | 'original' = 'w500'): string | null {
    if (!path) return null;
    return `https://image.tmdb.org/t/p/${size}${path}`;
  }

  formatReleaseDate(dateString: string): string {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  }

  getRatingPercentage(voteAverage: number): number {
    return Math.round(voteAverage * 10);
  }
}

// Singleton instance
export const movieService = new MovieService();
export default movieService;