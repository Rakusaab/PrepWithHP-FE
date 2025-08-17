import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login, logout, register } from '../lib/api/auth';
import { useState } from 'react';
import { Token, User } from '../lib/api/types';

export function useAuth() {
  const queryClient = useQueryClient();
  const [authError, setAuthError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loginMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      setLoading(true);
      setAuthError(null);
      try {
        const token = await login(data.email, data.password);
        setLoading(false);
        return token;
      } catch (e: any) {
        setAuthError(e?.response?.data?.detail || 'Login failed');
        setLoading(false);
        throw e;
      }
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: Partial<User> & { password: string }) => {
      setLoading(true);
      setAuthError(null);
      try {
        const user = await register(data);
        setLoading(false);
        return user;
      } catch (e: any) {
        setAuthError(e?.response?.data?.detail || 'Registration failed');
        setLoading(false);
        throw e;
      }
    },
  });

  const logoutUser = () => {
    logout();
    queryClient.clear();
  };

  return {
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutUser,
    loading,
    error: authError,
  };
}
