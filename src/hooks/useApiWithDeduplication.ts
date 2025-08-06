import { useState, useEffect, useCallback, useRef } from 'react';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiOptions {
  immediate?: boolean;
  dedupKey?: string; // Key for request deduplication
  retryDelay?: number; // Delay between retries in ms
  maxRetries?: number; // Maximum number of retries
}

// Global request cache for deduplication
const requestCache = new Map<string, Promise<any>>();
const requestTimestamps = new Map<string, number>();

// Clear cache entries older than 5 seconds
const cleanupCache = () => {
  const now = Date.now();
  for (const [key, timestamp] of requestTimestamps.entries()) {
    if (now - timestamp > 5000) {
      requestCache.delete(key);
      requestTimestamps.delete(key);
    }
  }
};

// Cleanup every 10 seconds
setInterval(cleanupCache, 10000);

export function useApiWithDeduplication<T>(
  apiFunction: () => Promise<T>,
  options: UseApiOptions = { immediate: true, maxRetries: 3, retryDelay: 1000 }
) {
  const apiRef = useRef(apiFunction);
  const abortControllerRef = useRef<AbortController | null>(null);
  const retryCountRef = useRef(0);
  
  // Always keep the latest apiFunction reference
  apiRef.current = apiFunction;
  
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: options.immediate || false,
    error: null,
  });

  const execute = useCallback(async (forceRefresh = false) => {
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    
    // Generate dedup key
    const dedupKey = options.dedupKey || apiRef.current.toString();
    
    // Check if we have a cached request and not forcing refresh
    if (!forceRefresh && requestCache.has(dedupKey)) {
      try {
        const cachedResult = await requestCache.get(dedupKey);
        setState({ data: cachedResult, loading: false, error: null });
        return cachedResult;
      } catch (error) {
        // If cached request failed, remove it and proceed with new request
        requestCache.delete(dedupKey);
        requestTimestamps.delete(dedupKey);
      }
    }
    
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    const makeRequest = async (retryCount = 0): Promise<T> => {
      try {
        const result = await apiRef.current();
        retryCountRef.current = 0; // Reset retry count on success
        return result;
      } catch (error) {
        // Check if request was aborted
        if (abortControllerRef.current?.signal.aborted) {
          throw new Error('Request aborted');
        }
        
        // Retry logic
        if (retryCount < (options.maxRetries || 3)) {
          retryCountRef.current = retryCount + 1;
          await new Promise(resolve => setTimeout(resolve, options.retryDelay || 1000));
          return makeRequest(retryCount + 1);
        }
        
        throw error;
      }
    };
    
    // Create and cache the request promise
    const requestPromise = makeRequest();
    requestCache.set(dedupKey, requestPromise);
    requestTimestamps.set(dedupKey, Date.now());
    
    try {
      const result = await requestPromise;
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setState({ data: null, loading: false, error: errorMessage });
      
      // Remove failed request from cache
      requestCache.delete(dedupKey);
      requestTimestamps.delete(dedupKey);
      
      throw error;
    }
  }, []); // ✅ FIXED: No dependencies, use ref for apiFunction

  useEffect(() => {
    if (options.immediate) {
      execute();
    }
    
    // Cleanup on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.immediate]); // ✅ FIXED: Remove execute from dependencies

  const reset = useCallback(() => {
    // Cancel ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    setState({
      data: null,
      loading: false,
      error: null,
    });
    
    // Clear retry count
    retryCountRef.current = 0;
  }, []);

  return {
    ...state,
    execute,
    reset,
    retryCount: retryCountRef.current,
  };
}