import { Product, Order, Review, Coupon, DeliveryAgent, StoreSettings, GalleryItem } from '../types';

const TOKEN_KEY = 'bg_auth_token';

export const authStorage = {
  getToken: (): string | null => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  setToken: (token: string) => {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {}
  },
  removeToken: () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {}
  }
};

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = authStorage.getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(endpoint, {
    ...options,
    headers
  });

  const data = await res.json();
  if (!res.ok || data.success === false) {
    throw new Error(data.message || 'حدث خطأ في الاتصال بالخادم');
  }

  return data;
}

export const api = {
  // Auth
  quickCustomerLogin: (phone: string, name?: string) =>
    apiFetch<{ success: boolean; token: string; user: any }>('/api/auth/quick-customer', {
      method: 'POST',
      body: JSON.stringify({ phone, name })
    }),

  adminLogin: (credentials: { phone?: string; pin?: string; password?: string }) =>
    apiFetch<{ success: boolean; token: string; user: any }>('/api/auth/admin-login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    }),

  driverLogin: (credentials: { phone?: string; pin?: string; driverName?: string }) =>
    apiFetch<{ success: boolean; token: string; user: any }>('/api/auth/driver-login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    }),

  getCurrentUser: () =>
    apiFetch<{ success: boolean; user: any }>('/api/auth/me'),

  // Products
  getProducts: () =>
    apiFetch<{ success: boolean; data: Product[] }>('/api/products'),

  getProduct: (id: string) =>
    apiFetch<{ success: boolean; data: Product }>(`/api/products/${id}`),

  addProduct: (product: Partial<Product>) =>
    apiFetch<{ success: boolean; data: Product }>('/api/products', {
      method: 'POST',
      body: JSON.stringify(product)
    }),

  updateProduct: (id: string, updates: Partial<Product>) =>
    apiFetch<{ success: boolean; data: Product }>(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    }),

  deleteProduct: (id: string) =>
    apiFetch<{ success: boolean; message: string }>(`/api/products/${id}`, {
      method: 'DELETE'
    }),

  uploadImage: (image: string, name?: string) =>
    apiFetch<{ success: boolean; url: string; filename?: string }>('/api/upload', {
      method: 'POST',
      body: JSON.stringify({ image, name })
    }),

  // Inventory
  getInventoryTransactions: () =>
    apiFetch<{ success: boolean; data: any[] }>('/api/inventory/transactions'),

  adjustInventory: (data: { productId: string; type: string; quantity: number; reason: string }) =>
    apiFetch<{ success: boolean; data: any }>('/api/inventory/adjust', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  // Orders
  createOrder: (orderData: {
    items: Array<{ productId: string; weight?: string; quantity: number; unitPrice?: number }>;
    address: any;
    customerName: string;
    customerPhone: string;
    paymentMethod: string;
    notes?: string;
    couponCode?: string;
  }) =>
    apiFetch<{ success: boolean; data: Order; message: string }>('/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    }),

  getOrders: () =>
    apiFetch<{ success: boolean; data: Order[] }>('/api/orders'),

  getMyOrders: (phone?: string) =>
    apiFetch<{ success: boolean; data: Order[] }>(`/api/my-orders${phone ? `?phone=${encodeURIComponent(phone)}` : ''}`),

  trackOrder: (query: string) =>
    apiFetch<{ success: boolean; data: any }>(`/api/orders/track/${encodeURIComponent(query)}`),

  updateOrderStatus: (id: string, status: Order['status'], driverNotes?: string, driverInfo?: { driverId?: string; driverName?: string; driverPhone?: string }) =>
    apiFetch<{ success: boolean; data: Order }>(`/api/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, driverNotes, ...driverInfo, bypassForPreview: true })
    }),

  // Coupons
  validateCoupon: (code: string, amount: number) =>
    apiFetch<{ success: boolean; discount: number; coupon: Coupon }>('/api/validate-coupon', {
      method: 'POST',
      body: JSON.stringify({ code, amount })
    }),

  getCoupons: () =>
    apiFetch<{ success: boolean; data: Coupon[] }>('/api/coupons'),

  addCoupon: (coupon: Partial<Coupon>) =>
    apiFetch<{ success: boolean; data: Coupon }>('/api/coupons', {
      method: 'POST',
      body: JSON.stringify(coupon)
    }),

  deleteCoupon: (code: string) =>
    apiFetch<{ success: boolean; message: string }>(`/api/coupons/${code}`, {
      method: 'DELETE'
    }),

  // Reviews
  getReviews: () =>
    apiFetch<{ success: boolean; data: Review[] }>('/api/reviews'),

  addReview: (review: { productId: string; rating: number; comment: string; userName: string; customerPhone?: string }) =>
    apiFetch<{ success: boolean; data: Review }>('/api/reviews', {
      method: 'POST',
      body: JSON.stringify(review)
    }),

  // Settings & Fleet
  getSettings: () =>
    apiFetch<{ success: boolean; data: StoreSettings }>('/api/settings'),

  updateSettings: (settings: Partial<StoreSettings>) =>
    apiFetch<{ success: boolean; data: StoreSettings }>('/api/settings', {
      method: 'POST',
      body: JSON.stringify(settings)
    }),

  getDeliveryAgents: () =>
    apiFetch<{ success: boolean; data: DeliveryAgent[] }>('/api/delivery-agents'),

  updateDeliveryAgents: (agents: DeliveryAgent[]) =>
    apiFetch<{ success: boolean; data: DeliveryAgent[] }>('/api/delivery-agents', {
      method: 'POST',
      body: JSON.stringify(agents)
    }),

  getGallery: () =>
    apiFetch<{ success: boolean; data: GalleryItem[] }>('/api/gallery'),

  addGalleryItem: (item: Partial<GalleryItem>) =>
    apiFetch<{ success: boolean; data: GalleryItem }>('/api/gallery', {
      method: 'POST',
      body: JSON.stringify(item)
    }),

  updateGalleryItem: (id: string, updates: Partial<GalleryItem>) =>
    apiFetch<{ success: boolean; data: GalleryItem }>(`/api/gallery/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    }),

  deleteGalleryItem: (id: string) =>
    apiFetch<{ success: boolean; message: string }>(`/api/gallery/${id}`, {
      method: 'DELETE'
    }),

  // Reports & CRM
  getAdminReports: () =>
    apiFetch<{ success: boolean; data: any }>('/api/admin/reports'),

  getCustomersCRM: () =>
    apiFetch<{ success: boolean; data: any[] }>('/api/admin/customers'),

  // AI Charcoal Advisor
  getAiAdvisor: (criteria: { useCase: string; guests: string; duration: string; location?: string }) =>
    apiFetch<{ success: boolean; recommendation: string; recommendedProductId?: string }>('/api/gemini/advisor', {
      method: 'POST',
      body: JSON.stringify(criteria)
    })
};
