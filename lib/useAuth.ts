'use client'; // Client-side hook

import { useState } from 'react';
import { login } from '@/lib/auth';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface LoginResponse {
  user?: User;
  token?: string;
  error?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Login function
  const login = async (email: string, password: string, role: string): Promise<LoginResponse> => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        return { error: data.error };
      }

      setUser(data.user);
      setToken(data.token);
      return data;
    } catch (err: any) {
      setError(err.message);
      return { error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return {
    user,
    token,
    loading,
    error,
    login,
    logout,
  };
}
