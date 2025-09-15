import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import Navbar from './components/Navbar';
import Welcome from './components/Welcome';
import GameLibrary from './components/GameLibrary';
import StudentProfile from './components/StudentProfile';
import TeacherDashboard from './components/TeacherDashboard';
import Settings from './components/Settings';
import OfflineIndicator from './components/OfflineIndicator';

// Context
import { AppProvider, useApp } from './context/AppContext';

// Database
import { initDatabase } from './database/database';

// Theme
const theme = {
  colors: {
    primary: '#667eea',
    secondary: '#764ba2',
    accent: '#f093fb',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    background: '#f8fafc',
    surface: '#ffffff',
    text: '#1f2937',
    textSecondary: '#6b7280',
    border: '#e5e7eb'
  },
  gradients: {
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    success: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    warning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    error: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
  },
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem'
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem'
  }
};

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: ${props => props.theme.gradients.primary};
    min-height: 100vh;
    height: auto;
    overflow-x: hidden;
    overflow-y: auto;
    position: relative;
  }

  #root {
    min-height: 100vh;
    width: 100%;
    position: relative;
    overflow-y: auto;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }

  /* Accessibility improvements */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    body {
      background: #000;
      color: #fff;
    }
  }

  /* Focus styles for keyboard navigation */
  button:focus-visible,
  input:focus-visible,
  select:focus-visible,
  textarea:focus-visible {
    outline: 2px solid ${props => props.theme.colors.primary};
    outline-offset: 2px;
  }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${props => props.theme.gradients.primary};
  position: relative;
  overflow-y: auto;
`;

const MainContent = styled(motion.main)`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 80px);
  position: relative;
  overflow-y: auto;
`;

const PageContainer = styled.div`
  flex: 1;
  padding: ${props => props.theme.spacing.lg};
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  position: relative;
  overflow-y: auto;
`;

function AppContent() {
  const { t } = useTranslation();
  const { currentUser, isOnline, isLoading } = useApp();
  const [currentPage, setCurrentPage] = useState('welcome');

  // Initialize database on app start
  useEffect(() => {
    initDatabase();
  }, []);

  // Listen for Electron menu events
  useEffect(() => {
    if (window.electronAPI) {
      const handleNewStudent = () => {
        setCurrentPage('profile');
      };

      const handleExportProgress = () => {
        // Handle export functionality
        console.log('Export progress requested');
      };

      window.electronAPI.onMenuNewStudent(handleNewStudent);
      window.electronAPI.onMenuExportProgress(handleExportProgress);

      return () => {
        window.electronAPI.removeAllListeners('menu-new-student');
        window.electronAPI.removeAllListeners('menu-export-progress');
      };
    }
  }, []);

  if (isLoading) {
    return (
      <AppContainer>
        <GlobalStyle />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center h-screen"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-white border-t-transparent rounded-full"
          />
        </motion.div>
      </AppContainer>
    );
  }

  return (
    <AppContainer>
      <GlobalStyle />
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <OfflineIndicator isOnline={isOnline} />
      
      <MainContent
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <AnimatePresence mode="wait">
          <PageContainer key={currentPage}>
            {currentPage === 'welcome' && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <Welcome onNavigate={setCurrentPage} />
              </motion.div>
            )}
            
            {currentPage === 'games' && (
              <motion.div
                key="games"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <GameLibrary />
              </motion.div>
            )}
            
            {currentPage === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <StudentProfile />
              </motion.div>
            )}
            
            {currentPage === 'teacher' && (
              <motion.div
                key="teacher"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <TeacherDashboard />
              </motion.div>
            )}
            
            {currentPage === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Settings />
              </motion.div>
            )}
          </PageContainer>
        </AnimatePresence>
      </MainContent>
    </AppContainer>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;




