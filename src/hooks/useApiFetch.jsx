import { useState, useEffect, useCallback } from 'react';
import { fetchData } from '../utils/api/fetchData';

// watchField: campo a observar en la respuesta (ej: 'name')
// localStorageKey: clave de localStorage a actualizar (ej: 'user_name')
const useApiFetch = (
  endpoint,
  method = 'GET',
  data = null,
  storageKey = null,
  watchField = null,
  localStorageKey = null
) => {
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem('user_id');  // Obtener el user_id desde el localStorage
  const token = localStorage.getItem('token');  // Obtener el token desde el localStorage

  // --- refetch function ---
  const fetchDataFromApi = useCallback(async () => {
    try {
      setLoading(true);

      // Create a copy of headers to avoid mutation
      const requestHeaders = {};

      if (token && !endpoint.includes('/login') && !endpoint.includes('/register')) {
        requestHeaders['Authorization'] = `Bearer ${token}`;
      }

      let modifiedEndpoint = endpoint;
      if (endpoint.includes('/users') && userId) {
        modifiedEndpoint = `/users/${userId}`;
      }

      const dataResponse = await fetchData(modifiedEndpoint, method, data, requestHeaders);
      setResponseData(dataResponse);

      if (storageKey && dataResponse && dataResponse.name && localStorage.getItem(storageKey) !== dataResponse.name) {
        localStorage.setItem(storageKey, dataResponse.name);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [endpoint, method, data, userId, token, storageKey]);
  // ------------------------

  useEffect(() => {
    fetchDataFromApi();
  }, [fetchDataFromApi]);

  // Nuevo efecto para actualizar localStorage cuando el campo observado cambie
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

  return { responseData, loading, error, refetch: fetchDataFromApi };  // Ahora devolvemos refetch también
};

export default useApiFetch;