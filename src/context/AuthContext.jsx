import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api';

const AuthContext = createContext(null);

const cleanUser = (userObj) => {
  if (!userObj) return null;
  let fullName = userObj.fullName || userObj.name || '';
  let department = userObj.department || '';
  const email = (userObj.email || '').toLowerCase();
  const emailPrefix = email ? email.split('@')[0] : '';

  // Check if saved fullName is actually an email or email prefix (e.g. Nithiyashree63)
  const isEmailOrPrefix =
    !fullName ||
    fullName.includes('@') ||
    (emailPrefix && fullName.toLowerCase().replace(/[\s._-]+/g, '') === emailPrefix.toLowerCase().replace(/[\s._-]+/g, ''));

  // Lookup from user registry if name or department is invalid/missing/fallback
  try {
    const registry = JSON.parse(localStorage.getItem('lag_to_launch_users_registry') || '{}');
    if (email && registry[email]) {
      if (isEmailOrPrefix && registry[email].fullName) {
        fullName = registry[email].fullName;
      }
      if ((!department || department === 'Not specified' || department === 'General Engineering') && registry[email].department) {
        department = registry[email].department;
      }
    }
  } catch (_) {}

  // If still email or empty, fallback to clean 'Student'
  if (!fullName || fullName.includes('@') || (emailPrefix && fullName.toLowerCase().replace(/[\s._-]+/g, '') === emailPrefix.toLowerCase().replace(/[\s._-]+/g, ''))) {
    fullName = 'Student';
  }

  return {
    ...userObj,
    fullName,
    name: fullName,
    department: department || 'Not specified',
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('lag_to_launch_user');
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      // Auto-purge legacy demo user named 'Alex Morgan' or 'std_demo_101'
      if (parsed?.fullName?.includes('Alex') || parsed?.id === 'std_demo_101') {
        localStorage.removeItem('lag_to_launch_user');
        localStorage.removeItem('lag_to_launch_mock_user');
        localStorage.removeItem('lag_to_launch_token');
        return null;
      }
      return cleanUser(parsed);
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('lag_to_launch_token');
        if (token) {
          const res = await authApi.getProfile();
          if (res?.user && !res.user.fullName?.includes('Alex') && res.user.id !== 'std_demo_101') {
            const cleaned = cleanUser(res.user);
            setUser(cleaned);
            localStorage.setItem('lag_to_launch_user', JSON.stringify(cleaned));
          } else {
            localStorage.removeItem('lag_to_launch_user');
            localStorage.removeItem('lag_to_launch_token');
            localStorage.removeItem('lag_to_launch_mock_user');
            setUser(null);
          }
        }
      } catch (err) {
        console.warn('Auto auth fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (credentials) => {
    const res = await authApi.login(credentials);
    if (res?.user) {
      const cleaned = cleanUser(res.user);
      setUser(cleaned);
      localStorage.setItem('lag_to_launch_user', JSON.stringify(cleaned));
      localStorage.setItem('lag_to_launch_mock_user', JSON.stringify(cleaned));
    }
    return res;
  };

  const register = async (userData) => {
    const res = await authApi.register(userData);
    if (res?.user) {
      const cleaned = cleanUser(res.user);
      setUser(cleaned);
      localStorage.setItem('lag_to_launch_user', JSON.stringify(cleaned));
      localStorage.setItem('lag_to_launch_mock_user', JSON.stringify(cleaned));
    }
    return res;
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
    localStorage.removeItem('lag_to_launch_user');
    localStorage.removeItem('lag_to_launch_token');
  };

  const updateProfile = (newProfileData) => {
    const updated = { ...(user || {}), ...newProfileData };
    setUser(updated);
    localStorage.setItem('lag_to_launch_user', JSON.stringify(updated));
    localStorage.setItem('lag_to_launch_mock_user', JSON.stringify(updated));
    return updated;
  };

  const updateAcademicStatus = (newStatus) => {
    if (user) {
      const updated = { ...user, academicStatus: newStatus };
      setUser(updated);
      localStorage.setItem('lag_to_launch_user', JSON.stringify(updated));
      localStorage.setItem('lag_to_launch_mock_user', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        updateAcademicStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
