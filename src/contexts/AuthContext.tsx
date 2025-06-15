'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Define user type
interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  role: string;
  // Add other user properties as needed
}

// Define authentication context type
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
}

// Create the authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Authentication provider props
interface AuthProviderProps {
  children: React.ReactNode;
}

// Create the authentication provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check if user is authenticated
  const isAuthenticated = !!user;

  // Initialize authentication state
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check if access token exists in local storage
        const token = localStorage.getItem('accessToken');
        
        if (token) {
          // Fetch user profile
          const response = await fetch('/api/users/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
          } else {
            // If token is invalid, try to refresh it
            const refreshed = await refreshToken();
            if (!refreshed) {
              // If refresh fails, clear authentication state
              setUser(null);
              localStorage.removeItem('accessToken');
            }
          }
        }
      } catch (error) {
        console.error('Authentication initialization error:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Include cookies
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      
      // Save access token to local storage
      localStorage.setItem('accessToken', data.accessToken);
      
      // Set user state
      setUser(data.user);
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
        credentials: 'include', // Include cookies
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      
      // Save access token to local storage
      localStorage.setItem('accessToken', data.accessToken);
      
      // Set user state
      setUser(data.user);
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include', // Include cookies
      });
      
      // Clear authentication state
      setUser(null);
      localStorage.removeItem('accessToken');
      
      // Redirect to home page
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh token function
  const refreshToken = async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include', // Include cookies
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      
      // Save new access token to local storage
      localStorage.setItem('accessToken', data.accessToken);
      
      // Fetch user profile with new token
      const userResponse = await fetch('/api/users/me', {
        headers: {
          Authorization: `Bearer ${data.accessToken}`,
        },
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUser(userData.user);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  };

  // Create context value
  const contextValue: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the authentication context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

// Higher-order component to protect routes that require authentication
export const withAuthProtection = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  const WithAuthProtection: React.FC<P> = (props) => {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.push('/login');
      }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
      return null;
    }

    return <Component {...props} />;
  };

  return WithAuthProtection;
};

// Higher-order component to protect routes that require specific roles
export const withRoleProtection = <P extends object>(
  Component: React.ComponentType<P>,
  allowedRoles: string[]
): React.FC<P> => {
  const WithRoleProtection: React.FC<P> = (props) => {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && (!isAuthenticated || (user && !allowedRoles.includes(user.role)))) {
        router.push('/unauthorized');
      }
    }, [user, isAuthenticated, isLoading, router]);

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (!isAuthenticated || (user && !allowedRoles.includes(user.role))) {
      return null;
    }

    return <Component {...props} />;
  };

  return WithRoleProtection;
};

export default AuthContext;