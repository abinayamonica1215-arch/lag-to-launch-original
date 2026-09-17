/**
 * Centralized API Client
 * Configured with VITE_API_BASE_URL.
 * Supports token injection, uniform error handling, and mock fallbacks
 * so the frontend is immediately usable and seamlessly connects when Member 2 runs FastAPI.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  getToken() {
    return localStorage.getItem('lag_to_launch_token');
  }

  setToken(token) {
    if (token) {
      localStorage.setItem('lag_to_launch_token', token);
    } else {
      localStorage.removeItem('lag_to_launch_token');
    }
  }

  async request(endpoint, options = {}, mockFallback = null) {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const token = this.getToken();

    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), options.timeout || 8000);

      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const contentType = response.headers.get('content-type');
      let data = null;
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        const errorMessage = (data && data.detail) || (data && data.message) || `HTTP error ${response.status}`;
        const error = new Error(errorMessage);
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (err) {
      // If server is not reachable and mockFallback is provided, return mock fallback
      if ((err.name === 'AbortError' || err.name === 'TypeError' || err.message.includes('Failed to fetch')) && mockFallback) {
        console.info(`[API Fallback] Backend not reachable at ${url}. Serving Member 2 mock contract:`, endpoint);
        // Simulate minor async network delay
        await new Promise((res) => setTimeout(res, 250));
        return typeof mockFallback === 'function' ? mockFallback() : mockFallback;
      }
      throw err;
    }
  }

  get(endpoint, options = {}, mockFallback = null) {
    return this.request(endpoint, { method: 'GET', ...options }, mockFallback);
  }

  post(endpoint, body, options = {}, mockFallback = null) {
    return this.request(endpoint, { method: 'POST', body: JSON.stringify(body), ...options }, mockFallback);
  }

  put(endpoint, body, options = {}, mockFallback = null) {
    return this.request(endpoint, { method: 'PUT', body: JSON.stringify(body), ...options }, mockFallback);
  }

  delete(endpoint, options = {}, mockFallback = null) {
    return this.request(endpoint, { method: 'DELETE', ...options }, mockFallback);
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;
