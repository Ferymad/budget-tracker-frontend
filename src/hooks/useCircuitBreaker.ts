import { useRef, useCallback } from 'react';

enum CircuitState {
  CLOSED = 'CLOSED',     // Normal operation
  OPEN = 'OPEN',         // Failing, reject requests
  HALF_OPEN = 'HALF_OPEN' // Testing if service recovered
}

interface CircuitBreakerConfig {
  failureThreshold: number;    // Number of failures before opening
  recoveryTimeMs: number;      // Time to wait before trying again
  requestTimeoutMs: number;    // Timeout for individual requests
}

interface CircuitBreakerState {
  state: CircuitState;
  failureCount: number;
  lastFailureTime: number;
  nextAttemptTime: number;
}

const defaultConfig: CircuitBreakerConfig = {
  failureThreshold: 5,
  recoveryTimeMs: 30000, // 30 seconds
  requestTimeoutMs: 10000, // 10 seconds
};

export function useCircuitBreaker(
  config: Partial<CircuitBreakerConfig> = {}
) {
  const fullConfig = { ...defaultConfig, ...config };
  
  const stateRef = useRef<CircuitBreakerState>({
    state: CircuitState.CLOSED,
    failureCount: 0,
    lastFailureTime: 0,
    nextAttemptTime: 0,
  });

  const executeWithCircuitBreaker = useCallback(async <T>(
    operation: () => Promise<T>
  ): Promise<T> => {
    const now = Date.now();
    const state = stateRef.current;

    // Check if circuit is OPEN and recovery time hasn't passed
    if (state.state === CircuitState.OPEN && now < state.nextAttemptTime) {
      throw new Error(`Circuit breaker OPEN. Next attempt in ${Math.round((state.nextAttemptTime - now) / 1000)}s`);
    }

    // If circuit is OPEN but recovery time has passed, move to HALF_OPEN
    if (state.state === CircuitState.OPEN && now >= state.nextAttemptTime) {
      state.state = CircuitState.HALF_OPEN;
    }

    try {
      // Add timeout to the operation
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), fullConfig.requestTimeoutMs);
      });

      const result = await Promise.race([operation(), timeoutPromise]);

      // Success: Reset circuit if it was HALF_OPEN or reduce failure count
      if (state.state === CircuitState.HALF_OPEN) {
        state.state = CircuitState.CLOSED;
        state.failureCount = 0;
      } else if (state.state === CircuitState.CLOSED && state.failureCount > 0) {
        state.failureCount = Math.max(0, state.failureCount - 1);
      }

      return result;
    } catch (error) {
      // Failure: Increment failure count
      state.failureCount++;
      state.lastFailureTime = now;

      // Open circuit if failure threshold reached
      if (state.failureCount >= fullConfig.failureThreshold) {
        state.state = CircuitState.OPEN;
        state.nextAttemptTime = now + fullConfig.recoveryTimeMs;
      } else if (state.state === CircuitState.HALF_OPEN) {
        // If HALF_OPEN attempt failed, go back to OPEN
        state.state = CircuitState.OPEN;
        state.nextAttemptTime = now + fullConfig.recoveryTimeMs;
      }

      throw error;
    }
  }, [fullConfig.failureThreshold, fullConfig.recoveryTimeMs, fullConfig.requestTimeoutMs]);

  const getState = useCallback(() => ({ ...stateRef.current }), []);

  const reset = useCallback(() => {
    stateRef.current = {
      state: CircuitState.CLOSED,
      failureCount: 0,
      lastFailureTime: 0,
      nextAttemptTime: 0,
    };
  }, []);

  return {
    execute: executeWithCircuitBreaker,
    getState,
    reset,
  };
}