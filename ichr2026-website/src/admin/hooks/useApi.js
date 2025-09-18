import { useState, useCallback } from 'react';
import useAuth from './useAuth';

const API_BASE_URL = 'http://localhost:5002/api';

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { refreshToken, logout } = useAuth();

  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    };
  }, []);

  const handleResponse = useCallback(async (response) => {
    if (response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      return { success: true };
    }

    // Handle 401 Unauthorized - try to refresh token
    if (response.status === 401) {
      try {
        const refreshed = await refreshToken();
        
        if (refreshed) {
          // Retry the original request with new token
          const newHeaders = getAuthHeaders();
          const retryResponse = await fetch(response.url, {
            method: response.method,
            headers: newHeaders,
            body: response.body
          });
          
          if (retryResponse.ok) {
            const contentType = retryResponse.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
              return await retryResponse.json();
            }
            return { success: true };
          }
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
      }
      
      // If refresh failed or retry failed, logout
      logout();
      throw new Error('Authentication failed. Please login again.');
    }
    
    // Handle other errors
    try {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong');
      }
    } catch (e) {
      // If parsing JSON fails, throw generic error with status
      throw new Error(`Request failed with status ${response.status}`);
    }
  }, [refreshToken, logout, getAuthHeaders]);

  const request = useCallback(async (endpoint, options = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const headers = {
        ...getAuthHeaders(),
        ...options.headers
      };
      
      const response = await fetch(url, {
        ...options,
        headers
      });
      
      const data = await handleResponse(response);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders, handleResponse]);

  const get = useCallback((endpoint, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return request(url, { method: 'GET' });
  }, [request]);

  const post = useCallback((endpoint, data) => {
    return request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }, [request]);

  const put = useCallback((endpoint, data) => {
    return request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }, [request]);

  const del = useCallback((endpoint) => {
    return request(endpoint, { method: 'DELETE' });
  }, [request]);

  return {
    loading,
    error,
    get,
    post,
    put,
    delete: del
  };
};

export { useApi };
export default useApi;