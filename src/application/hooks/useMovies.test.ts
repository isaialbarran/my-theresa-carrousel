import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useMovies } from "./useMovies";
import { movieService } from "../services/movieService";
import { MovieCategory } from "../../domain/entities/Category";
import { createMockMovie, createMockMovieResponse } from "../../test/factories/movieFactory";

// Mock movieService
vi.mock("../services/movieService", () => ({
  movieService: {
    getMoviesByCategory: vi.fn(),
  },
}));

describe("useMovies", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should load movies on mount", async () => {
    const mockMovie = createMockMovie();
    const mockResponse = createMockMovieResponse({
      results: [mockMovie],
      total_pages: 5,
    });
    vi.mocked(movieService.getMoviesByCategory).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useMovies(MovieCategory.POPULAR));

    expect(result.current.loading).toBe(true);
    expect(result.current.movies).toEqual([]);

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(movieService.getMoviesByCategory).toHaveBeenCalledWith(MovieCategory.POPULAR, 1);
    expect(result.current.loading).toBe(false);
    expect(result.current.movies).toEqual([mockMovie]);
    expect(result.current.currentPage).toBe(1);
    expect(result.current.totalPages).toBe(5);
    expect(result.current.hasMore).toBe(true);
  });

  it("should handle errors when loading movies", async () => {
    const error = new Error("Failed to fetch movies");
    vi.mocked(movieService.getMoviesByCategory).mockRejectedValue(error);

    const { result } = renderHook(() => useMovies(MovieCategory.POPULAR));

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.movies).toEqual([]);
    expect(result.current.error).toBe("Failed to fetch movies");
  });

  it("should load more movies and append to existing list", async () => {
    const movie1 = createMockMovie({ id: 1, title: "Test Movie 1" });
    const movie2 = createMockMovie({ id: 2, title: "Test Movie 2" });
    const page1Response = createMockMovieResponse({ page: 1, results: [movie1] });
    const page2Response = createMockMovieResponse({ page: 2, results: [movie2] });

    vi.mocked(movieService.getMoviesByCategory)
      .mockResolvedValueOnce(page1Response)
      .mockResolvedValueOnce(page2Response);

    const { result } = renderHook(() => useMovies(MovieCategory.POPULAR));

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.movies).toHaveLength(1);

    await act(async () => {
      await result.current.loadMore();
    });

    expect(movieService.getMoviesByCategory).toHaveBeenCalledTimes(2);
    expect(movieService.getMoviesByCategory).toHaveBeenLastCalledWith(MovieCategory.POPULAR, 2);
    expect(result.current.movies).toHaveLength(2);
    expect(result.current.currentPage).toBe(2);
  });

  it("should refresh movies by reloading first page", async () => {
    const originalMovie = createMockMovie({ id: 1, title: "Test Movie" });
    const refreshedMovie = createMockMovie({ id: 3, title: "Refreshed Movie" });
    const originalResponse = createMockMovieResponse({ results: [originalMovie] });
    const refreshedResponse = createMockMovieResponse({ results: [refreshedMovie] });

    vi.mocked(movieService.getMoviesByCategory)
      .mockResolvedValueOnce(originalResponse)
      .mockResolvedValueOnce(refreshedResponse);

    const { result } = renderHook(() => useMovies(MovieCategory.POPULAR));

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.movies[0].title).toBe("Test Movie");

    await act(async () => {
      await result.current.refresh();
    });

    expect(movieService.getMoviesByCategory).toHaveBeenCalledTimes(2);
    expect(result.current.movies[0].title).toBe("Refreshed Movie");
    expect(result.current.currentPage).toBe(1);
  });

  it("should reset state to initial values", async () => {
    const mockResponse = createMockMovieResponse();
    vi.mocked(movieService.getMoviesByCategory).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useMovies(MovieCategory.POPULAR, 2));

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.movies).toHaveLength(1);

    act(() => {
      result.current.reset();
    });

    expect(result.current.movies).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.hasMore).toBe(true);
    expect(result.current.currentPage).toBe(2); // Should respect initialPage
    expect(result.current.totalPages).toBe(1);
  });
});
