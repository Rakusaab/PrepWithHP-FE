export async function fetcher<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    ...init,
    credentials: 'include',
    headers: {
      ...(init?.headers || {}),
      'Authorization': typeof window !== 'undefined' ? `Bearer ${localStorage.getItem('access_token')}` : '',
    },
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw error || { message: 'Unknown error' };
  }
  return res.json();
}
