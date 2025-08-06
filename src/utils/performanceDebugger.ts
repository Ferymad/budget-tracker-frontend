// Performance debugging utilities
export const PerformanceDebugger = {
  // Log all performance metrics to console
  logMetrics: () => {
    import('../hooks/usePerformanceMonitor').then(({ getAllPerformanceMetrics }) => {
      const metrics = getAllPerformanceMetrics();
      console.group('🚀 Performance Metrics');
      Object.entries(metrics).forEach(([hookName, data]) => {
        console.log(`${hookName}:`, {
          requests: data.requestCount,
          avgTime: `${data.averageTime.toFixed(2)}ms`,
          errors: data.errors,
          errorRate: `${((data.errors / data.requestCount) * 100).toFixed(1)}%`,
        });
      });
      console.groupEnd();
    });
  },

  // Monitor network requests in real-time
  startNetworkMonitoring: () => {
    const originalFetch = window.fetch;
    let requestCount = 0;
    let duplicateCount = 0;
    const recentRequests = new Map<string, number>();

    window.fetch = async (...args) => {
      const url = args[0]?.toString() || 'unknown';
      requestCount++;
      
      // Check for duplicate requests
      const requestKey = `${args[0]}_${JSON.stringify(args[1] || {})}`;
      const lastRequest = recentRequests.get(requestKey);
      const now = Date.now();
      
      if (lastRequest && (now - lastRequest) < 1000) {
        duplicateCount++;
        console.warn(`🔄 Duplicate request detected (#${duplicateCount}):`, url);
      }
      
      recentRequests.set(requestKey, now);
      
      // Clean old entries
      if (recentRequests.size > 100) {
        const entries = Array.from(recentRequests.entries());
        entries.slice(0, 50).forEach(([key]) => recentRequests.delete(key));
      }

      console.log(`📡 Request #${requestCount}:`, url);
      
      const startTime = performance.now();
      try {
        const response = await originalFetch(...args);
        const endTime = performance.now();
        console.log(`✅ Response #${requestCount}:`, url, `(${(endTime - startTime).toFixed(2)}ms)`);
        return response;
      } catch (error) {
        const endTime = performance.now();
        console.error(`❌ Error #${requestCount}:`, url, `(${(endTime - startTime).toFixed(2)}ms)`, error);
        throw error;
      }
    };

    return () => {
      window.fetch = originalFetch;
      console.log('📊 Network monitoring stopped:', {
        totalRequests: requestCount,
        duplicateRequests: duplicateCount,
      });
    };
  },

  // Detect infinite loops
  detectInfiniteLoop: (threshold = 10) => {
    let requestCount = 0;
    let lastReset = Date.now();
    
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.name.includes('/transactions/stats')) {
          requestCount++;
          
          if (requestCount >= threshold) {
            const timeSinceReset = Date.now() - lastReset;
            if (timeSinceReset < 5000) { // 5 seconds
              console.error(`🚨 INFINITE LOOP DETECTED! ${requestCount} requests to /transactions/stats in ${timeSinceReset}ms`);
              console.trace('Call stack:');
              
              // Try to stop the madness
              if (window.location.pathname.includes('dashboard')) {
                alert('Infinite request loop detected! The page will be reloaded to prevent system overload.');
                window.location.reload();
              }
            }
            
            requestCount = 0;
            lastReset = Date.now();
          }
        }
      });
    });
    
    observer.observe({ entryTypes: ['resource'] });
    
    return () => observer.disconnect();
  },
};

// Auto-start debugging in development
if (process.env.NODE_ENV === 'development') {
  // Add to window for manual access
  (window as any).PerformanceDebugger = PerformanceDebugger;
  
  console.log('🔧 Performance debugger available at window.PerformanceDebugger');
  console.log('Commands:');
  console.log('- PerformanceDebugger.logMetrics() - Show current metrics');
  console.log('- PerformanceDebugger.startNetworkMonitoring() - Monitor requests');
  console.log('- PerformanceDebugger.detectInfiniteLoop() - Watch for loops');
}