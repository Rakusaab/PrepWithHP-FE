import api from './axios';
import { Token, User } from './types';
import { setAccessToken, setRefreshToken, removeAccessToken, removeRefreshToken } from './token';

export async function login(email: string, password: string): Promise<Token> {
  const form = new URLSearchParams();
  form.append('username', email);
  form.append('password', password);
  const { data } = await api.post<Token>('/api/v1/auth/login', form, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  setAccessToken(data.access_token);
  setRefreshToken(data.refresh_token);
  return data;
}

export async function logout() {
  removeAccessToken();
  removeRefreshToken();
}

export async function register(user: Partial<User> & { password: string }): Promise<User> {
  const { data } = await api.post<User>('/api/v1/auth/register', user);
  return data;
}
