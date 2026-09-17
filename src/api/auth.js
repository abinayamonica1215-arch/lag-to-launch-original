import apiClient from './client';

export const authApi = {
  /**
   * Register a new student
   * @param {Object} userData
   */
  async register(userData) {
    const fallback = () => {
      const newUser = {
        id: 'std_' + Math.random().toString(36).substring(2, 9),
        fullName: userData.fullName,
        email: userData.email,
        collegeName: userData.collegeName,
        department: userData.department,
        batch: userData.batch,
        academicPosition: userData.academicPosition,
        currentSemester: userData.currentSemester || null,
        academicStatus: userData.academicStatus,
      };

      // Save to per-email registry so login can find this user by email
      try {
        const registry = JSON.parse(localStorage.getItem('lag_to_launch_users_registry') || '{}');
        registry[userData.email.toLowerCase()] = newUser;
        localStorage.setItem('lag_to_launch_users_registry', JSON.stringify(registry));
      } catch (_) {}

      return {
        success: true,
        message: 'Registration successful',
        token: 'mock-jwt-token-' + Date.now(),
        user: newUser,
      };
    };

    const response = await apiClient.post('/auth/register', userData, {}, fallback);
    if (response.token) {
      apiClient.setToken(response.token);
    }
    return response;
  },

  /**
   * Login student
   * @param {Object} credentials { email, password }
   */
  async login(credentials) {
    const fallback = () => {
      const emailKey = (credentials.email || '').toLowerCase();

      // 1. Look up by email in the per-user registry (most reliable)
      try {
        const registry = JSON.parse(localStorage.getItem('lag_to_launch_users_registry') || '{}');
        if (registry[emailKey]) {
          return {
            success: true,
            message: 'Login successful',
            token: 'mock-jwt-token-login',
            user: registry[emailKey],
          };
        }
      } catch (_) {}

      // 2. Fall back to the last saved user (single-user session)
      const savedUserStr = localStorage.getItem('lag_to_launch_user') || localStorage.getItem('lag_to_launch_mock_user');
      if (savedUserStr) {
        const savedUser = JSON.parse(savedUserStr);
        // Only use it if the email matches
        if (savedUser.email && savedUser.email.toLowerCase() === emailKey) {
          return {
            success: true,
            message: 'Login successful',
            token: 'mock-jwt-token-login',
            user: savedUser,
          };
        }
      }

      // 3. Last resort — if user logged in without prior registration, use generic fallback (NEVER extract from email)
      const user = {
        id: 'std_' + Math.random().toString(36).substring(2, 9),
        fullName: 'Student',
        email: credentials.email || '',
        collegeName: 'Not specified',
        department: 'Not specified',
        batch: '',
        academicPosition: 'Currently studying',
        currentSemester: '',
        academicStatus: 'Active Arrears',
      };

      return {
        success: true,
        message: 'Login successful',
        token: 'mock-jwt-token-login',
        user,
      };
    };

    const response = await apiClient.post('/auth/login', credentials, {}, fallback);
    if (response.token) {
      apiClient.setToken(response.token);
    }
    return response;
  },

  /**
   * Get current authenticated user profile
   */
  async getProfile() {
    const fallback = () => {
      const savedUserStr = localStorage.getItem('lag_to_launch_user') || localStorage.getItem('lag_to_launch_mock_user');
      return {
        success: true,
        user: savedUserStr ? JSON.parse(savedUserStr) : null,
      };
    };

    return apiClient.get('/auth/profile', {}, fallback);
  },

  /**
   * Logout user
   */
  logout() {
    apiClient.setToken(null);
    return Promise.resolve({ success: true });
  },
};

export default authApi;
