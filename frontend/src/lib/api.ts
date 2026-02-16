// src/lib/api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export async function getRooms(params?: Record<string, any>) {
  const query = params
    ? '?' + new URLSearchParams(params as any).toString()
    : '';
  const res = await fetch(`${API_BASE_URL}/rooms${query}`);
  if (!res.ok) {
    throw new Error('Failed to fetch rooms');
  }
  return res.json();
}

export async function getRoom(id: string) {
  const res = await fetch(`${API_BASE_URL}/rooms/${id}`);
  if (!res.ok) {
    throw new Error('Failed to fetch room details');
  }
  return res.json();
}

// Pour login/register
export async function login(data: { email: string; password: string }) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Login failed');
  return res.json();
}

export async function register(data: { name: string; email: string; password: string }) {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Register failed');
  return res.json();
}
