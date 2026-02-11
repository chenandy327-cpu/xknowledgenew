
import React, { useState, useEffect, createContext, useContext, lazy, Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import CreateModal from './components/CreateModal';
import { AppTheme } from './types';
import { api } from './src/services/api';

// 懒加载组件
const LoginPage = lazy(() => import('./pages/LoginPage'));
const DiscoveryPage = lazy(() => import('./pages/DiscoveryPage'));
const GroupPage = lazy(() => import('./pages/GroupPage'));
const LocalPage = lazy(() => import('./pages/LocalPage'));
const CoursePage = lazy(() => import('./pages/CoursePage'));
const MessagePage = lazy(() => import('./pages/MessagePage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));

interface AppContextType {
  theme: AppTheme;
  toggleTheme: () => void;
  isLoggedIn: boolean;
  isAdmin: boolean;
  login: () => void;
  logout: () => void;
  checkAdminStatus: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

const App: React.FC = () => {
  // Initialize state from localStorage
  const [theme, setTheme] = useState<AppTheme>(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? (savedTheme as AppTheme) : AppTheme.LIGHT;
  });
  
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const savedLoginStatus = localStorage.getItem('isLoggedIn');
    const token = localStorage.getItem('token');
    return savedLoginStatus === 'true' && !!token;
  });
  
  // Check token validity and admin status on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        // Here you would typically verify the token with the backend
        // For now, we'll just check if it exists
        setIsLoggedIn(true);
        // Also check admin status
        await checkAdminStatus();
      }
    };
    
    checkAuthStatus();
    
    // Set up periodic token check (every 5 minutes)
    const interval = setInterval(checkAuthStatus, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Apply theme on initial load
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === AppTheme.DARK);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === AppTheme.LIGHT ? AppTheme.DARK : AppTheme.LIGHT;
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === AppTheme.DARK);
    // Save theme to localStorage
    localStorage.setItem('theme', newTheme);
  };

  const [isAdmin, setIsAdmin] = useState(() => {
    const savedAdminStatus = localStorage.getItem('isAdmin');
    return savedAdminStatus === 'true';
  });

  const login = () => {
    setIsLoggedIn(true);
    // Save login status to localStorage
    localStorage.setItem('isLoggedIn', 'true');
    // Check admin status after login
    checkAdminStatus();
  };

  const logout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    // Remove login status from localStorage
    localStorage.removeItem('isLoggedIn');
    // Remove admin status from localStorage
    localStorage.removeItem('isAdmin');
    // Remove token from localStorage
    localStorage.removeItem('token');
  };

  const checkAdminStatus = async () => {
    // Make an API call to check the user's role
    try {
      const response: any = await api.getUserRole();
      const userRole = response.role;
      const isAdminUser = userRole === 'admin';
      setIsAdmin(isAdminUser);
      localStorage.setItem('isAdmin', isAdminUser.toString());
    } catch (error) {
      console.error('Error checking admin status:', error);
      // If there's an error, default to non-admin
      setIsAdmin(false);
      localStorage.setItem('isAdmin', 'false');
    }
  };

  return (
    <AppContext.Provider value={{ theme, toggleTheme, isLoggedIn, isAdmin, login, logout, checkAdminStatus }}>
      <HashRouter>
        <div className="flex min-h-screen">
          {isLoggedIn && <Sidebar onOpenCreate={() => setIsCreateModalOpen(true)} />}
          <main className={`flex-1 ${isLoggedIn ? 'ml-20 lg:ml-64' : ''}`}>
            <Suspense fallback={
              <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            }>
              <Routes>
                {!isLoggedIn ? (
                  <>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                  </>
                ) : (
                  <>
                    <Route path="/" element={<DiscoveryPage />} />
                    <Route path="/groups" element={<GroupPage />} />
                    <Route path="/local" element={<LocalPage />} />
                    <Route path="/courses" element={<CoursePage />} />
                    <Route path="/messages" element={<MessagePage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </>
                )}
              </Routes>
            </Suspense>
          </main>
        </div>
        {isCreateModalOpen && <CreateModal onClose={() => setIsCreateModalOpen(false)} />}
      </HashRouter>
    </AppContext.Provider>
  );
};

export default App;
