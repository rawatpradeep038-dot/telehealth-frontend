const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

const headers = () => ({
  'Content-Type': 'application/json',
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
});

export const api = {
  post: async (endpoint: string, body: object) => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(body),
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  get: async (endpoint: string) => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: headers(),
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  patch: async (endpoint: string, body: object) => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: headers(),
      body: JSON.stringify(body),
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  delete: async (endpoint: string) => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: headers(),
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },
};