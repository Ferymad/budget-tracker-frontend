import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  requestCount: number;
  totalTime: number;
  averageTime: number;
  errors: number;
  lastRequest: number;
}

interface PerformanceAlert {
  type: 'high_frequency' | 'slow_response' | 'error_rate';
  message: string;
  metrics: PerformanceMetrics;
}

// Global performance tracker
const performanceTracker = new Map<string, PerformanceMetrics>();

export function usePerformanceMonitor(
  hookName: string,
  onAlert?: (alert: PerformanceAlert) => void
) {
  const metricsRef = useRef<PerformanceMetrics>({
    requestCount: 0,
    totalTime: 0,
    averageTime: 0,
    errors: 0,
    lastRequest: 0,
  });

  // Initialize or get existing metrics
  useEffect(() => {
    const existing = performanceTracker.get(hookName);
    if (existing) {
      metricsRef.current = existing;
    } else {
      performanceTracker.set(hookName, metricsRef.current);
    }
  }, [hookName]);

  const trackRequest = (startTime: number, isError = false) => {
    const endTime = Date.now();
    const duration = endTime - startTime;
    const now = Date.now();
    
    const metrics = metricsRef.current;
    metrics.requestCount++;
    metrics.totalTime += duration;
    metrics.averageTime = metrics.totalTime / metrics.requestCount;
    metrics.lastRequest = now;
    
    if (isError) {
      metrics.errors++;
    }
    
    performanceTracker.set(hookName, metrics);
    
    // Check for performance issues
    if (onAlert) {
      // High frequency detection (more than 10 requests per second)
      if (metrics.requestCount > 1 && (now - (metrics.lastRequest - duration)) < 100) {
        onAlert({
          type: 'high_frequency',
          message: `${hookName}: High request frequency detected (${metrics.requestCount} requests)`,
          metrics: { ...metrics }
        });
      }
      
      // Slow response detection (more than 2 seconds average)
      if (metrics.averageTime > 2000) {
        onAlert({
          type: 'slow_response',
          message: `${hookName}: Slow response time (${metrics.averageTime.toFixed(2)}ms average)`,
          metrics: { ...metrics }
        });
      }
      
      // High error rate (more than 20%)
      if (metrics.requestCount > 5 && (metrics.errors / metrics.requestCount) > 0.2) {
        onAlert({
          type: 'error_rate',
          message: `${hookName}: High error rate (${((metrics.errors / metrics.requestCount) * 100).toFixed(1)}%)`,
          metrics: { ...metrics }
        });
      }
    }
  };

  const getMetrics = () => ({ ...metricsRef.current });

  const resetMetrics = () => {
    metricsRef.current = {
      requestCount: 0,
      totalTime: 0,
      averageTime: 0,
      errors: 0,
      lastRequest: 0,
    };
    performanceTracker.set(hookName, metricsRef.current);
  };

  return {
    trackRequest,
    getMetrics,
    resetMetrics,
  };
}

// Debug utility to get all performance metrics
export const getAllPerformanceMetrics = () => {
  return Object.fromEntries(performanceTracker.entries());
};