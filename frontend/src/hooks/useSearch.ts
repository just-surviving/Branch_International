import { useState, useCallback } from 'react';
import type { SearchResults } from '../types';
import { search } from '../services/api';

interface UseSearchReturn {
  query: string;
  results: SearchResults | null;
  loading: boolean;
  error: string | null;
  setQuery: (query: string) => void;
  performSearch: (q?: string) => Promise<void>;
  clearSearch: () => void;
}

export function useSearch(): UseSearchReturn {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const performSearch = useCallback(async (q?: string) => {
    const searchQuery = q !== undefined ? q : query;
    
    if (!searchQuery.trim()) {
      setResults(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await search(searchQuery);
      setResults(data);
    } catch (err) {
      console.error('Search error:', err);
      setError('Search failed');
      setResults(null);
    } finally {
      setLoading(false);
    }
  }, [query]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults(null);
    setError(null);
  }, []);

  return {
    query,
    results,
    loading,
    error,
    setQuery,
    performSearch,
    clearSearch,
  };
}

export default useSearch;
