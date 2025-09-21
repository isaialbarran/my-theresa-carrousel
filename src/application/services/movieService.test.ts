import { describe, it, expect, vi, beforeEach } from "vitest";
import { MovieService } from "./movieService";
import type { MovieRepository } from "../../domain/repositories/MovieRepository";
import { MovieCategory } from "../../domain/entities/Category";
import { createMockMovieDetails, createMockMovieResponse } from "../../test/factories/movieFactory";

// Mock repository
const mockRepository: MovieRepository = {
  getPopularMovies: vi.fn(),
  getTopRatedMovies: vi.fn(),
  getUpcomingMovies: vi.fn(),
  getNowPlayingMovies: vi.fn(),
  getMoviesByCategory: vi.fn(),
  getMovieDetails: vi.fn(),
  searchMovies: vi.fn(),
  getGenres: vi.fn(),
};

describe("MovieService", () => {
  let movieService: MovieService;

  beforeEach(() => {
    vi.clearAllMocks();
    movieService = new MovieService(mockRepository);
  });

  it("should fetch movies by category", async () => {
    const mockResponse = createMockMovieResponse();
    vi.mocked(mockRepository.getMoviesByCategory).mockResolvedValue(mockResponse);

    const result = await movieService.getMoviesByCategory(MovieCategory.POPULAR);

    expect(mockRepository.getMoviesByCategory).toHaveBeenCalledWith(MovieCategory.POPULAR, 1);
    expect(result).toEqual(mockResponse);
  });

  it("should fetch movie details", async () => {
    const mockDetails = createMockMovieDetails();
    vi.mocked(mockRepository.getMovieDetails).mockResolvedValue(mockDetails);

    const result = await movieService.getMovieDetails(123);

    expect(mockRepository.getMovieDetails).toHaveBeenCalledWith(123);
    expect(result).toEqual(mockDetails);
  });

  it("should search movies with trimmed query", async () => {
    const mockResponse = createMockMovieResponse();
    vi.mocked(mockRepository.searchMovies).mockResolvedValue(mockResponse);

    const result = await movieService.searchMovies("  test query  ");

    expect(mockRepository.searchMovies).toHaveBeenCalledWith("test query", 1);
    expect(result).toEqual(mockResponse);
  });

  it("should throw error for empty search query", async () => {
    await expect(movieService.searchMovies("")).rejects.toThrow("Search query cannot be empty");
  });

  it("should handle repository errors", async () => {
    const error = new Error("Repository error");
    vi.mocked(mockRepository.getMoviesByCategory).mockRejectedValue(error);

    await expect(movieService.getMoviesByCategory(MovieCategory.POPULAR)).rejects.toThrow("Repository error");
  });

  it("should return correct image URL", () => {
    expect(movieService.getImageUrl("/test.jpg")).toBe("https://image.tmdb.org/t/p/w500/test.jpg");
    expect(movieService.getImageUrl(null)).toBe(null);
  });

  it("should convert rating to percentage", () => {
    expect(movieService.getRatingPercentage(8.5)).toBe(85);
  });
});
