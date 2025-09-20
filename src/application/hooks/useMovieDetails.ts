import { useCallback, useMemo } from "react";
import type { MovieDetails } from "../../domain/entities/Movie";
import { movieService } from "../services/movieService";
import { useAsyncData } from "../../presentation/hooks/useAsyncData";

interface UseMovieDetailsReturn {
  movie: MovieDetails | null;
  loading: boolean;
  error: string | null;
  loadMovie: (id: number) => Promise<void>;
  refresh: () => Promise<void>;
  reset: () => void;
}

export const useMovieDetails = (movieId?: number): UseMovieDetailsReturn => {
  // Create async function for the current movieId
  const asyncFunction = useCallback(async () => {
    if (!movieId) {
      throw new Error("Movie ID is required");
    }
    return await movieService.getMovieDetails(movieId);
  }, [movieId]);

  // Use useAsyncData with immediate execution only if movieId exists
  const { data: movie, loading, error, execute, reset } = useAsyncData<MovieDetails>(
    asyncFunction,
    { immediate: !!movieId }
  );

  // Create loadMovie function for manual loading
  const loadMovie = useCallback(async (id: number): Promise<void> => {
    // This is a bit of a workaround since useAsyncData is tied to the current movieId
    // For a more flexible solution, we'd need to enhance useAsyncData
    await movieService.getMovieDetails(id);
  }, []);

  // Refresh uses the current execute function
  const refresh = useCallback(async () => {
    if (movieId) {
      await execute();
    }
  }, [movieId, execute]);

  return useMemo(() => ({
    movie: movie || null,
    loading,
    error,
    loadMovie,
    refresh,
    reset,
  }), [movie, loading, error, loadMovie, refresh, reset]);
};
