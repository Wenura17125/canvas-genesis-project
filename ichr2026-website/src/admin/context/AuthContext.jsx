import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('adminUser');
        const storedToken = localStorage.getItem('accessToken');
        
        if (storedUser && storedToken) {
          // Validate token with backend
          const response = await fetch('http://localhost:5002/api/admin/dashboard', {
            headers: {
              'Authorization': `Bearer ${storedToken}`
            }
          });
          
          if (response.ok) {
            setUser(JSON.parse(storedUser));
          } else {
            // Token is invalid, try to refresh
            await refreshToken();
          }
        }
      } catch (err) {
        console.error('Authentication check failed:', err);
        logout();
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5002/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }
      
      // Store user and tokens
      localStorage.setItem('adminUser', JSON.stringify(data.user));
      localStorage.setItem('accessToken', data.access_token);
      localStorage.setItem('refreshToken', data.refresh_token);
      
      setUser(data.user);
      return data.user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        console.log('No refresh token found');
        return false;
      }
      
      console.log('Attempting to refresh token...');
      const response = await fetch('http://localhost:5002/api/admin/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${refreshToken}`
        }
      });
      
      if (!response.ok) {
        console.error('Token refresh failed with status:', response.status);
        throw new Error('Token refresh failed');
      }
      
      const data = await response.json();
      console.log('Token refreshed successfully');
      localStorage.setItem('accessToken', data.access_token);
      
      // Restore user from localStorage
      const storedUser = localStorage.getItem('adminUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      
      return true;
    } catch (error) {
      console.error('Error refreshing token:', error);
      logout();
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('adminUser');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      error, 
      login, 
      logout, 
      refreshToken,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;