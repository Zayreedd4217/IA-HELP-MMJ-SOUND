import { useState, useCallback, useEffect } from "react";
import axios from "axios";

export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
}

const API_BASE = "/api";
const TOKEN_KEY = "auth_token";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth from localStorage
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      verifyToken(token);
    }
  }, []);

  const verifyToken = useCallback(async (token: string) => {
    try {
      const response = await axios.get<User>(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
      setIsAuthenticated(true);
      setError(null);
    } catch (err) {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  const register = useCallback(
    async (email: string, username: string, password: string): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.post<{ token: string; user: User }>(
          `${API_BASE}/auth/register`,
          { email, username, password }
        );
        const { token, user } = response.data;
        localStorage.setItem(TOKEN_KEY, token);
        setUser(user);
        setIsAuthenticated(true);
        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Registration failed";
        setError(message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.post<{ token: string; user: User }>(
          `${API_BASE}/auth/login`,
          { email, password }
        );
        const { token, user } = response.data;
        localStorage.setItem(TOKEN_KEY, token);
        setUser(user);
        setIsAuthenticated(true);
        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Login failed";
        setError(message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  }, []);

  const getToken = useCallback(() => {
    return localStorage.getItem(TOKEN_KEY);
  }, []);

  return {
    user,
    loading,
    error,
    isAuthenticated,
    register,
    login,
    logout,
    getToken,
  };
}
