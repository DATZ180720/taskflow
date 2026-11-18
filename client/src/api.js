const BASE = '/api/tasks';

async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (res.status === 204) return null;
  const data = await res.json();
  if (!res.ok) throw new Error(data.errors?.join(', ') ?? data.error ?? 'Request failed');
  return data;
}

export const api = {
  list: (filters = {}) => {
    const params = new URLSearchParams(Object.entries(filters).filter(([, v]) => v));
    return request(`${BASE}?${params}`);
  },
  stats: () => request(`${BASE}/stats`),
  create: (task) => request(BASE, { method: 'POST', body: JSON.stringify(task) }),
  update: (id, changes) => request(`${BASE}/${id}`, { method: 'PATCH', body: JSON.stringify(changes) }),
  remove: (id) => request(`${BASE}/${id}`, { method: 'DELETE' }),
};
