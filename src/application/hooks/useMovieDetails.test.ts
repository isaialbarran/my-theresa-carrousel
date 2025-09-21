import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useMovieDetails } from "./useMovieDetails";
import { movieService } from "../services/movieService";
import { createMockMovieDetails } from "../../test/factories/movieFactory";

// Mock movieService
vi.mock("../services/movieService", () => ({
  movieService: {
    getMovieDetails: vi.fn(),
  },
}));

describe("useMovieDetails", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch movie details immediately when movieId is provided", async () => {
    const mockDetails = createMockMovieDetails();
    vi.mocked(movieService.getMovieDetails).mockResolvedValue(mockDetails);

    const { result } = renderHook(() => useMovieDetails(1));

    expect(result.current.loading).toBe(true);
    expect(result.current.movie).toBe(null);

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(movieService.getMovieDetails).toHaveBeenCalledWith(1);
    expect(result.current.loading).toBe(false);
    expect(result.current.movie).toEqual(mockDetails);
    expect(result.current.error).toBe(null);
  });

  it("should not fetch when movieId is undefined", () => {
    const { result } = renderHook(() => useMovieDetails());

    expect(result.current.loading).toBe(false);
    expect(result.current.movie).toBe(null);
    expect(movieService.getMovieDetails).not.toHaveBeenCalled();
  });

  it("should handle errors when fetching movie details", async () => {
    const error = new Error("Failed to fetch movie details");
    vi.mocked(movieService.getMovieDetails).mockRejectedValue(error);

    const { result } = renderHook(() => useMovieDetails(1));

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.movie).toBe(null);
    expect(result.current.error).toBe("Failed to fetch movie details");
  });

  it("should refresh movie details when refresh is called", async () => {
    const mockDetails = createMockMovieDetails();
    vi.mocked(movieService.getMovieDetails).mockResolvedValue(mockDetails);

    const { result } = renderHook(() => useMovieDetails(1));

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(movieService.getMovieDetails).toHaveBeenCalledTimes(1);

    await act(async () => {
      await result.current.refresh();
    });

    expect(movieService.getMovieDetails).toHaveBeenCalledTimes(2);
  });

  it("should reset state when reset is called", async () => {
    const mockDetails = createMockMovieDetails();
    vi.mocked(movieService.getMovieDetails).mockResolvedValue(mockDetails);

    const { result } = renderHook(() => useMovieDetails(1));

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.movie).toEqual(mockDetails);

    act(() => {
      result.current.reset();
    });

    expect(result.current.movie).toBe(null);
    expect(result.current.error).toBe(null);
    expect(result.current.loading).toBe(false);
  });
});
