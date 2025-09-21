import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useMoviesByCategory } from "./useMoviesByCategory";
import { movieService } from "../services/movieService";
import { MovieCategory } from "../../domain/entities/Category";
import type { MovieResponse } from "../../domain/repositories/MovieRepository";
import type { Movie } from "../../domain/entities/Movie";

// Mock movieService
vi.mock("../services/movieService", () => ({
  movieService: {
    getMoviesByCategory: vi.fn(),
  },
}));

const mockMovie1: Movie = {
  id: 1,
  title: "Test Movie 1",
  overview: "Test overview 1",
  release_date: "2023-01-01",
  poster_path: "/test-poster-1.jpg",
  backdrop_path: "/test-backdrop-1.jpg",
  vote_average: 8.5,
  vote_count: 1000,
  genre_ids: [1, 2],
  adult: false,
  original_language: "en",
  original_title: "Test Movie 1",
  popularity: 100,
  video: false,
};

const mockMovie2: Movie = {
  id: 2,
  title: "Test Movie 2",
  overview: "Test overview 2",
  release_date: "2023-02-01",
  poster_path: "/test-poster-2.jpg",
  backdrop_path: "/test-backdrop-2.jpg",
  vote_average: 7.5,
  vote_count: 800,
  genre_ids: [3, 4],
  adult: false,
  original_language: "en",
  original_title: "Test Movie 2",
  popularity: 80,
  video: false,
};

const mockMovieResponse: MovieResponse = {
  page: 1,
  results: [mockMovie1, mockMovie2],
  total_pages: 1,
  total_results: 2,
};

describe("useMoviesByCategory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch movies by category on mount", async () => {
    vi.mocked(movieService.getMoviesByCategory).mockResolvedValue(
      mockMovieResponse,
    );

    const { result } = renderHook(() =>
      useMoviesByCategory(MovieCategory.POPULAR),
    );

    expect(result.current.loading).toBe(true);
    expect(result.current.movies).toEqual([]);

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(movieService.getMoviesByCategory).toHaveBeenCalledWith(
      MovieCategory.POPULAR,
    );
    expect(result.current.loading).toBe(false);
    expect(result.current.movies).toEqual([mockMovie1, mockMovie2]);
    expect(result.current.error).toBe(null);
  });

  it("should handle errors when fetching movies", async () => {
    const error = new Error("Failed to fetch movies by category");
    vi.mocked(movieService.getMoviesByCategory).mockRejectedValue(error);

    const { result } = renderHook(() =>
      useMoviesByCategory(MovieCategory.TOP_RATED),
    );

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.movies).toEqual([]);
    expect(result.current.error).toBe("Failed to fetch movies by category");
  });

  it("should refresh movies when refresh is called", async () => {
    const refreshedResponse = {
      ...mockMovieResponse,
      results: [{ ...mockMovie1, title: "Refreshed Movie" }],
    };

    vi.mocked(movieService.getMoviesByCategory)
      .mockResolvedValueOnce(mockMovieResponse)
      .mockResolvedValueOnce(refreshedResponse);

    const { result } = renderHook(() =>
      useMoviesByCategory(MovieCategory.UPCOMING),
    );

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.movies[0].title).toBe("Test Movie 1");

    await act(async () => {
      await result.current.refresh();
    });

    expect(movieService.getMoviesByCategory).toHaveBeenCalledTimes(2);
    expect(result.current.movies[0].title).toBe("Refreshed Movie");
  });

  it("should reset state when reset is called", async () => {
    vi.mocked(movieService.getMoviesByCategory).mockResolvedValue(
      mockMovieResponse,
    );

    const { result } = renderHook(() =>
      useMoviesByCategory(MovieCategory.NOW_PLAYING),
    );

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(result.current.movies).toHaveLength(2);

    act(() => {
      result.current.reset();
    });

    expect(result.current.movies).toEqual([]);
    expect(result.current.error).toBe(null);
    expect(result.current.loading).toBe(false);
  });
});
