import apiClient from './client';

export const authApi = {
  /**
   * Register a new student
   * @param {Object} userData
   */
  async register(userData) {
    // Parse semester into integer, default to 7 if missing/not studying
    let semInt = 7;
    if (userData.currentSemester) {
      const parsed = parseInt(String(userData.currentSemester).replace(/\\D/g, ''), 10);
      if (!isNaN(parsed) && parsed > 0) {
        semInt = parsed;
      }
    }

    const payload = {
      name: userData.fullName,
      email: userData.email,
      password: userData.password,
      department_code: userData.department,
      semester: semInt
    };

    // 1. Call backend register
    const regResponse = await apiClient.post('/auth/register', payload);

    // 2. Call backend login to get token, as backend register doesn't return access_token
    const loginPayload = {
      email: userData.email,
      password: userData.password
    };
    
    // We try to login automatically
    try {
      const loginRes = await this.login(loginPayload);
      
      // We also want to merge any frontend-specific extra fields like academicStatus
      if (loginRes.user) {
        loginRes.user.academicStatus = userData.academicStatus;
        loginRes.user.collegeName = userData.collegeName;
        loginRes.user.batch = userData.batch;
        loginRes.user.academicPosition = userData.academicPosition;
      }
      
      return loginRes;
    } catch (e) {
      // If auto-login fails, return the register response
      return {
        success: true,
        message: regResponse.message,
        user: {
          id: regResponse.student.id,
          fullName: regResponse.student.name,
          email: regResponse.student.email,
          department: regResponse.student.department_code,
          currentSemester: 'Semester ' + regResponse.student.semester,
          academicStatus: userData.academicStatus,
        }
      };
    }
  },

  /**
   * Login student
   * @param {Object} credentials { email, password }
   */
  async login(credentials) {
    let response;
    try {
      response = await apiClient.post('/auth/login', credentials);
    } catch (err) {
      const isNetworkError =
        err instanceof TypeError ||
        err?.name === 'TypeError' ||
        err?.name === 'AbortError' ||
        (err?.message && (
          err.message.includes('Failed to fetch') ||
          err.message.includes('NetworkError') ||
          err.message.includes('network') ||
          err.message.includes('aborted')
        ));

      if (isNetworkError) {
        throw new Error('Unable to connect to the server. Please make sure the backend is running and try again.');
      }
      throw err;
    }
    
    if (response.access_token) {
      apiClient.setToken(response.access_token);
    }

    // Read previous user object from local storage to preserve non-backend fields if available
    let prevUser = {};
    try {
      const savedUserStr = localStorage.getItem('lag_to_launch_user');
      if (savedUserStr) {
        prevUser = JSON.parse(savedUserStr);
        // Only reuse if email matches
        if (prevUser.email && prevUser.email.toLowerCase() !== (credentials.email || '').toLowerCase()) {
          prevUser = {};
        }
      }
    } catch(e) {}
    
    return {
      success: true,
      message: response.message,
      token: response.access_token,
      user: {
        ...prevUser, // preserves academicStatus, collegeName etc. if they exist
        id: response.student.id,
        fullName: response.student.name,
        name: response.student.name,
        email: response.student.email,
        department: response.student.department_code,
        currentSemester: 'Semester ' + response.student.semester,
        academicStatus: prevUser.academicStatus || 'Active Arrears' // default fallback
      }
    };
  },

  /**
   * Get current authenticated user profile
   */
  async getProfile() {
    const student = await apiClient.get('/auth/me');
    
    // Similarly preserve extra fields from localStorage
    let prevUser = {};
    try {
      const savedUserStr = localStorage.getItem('lag_to_launch_user');
      if (savedUserStr) {
        prevUser = JSON.parse(savedUserStr);
      }
    } catch(e) {}
    
    return {
      success: true,
      user: {
        ...prevUser,
        id: student.id,
        fullName: student.name,
        name: student.name,
        email: student.email,
        department: student.department_code,
        currentSemester: 'Semester ' + student.semester,
        academicStatus: prevUser.academicStatus || 'Active Arrears'
      }
    };
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
