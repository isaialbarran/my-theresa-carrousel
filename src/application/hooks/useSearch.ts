import { useState, useCallback } from "react";
import type { Movie } from "../../domain/entities/Movie";
import type { MovieResponse } from "../../domain/repositories/MovieRepository";
import { movieService } from "../services/movieService";

interface UseSearchState {
  results: Movie[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  currentPage: number;
  totalPages: number;
  totalResults: number;
}

interface UseSearchActions {
  search: (query: string) => Promise<void>;
  loadMore: () => Promise<void>;
  clear: () => void;
}

export const useSearch = () => {
  const [query, setQuery] = useState("");
  const [state, setState] = useState<UseSearchState>({
    results: [],
    loading: false,
    error: null,
    hasMore: false,
    currentPage: 1,
    totalPages: 0,
    totalResults: 0,
  });

  const searchMovies = async (searchQuery: string, page = 1, append = false) => {
    if (!searchQuery.trim()) {
      setState(prev => ({ ...prev, error: "Search query cannot be empty" }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response: MovieResponse = await movieService.searchMovies(searchQuery, page);

      setState(prev => ({
        ...prev,
        results: append ? [...prev.results, ...response.results] : response.results,
        loading: false,
        currentPage: page,
        totalPages: response.total_pages,
        totalResults: response.total_results,
        hasMore: page < response.total_pages,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Search failed",
      }));
    }
  };

  const search = useCallback(async (searchQuery: string) => {
    setQuery(searchQuery);
    await searchMovies(searchQuery, 1, false);
  }, []);

  const loadMore = useCallback(async () => {
    if (state.loading || !state.hasMore || !query) return;
    await searchMovies(query, state.currentPage + 1, true);
  }, [query, state.loading, state.hasMore, state.currentPage]);

  const clear = useCallback(() => {
    setQuery("");
    setState({
      results: [],
      loading: false,
      error: null,
      hasMore: false,
      currentPage: 1,
      totalPages: 0,
      totalResults: 0,
    });
  }, []);

  const actions: UseSearchActions = {
    search,
    loadMore,
    clear,
  };

  return { ...state, query, ...actions };
};
