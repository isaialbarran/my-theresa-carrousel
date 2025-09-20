import { useCallback } from "react";
import type { Movie } from "../../domain/entities/Movie";
import { MovieCategory } from "../../domain/entities/Category";
import { movieService } from "../services/movieService";
import { useAsyncData } from "../../presentation/hooks/useAsyncData";

interface UseMoviesByCategoryReturn {
  movies: Movie[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  reset: () => void;
}

/**
 * Simplified hook for loading movies by category using useAsyncData
 * For pagination, use the original useMovies hook
 */
export const useMoviesByCategory = (category: MovieCategory): UseMoviesByCategoryReturn => {
  // Create async function for the category
  const asyncFunction = useCallback(async () => {
    const response = await movieService.getMoviesByCategory(category);
    return response.results;
  }, [category]);

  // Use useAsyncData to handle loading state
  const { data: movies, loading, error, execute, reset } = useAsyncData<Movie[]>(
    asyncFunction,
    { immediate: true },
  );

  return {
    movies: movies || [],
    loading,
    error,
    refresh: execute,
    reset,
  };
};
