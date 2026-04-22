import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchData } from '../utils/api/fetchData';
import { getCache, setCache } from '../utils/api/prefetchCache';

const useApiFetch = (
  endpoint,
  method = 'GET',
  data = null,
  storageKey = null,
  watchField = null,
  localStorageKey = null
) => {
  const userId = localStorage.getItem('user_id');
  const token = localStorage.getItem('token');

  const resolvedEndpoint = endpoint.includes('/users') && userId
    ? `/users/${userId}`
    : endpoint;

  const cached = method === 'GET' ? getCache(resolvedEndpoint) : null;

  const [responseData, setResponseData] = useState(cached ?? null);
  const [loading, setLoading] = useState(!cached);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  
  const fetchDataFromApi = useCallback(async () => {
    try {
      setLoading(true);

      const dataResponse = await fetchData(resolvedEndpoint, method, data);
      if (method === 'GET') setCache(resolvedEndpoint, dataResponse);
      setResponseData(dataResponse);

      if (storageKey && dataResponse && dataResponse.name && localStorage.getItem(storageKey) !== dataResponse.name) {
        localStorage.setItem(storageKey, dataResponse.name);
      }
    } catch (err) {
      if (err?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        navigate('/login', { replace: true });
        return;
      }
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [resolvedEndpoint, method, data, storageKey]);
  

  useEffect(() => {
    if (!cached) fetchDataFromApi();
  }, [fetchDataFromApi]);

  
  useEffect(() => {
    if (
      watchField &&
      localStorageKey &&
      responseData &&
      responseData[watchField] !== localStorage.getItem(localStorageKey)
    ) {
      localStorage.setItem(localStorageKey, responseData[watchField]);
    }
  }, [responseData, watchField, localStorageKey]);

  return { responseData, loading, error, refetch: fetchDataFromApi };  
};

export default useApiFetch;