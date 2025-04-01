import { createContext, useState, useCallback, useContext } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize state synchronously from localStorage
  const [authState, setAuthState] = useState(() => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('userData');
      
      return {
        token,
        isAuthenticated: !!token,
        user: userData ? JSON.parse(userData) : null,
        initialized: true
      };
    } catch (error) {
      console.error('Error initializing auth state:', error);
      return {
        token: null,
        isAuthenticated: false,
        user: null,
        initialized: true
      };
    }
    
  });

  const login = useCallback((token, user) => {
    try {
      localStorage.setItem('token', token);
      localStorage.setItem('userData', JSON.stringify(user));
      setAuthState({
        token,
        isAuthenticated: true,
        user,
        initialized: true
      });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      setAuthState({
        token: null,
        isAuthenticated: false,
        user: null,
        initialized: true
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, []);

  const value = {
    token: authState.token,
    isAuthenticated: authState.isAuthenticated,
    user: authState.user,
    initialized: authState.initialized,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easier consumption
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

