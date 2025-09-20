import { useState, useCallback, useRef } from "react";

interface UseAsyncQueryOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

interface UseAsyncQueryReturn<T, P> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (params: P) => Promise<void>;
  reset: () => void;
  lastParams: P | null;
}

/**
 * Enhanced async hook for queries with dynamic parameters
 * Perfect for search, filtering, and parameterized API calls
 */
export function useAsyncQuery<T, P>(
  asyncFunction: (params: P) => Promise<T>,
  options: UseAsyncQueryOptions = {},
): UseAsyncQueryReturn<T, P> {
  const { onSuccess, onError } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastParamsRef = useRef<P | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const execute = useCallback(async (params: P) => {
    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    lastParamsRef.current = params;

    try {
      setLoading(true);
      setError(null);

      const result = await asyncFunction(params);

      // Check if this request was aborted
      if (abortControllerRef.current.signal.aborted) {
        return;
      }

      setData(result);
      onSuccess?.(result);
    } catch (err) {
      // Don't set error if request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      onError?.(err as Error);
    } finally {
      // Only update loading if this request wasn't aborted
      if (!abortControllerRef.current?.signal.aborted) {
        setLoading(false);
      }
    }
  }, [asyncFunction, onSuccess, onError]);

  const reset = useCallback(() => {
    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setData(null);
    setError(null);
    setLoading(false);
    lastParamsRef.current = null;
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
    lastParams: lastParamsRef.current,
  };
}
