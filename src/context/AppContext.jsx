import React, { createContext, useContext, useState, useEffect } from 'react';
import { arrearsApi } from '../api';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [activeRoadmap, setActiveRoadmap] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const loadActiveRoadmap = async () => {
    try {
      const res = await arrearsApi.getActiveRoadmap();
      if (res?.roadmap) {
        setActiveRoadmap(res);
      }
    } catch (err) {
      console.warn('Failed to load active roadmap:', err);
    }
  };

  useEffect(() => {
    loadActiveRoadmap();
  }, []);

  return (
    <AppContext.Provider
      value={{
        activeRoadmap,
        setActiveRoadmap,
        loadActiveRoadmap,
        showToast,
        toast,
      }}
    >
      {children}
      {/* Global Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-lg shadow-elevated border flex items-center gap-3 transition-all duration-300 animate-slide-in ${
            toast.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : toast.type === 'info'
              ? 'bg-sky-50 border-sky-200 text-sky-800'
              : 'bg-emerald-50 border-emerald-200 text-[#0F766E]'
          }`}
        >
          <span className="text-sm font-medium">{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="text-xs font-semibold underline hover:opacity-75 ml-2"
          >
            Dismiss
          </button>
        </div>
      )}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
