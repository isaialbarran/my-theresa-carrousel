import { useState, useCallback, useMemo } from "react";
import type { Movie } from "../../domain/entities/Movie";
import type { MovieResponse } from "../../domain/repositories/MovieRepository";
import { movieService } from "../services/movieService";
import { useAsyncQuery } from "../../presentation/hooks/useAsyncQuery";

interface SearchParams {
  query: string;
  page: number;
}

interface SearchResult {
  results: Movie[];
  currentPage: number;
  totalPages: number;
  totalResults: number;
  hasMore: boolean;
}

interface UseSearchReturn {
  results: Movie[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  currentPage: number;
  totalPages: number;
  totalResults: number;
  query: string;
  search: (query: string) => Promise<void>;
  loadMore: () => Promise<void>;
  clear: () => void;
}

export const useSearch = (): UseSearchReturn => {
  const [query, setQuery] = useState("");
  const [accumulatedResults, setAccumulatedResults] = useState<Movie[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    totalResults: 0,
    hasMore: false,
  });

  // Create async function for search
  const searchFunction = useCallback(async (params: SearchParams): Promise<SearchResult> => {
    if (!params.query.trim()) {
      throw new Error("Search query cannot be empty");
    }

    const response: MovieResponse = await movieService.searchMovies(params.query, params.page);

    return {
      results: response.results,
      currentPage: params.page,
      totalPages: response.total_pages,
      totalResults: response.total_results,
      hasMore: params.page < response.total_pages,
    };
  }, []);

  // Use useAsyncQuery for handling search requests
  const { data: searchData, loading, error, execute, reset } = useAsyncQuery<SearchResult, SearchParams>(
    searchFunction,
    {
      onSuccess: (data) => {
        setPagination({
          currentPage: data.currentPage,
          totalPages: data.totalPages,
          totalResults: data.totalResults,
          hasMore: data.hasMore,
        });

        // If this is page 1, replace results; otherwise append
        if (data.currentPage === 1) {
          setAccumulatedResults(data.results);
        } else {
          setAccumulatedResults(prev => [...prev, ...data.results]);
        }
      }
    }
  );

  // Actions
  const search = useCallback(async (searchQuery: string) => {
    setQuery(searchQuery);
    setAccumulatedResults([]);
    setPagination({ currentPage: 1, totalPages: 0, totalResults: 0, hasMore: false });
    await execute({ query: searchQuery, page: 1 });
  }, [execute]);

  const loadMore = useCallback(async () => {
    if (loading || !pagination.hasMore || !query) return;
    await execute({ query, page: pagination.currentPage + 1 });
  }, [loading, pagination.hasMore, pagination.currentPage, query, execute]);

  const clear = useCallback(() => {
    setQuery("");
    setAccumulatedResults([]);
    setPagination({ currentPage: 1, totalPages: 0, totalResults: 0, hasMore: false });
    reset();
  }, [reset]);

  return useMemo(() => ({
    results: accumulatedResults,
    loading,
    error,
    hasMore: pagination.hasMore,
    currentPage: pagination.currentPage,
    totalPages: pagination.totalPages,
    totalResults: pagination.totalResults,
    query,
    search,
    loadMore,
    clear,
  }), [
    accumulatedResults,
    loading,
    error,
    pagination,
    query,
    search,
    loadMore,
    clear,
  ]);
};
