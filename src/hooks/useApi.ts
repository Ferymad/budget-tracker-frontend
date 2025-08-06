import { useState, useEffect, useCallback, useRef } from 'react';
import { usePerformanceMonitor } from './usePerformanceMonitor';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiOptions {
  immediate?: boolean;
}

export function useApi<T>(
  apiFunction: () => Promise<T>,
  options: UseApiOptions = { immediate: true }
) {
  const apiRef = useRef(apiFunction);
  
  // Always keep the latest apiFunction reference
  apiRef.current = apiFunction;
  
  // Performance monitoring
  const { trackRequest } = usePerformanceMonitor('useApi', (alert) => {
    console.warn('Performance Alert:', alert);
  });
  
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: options.immediate || false,
    error: null,
  });

  const execute = useCallback(async () => {
    const startTime = Date.now();
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await apiRef.current();
      trackRequest(startTime, false);
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error) {
      trackRequest(startTime, true);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setState({ data: null, loading: false, error: errorMessage });
      throw error;
    }
  }, []); // ✅ FIXED: No dependencies, use ref for apiFunction

  useEffect(() => {
    if (options.immediate) {
      execute();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.immediate]); // ✅ FIXED: Remove execute from dependencies

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

// Hook for mutations (create, update, delete operations)
export function useMutation<T, P = any>(
  mutationFunction: (params: P) => Promise<T>
) {
  const mutationRef = useRef(mutationFunction);
  
  // Always keep the latest mutationFunction reference
  mutationRef.current = mutationFunction;
  
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const mutate = useCallback(async (params: P) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await mutationRef.current(params);
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      throw error;
    }
  }, []); // ✅ FIXED: No dependencies, use ref for mutationFunction

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    mutate,
    reset,
  };
}