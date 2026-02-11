
import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import DiscoveryPage from './pages/DiscoveryPage';
import GroupPage from './pages/GroupPage';
import LocalPage from './pages/LocalPage';
import CoursePage from './pages/CoursePage';
import MessagePage from './pages/MessagePage';
import ProfilePage from './pages/ProfilePage';
import CreateModal from './components/CreateModal';
import { AppTheme } from './types';

interface AppContextType {
  theme: AppTheme;
  toggleTheme: () => void;
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
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
  
  // Check token validity on initial load
  useEffect(() => {
    const checkTokenValidity = () => {
      const token = localStorage.getItem('token');
      if (token) {
        // Here you would typically verify the token with the backend
        // For now, we'll just check if it exists
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        localStorage.removeItem('isLoggedIn');
      }
    };
    
    checkTokenValidity();
    
    // Set up periodic token check (every 5 minutes)
    const interval = setInterval(checkTokenValidity, 5 * 60 * 1000);
    
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

  const login = () => {
    setIsLoggedIn(true);
    // Save login status to localStorage
    localStorage.setItem('isLoggedIn', 'true');
  };

  const logout = () => {
    setIsLoggedIn(false);
    // Remove login status from localStorage
    localStorage.removeItem('isLoggedIn');
    // Remove token from localStorage
    localStorage.removeItem('token');
  };

  return (
    <AppContext.Provider value={{ theme, toggleTheme, isLoggedIn, login, logout }}>
      <HashRouter>
        <div className="flex min-h-screen">
          {isLoggedIn && <Sidebar onOpenCreate={() => setIsCreateModalOpen(true)} />}
          <main className={`flex-1 ${isLoggedIn ? 'ml-20 lg:ml-64' : ''}`}>
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
                  <Route path="*" element={<Navigate to="/" replace />} />
                </>
              )}
            </Routes>
          </main>
        </div>
        {isCreateModalOpen && <CreateModal onClose={() => setIsCreateModalOpen(false)} />}
      </HashRouter>
    </AppContext.Provider>
  );
};

export default App;
