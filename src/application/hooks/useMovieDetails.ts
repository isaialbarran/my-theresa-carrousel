import { useState, useEffect } from "react";
import type { MovieDetails } from "../../domain/entities/Movie";
import { movieService } from "../services/movieService";

interface UseMovieDetailsState {
  movie: MovieDetails | null;
  loading: boolean;
  error: string | null;
}

interface UseMovieDetailsActions {
  loadMovie: (id: number) => Promise<void>;
  refresh: () => Promise<void>;
  reset: () => void;
}

export const useMovieDetails = (movieId?: number) => {
  const [state, setState] = useState<UseMovieDetailsState>({
    movie: null,
    loading: false,
    error: null,
  });

  const loadMovie = async (id: number) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const movie = await movieService.getMovieDetails(id);
      setState(prev => ({ ...prev, movie, loading: false }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Failed to load movie details",
      }));
    }
  };

  const refresh = async () => {
    if (movieId) {
      await loadMovie(movieId);
    }
  };

  const reset = () => {
    setState({
      movie: null,
      loading: false,
      error: null,
    });
  };

  useEffect(() => {
    if (movieId) {
      loadMovie(movieId);
    }
  }, [movieId]);

  const actions: UseMovieDetailsActions = {
    loadMovie,
    refresh,
    reset,
  };

  return { ...state, ...actions };
};
