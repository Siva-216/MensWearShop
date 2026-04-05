const BASE_URL = 'http://localhost:8082/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

export const api = {
  // Auth & Users
  auth: {
    login: (data: any) => fetch(`${BASE_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(res => res.json()),

    register: (data: any) => fetch(`${BASE_URL}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(res => res.json()),

    getProfile: () => fetch(`${BASE_URL}/users/profile`, {
      headers: getHeaders(),
    }).then(res => res.json()),
  },

  users: {
    getAll: () => fetch(`${BASE_URL}/users`, { headers: getHeaders() }).then(res => res.json()),
    update: (id: string, data: any) => fetch(`${BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(res => res.json()),
    delete: (id: string) => fetch(`${BASE_URL}/users/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    }).then(res => res.ok),
  },

  // Products
  products: {
    getAll: () => fetch(`${BASE_URL}/products`).then(res => res.json()).then((data: any[]) => data.map(p => ({ ...p, category: p.categoryName || p.category }))),
    getById: (id: string) => fetch(`${BASE_URL}/products/${id}`).then(res => res.json()).then((p: any) => ({ ...p, category: p.categoryName || p.category })),
    getByCategory: (categoryId: string) => fetch(`${BASE_URL}/products/category/${categoryId}`).then(res => res.json()).then((data: any[]) => data.map(p => ({ ...p, category: p.categoryName || p.category }))),
    create: (data: any) => fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(res => res.json()),
    update: (id: string, data: any) => fetch(`${BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(res => res.json()),
    delete: (id: string) => fetch(`${BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    }).then(res => res.ok),
  },

  // Categories
  categories: {
    getAll: () => fetch(`${BASE_URL}/categories`).then(res => res.json()),
    getById: (id: string) => fetch(`${BASE_URL}/categories/${id}`).then(res => res.json()),
    create: (data: any) => fetch(`${BASE_URL}/categories`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(res => res.json()),
    update: (id: string, data: any) => fetch(`${BASE_URL}/categories/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(res => res.json()),
    delete: (id: string) => fetch(`${BASE_URL}/categories/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    }).then(res => res.ok),
  },

  // Orders
  orders: {
    getAll: () => fetch(`${BASE_URL}/orders`, { headers: getHeaders() }).then(res => res.json()),
    getByUser: (userId: string) => fetch(`${BASE_URL}/orders/user/${userId}`, { headers: getHeaders() }).then(res => res.json()),
    create: (data: any) => fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(res => res.json()),
    updateStatus: (id: string, status: string) => fetch(`${BASE_URL}/orders/${id}/status?status=${status}`, {
      method: 'PUT',
      headers: getHeaders(),
    }).then(res => res.json()),
  },

  // Reviews
  reviews: {
    getAll: () => fetch(`${BASE_URL}/reviews`).then(res => res.json()),
    getByProduct: (productId: string) => fetch(`${BASE_URL}/reviews/product/${productId}`).then(res => res.json()),
    create: (data: any) => fetch(`${BASE_URL}/reviews`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    }).then(res => res.json()),
    delete: (id: string) => fetch(`${BASE_URL}/reviews/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    }).then(res => res.ok),
  }
};
