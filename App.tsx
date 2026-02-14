
import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import { UserRole } from './types';

// Pages (Lazy load for performance)
const AuthPage = React.lazy(() => import('./pages/AuthPage'));
const StudentDashboard = React.lazy(() => import('./pages/student/Dashboard'));
const StudentTestRunner = React.lazy(() => import('./pages/student/TestRunner'));
const StudentResult = React.lazy(() => import('./pages/student/ResultPage'));
const TeacherDashboard = React.lazy(() => import('./pages/teacher/Dashboard'));
const TeacherTestBuilder = React.lazy(() => import('./pages/teacher/TestBuilder'));

const ProtectedRoute = ({ children, allowedRole }: { children?: React.ReactNode, allowedRole: UserRole }) => {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (user?.role !== allowedRole) return <Navigate to="/" replace />;
  
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <React.Suspense fallback={<div className="h-screen flex items-center justify-center font-bold text-gray-400 bg-white">Initializing...</div>}>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        
        {/* Student Routes */}
        <Route path="/student" element={<ProtectedRoute allowedRole={UserRole.STUDENT}><StudentDashboard /></ProtectedRoute>} />
        <Route path="/student/test/:testId" element={<ProtectedRoute allowedRole={UserRole.STUDENT}><StudentTestRunner /></ProtectedRoute>} />
        <Route path="/student/result/:attemptId" element={<ProtectedRoute allowedRole={UserRole.STUDENT}><StudentResult /></ProtectedRoute>} />

        {/* Teacher Routes */}
        <Route path="/teacher" element={<ProtectedRoute allowedRole={UserRole.TEACHER}><TeacherDashboard /></ProtectedRoute>} />
        <Route path="/teacher/tests/create" element={<ProtectedRoute allowedRole={UserRole.TEACHER}><TeacherTestBuilder /></ProtectedRoute>} />
        <Route path="/teacher/results/:testId" element={<ProtectedRoute allowedRole={UserRole.TEACHER}><TeacherDashboard /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </React.Suspense>
  );
};

const App: React.FC = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      // Initialize Telegram WebApp with safety checks
      const tg = (window as any).Telegram?.WebApp;
      if (tg) {
        tg.ready();
        tg.expand();
        // Use default colors if theme data is missing
        const bgColor = tg.backgroundColor || '#ffffff';
        const textColor = tg.textColor || '#000000';
        document.body.style.setProperty('--tg-theme-bg-color', bgColor);
        document.body.style.setProperty('--tg-theme-text-color', textColor);
      }
    } catch (err) {
      console.warn('Telegram WebApp initialization failed, proceeding in browser mode.');
    } finally {
      // Small delay to allow store hydration to complete without flickering
      const timer = setTimeout(() => setIsReady(true), 100);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!isReady) return null;

  return (
    <div className="max-w-md mx-auto min-h-screen relative shadow-lg bg-white overflow-hidden flex flex-col">
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </div>
  );
};

export default App;
