import { useState, useEffect, useCallback } from 'react';

/**
 * Hook personnalisé pour gérer le chargement asynchrone des données
 * @param fetchFunction - Fonction asynchrone qui récupère les données
 * @param initialFetch - Si true, les données sont chargées automatiquement au montage du composant
 * @returns Un objet contenant les données, l'état de chargement, l'erreur et une fonction pour rafraîchir les données
 */
function useAsyncData<T>(
  fetchFunction: () => Promise<T>,
  initialFetch = true
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(initialFetch);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFunction();
      setData(result);
    } catch (e) {
      setError(e instanceof Error ? e : new Error('Une erreur est survenue'));
      console.error('Error in useAsyncData:', e);
    } finally {
      setLoading(false);
    }
  }, [fetchFunction]);

  // Charger les données au montage du composant si initialFetch est true
  useEffect(() => {
    if (initialFetch) {
      fetchData();
    }
  }, [fetchData, initialFetch]);

  // Fonction pour rafraîchir les données
  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
}

export default useAsyncData;
