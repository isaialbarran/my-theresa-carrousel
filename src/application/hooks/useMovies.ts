import { useState, useEffect } from 'react';
import type { Movie } from '../../domain/entities/Movie';
import { MovieCategory } from '../../domain/entities/Category';
import type { MovieResponse } from '../../domain/repositories/MovieRepository';
import { movieService } from '../services/movieService';

interface UseMoviesState {
  movies: Movie[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  currentPage: number;
  totalPages: number;
}

interface UseMoviesActions {
  loadMovies: () => Promise<void>;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  reset: () => void;
}

export const useMovies = (category: MovieCategory, initialPage = 1) => {
  const [state, setState] = useState<UseMoviesState>({
    movies: [],
    loading: false,
    error: null,
    hasMore: true,
    currentPage: initialPage,
    totalPages: 1,
  });

  const loadMovies = async (page = initialPage, append = false) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response: MovieResponse = await movieService.getMoviesByCategory(category, page);

      setState(prev => ({
        ...prev,
        movies: append ? [...prev.movies, ...response.results] : response.results,
        loading: false,
        currentPage: page,
        totalPages: response.total_pages,
        hasMore: page < response.total_pages,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load movies',
      }));
    }
  };

  const loadMore = async () => {
    if (state.loading || !state.hasMore) return;
    await loadMovies(state.currentPage + 1, true);
  };

  const refresh = async () => {
    await loadMovies(initialPage, false);
  };

  const reset = () => {
    setState({
      movies: [],
      loading: false,
      error: null,
      hasMore: true,
      currentPage: initialPage,
      totalPages: 1,
    });
  };

  useEffect(() => {
    loadMovies();
  }, [category]);

  const actions: UseMoviesActions = {
    loadMovies: () => loadMovies(),
    loadMore,
    refresh,
    reset,
  };

  return { ...state, ...actions };
};