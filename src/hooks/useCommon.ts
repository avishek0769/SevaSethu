import { useState, useCallback } from 'react';

/**
 * Hook for managing loading states
 */
export const useLoading = (initialState = false) => {
  const [isLoading, setIsLoading] = useState(initialState);

  const startLoading = useCallback(() => setIsLoading(true), []);
  const stopLoading = useCallback(() => setIsLoading(false), []);

  const withLoading = useCallback(
    async <T>(fn: () => Promise<T>): Promise<T> => {
      setIsLoading(true);
      try {
        return await fn();
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  return { isLoading, startLoading, stopLoading, withLoading };
};

/**
 * Hook for managing toggle states
 */
export const useToggle = (initialState = false): [boolean, () => void] => {
  const [value, setValue] = useState(initialState);
  const toggle = useCallback(() => setValue(prev => !prev), []);
  return [value, toggle];
};

/**
 * Hook for managing search/filter state
 */
export const useFilter = <T>(data: T[], filterFn: (item: T, query: string) => boolean) => {
  const [query, setQuery] = useState('');
  const filtered = query ? data.filter(item => filterFn(item, query)) : data;
  return { query, setQuery, filtered, resultCount: filtered.length };
};
