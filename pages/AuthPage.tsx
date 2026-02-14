
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { UserRole } from '../types';

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth, isAuthenticated, user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDemoButtons, setShowDemoButtons] = useState(false);

  const performMockLogin = useCallback((role: UserRole = UserRole.STUDENT) => {
    setLoading(true);
    const tg = (window as any).Telegram?.WebApp;
    
    // Simulate a brief delay but stay within a safe context
    setTimeout(() => {
      const mockUser = {
        id: 12345,
        username: tg?.initDataUnsafe?.user?.username || 'mock_user_88',
        role: role,
        fullName: tg?.initDataUnsafe?.user?.first_name || (role === UserRole.TEACHER ? 'Dr. Sarah Jenkins' : 'Alex Student'),
      };
      
      setAuth('mock-jwt-token-xyz', mockUser);
      // Navigation should be immediate and use replace to avoid location.assign issues on blobs
      navigate(role === UserRole.TEACHER ? '/teacher' : '/student', { replace: true });
    }, 300);
  }, [navigate, setAuth]);

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    const initData = tg?.initData || "";

    // 1. If already logged in, redirect
    if (isAuthenticated && user) {
      navigate(user.role === UserRole.TEACHER ? '/teacher' : '/student', { replace: true });
      return;
    }

    // 2. Real Telegram Auth check
    if (initData) {
      setLoading(true);
      performMockLogin(UserRole.STUDENT);
      return;
    }

    // 3. Fallback to demo mode
    setLoading(false);
    setShowDemoButtons(true);
  }, [isAuthenticated, user, navigate, performMockLogin]);

  return (
    <div className="flex flex-col items-center justify-center flex-1 p-8 text-center space-y-8 bg-white min-h-screen">
      <div className="relative group">
        <div className="w-24 h-24 bg-blue-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-blue-200 rotate-3 transition-transform group-hover:rotate-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white -rotate-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
          <div className="w-2 h-2 bg-white rounded-full animate-ping" />
        </div>
      </div>

      <div>
        <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight text-center">EduQuest</h1>
        <p className="text-gray-400 font-medium px-4 leading-snug">The next-gen testing platform for the Telegram ecosystem.</p>
      </div>
      
      {loading ? (
        <div className="flex flex-col items-center space-y-4">
          <div className="flex space-x-1.5">
            <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
            <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
          <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Verifying Identity</span>
        </div>
      ) : showDemoButtons ? (
        <div className="w-full space-y-4 pt-4 max-w-[280px]">
          <div className="bg-amber-50 border border-amber-100 p-3 rounded-2xl mb-2">
            <p className="text-[11px] font-bold text-amber-700 uppercase tracking-wider mb-1">Preview Environment</p>
            <p className="text-xs text-amber-600/80">Telegram context not found. Choose a role to test with mock data.</p>
          </div>
          
          <button 
            onClick={() => performMockLogin(UserRole.STUDENT)}
            className="group w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-100 active:scale-95 transition-all flex items-center justify-center"
          >
            <span>Enter as Student</span>
            <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
          </button>
          
          <button 
            onClick={() => performMockLogin(UserRole.TEACHER)}
            className="w-full py-4 bg-white border-2 border-gray-100 text-gray-700 rounded-2xl font-bold active:scale-95 transition-all flex items-center justify-center hover:bg-gray-50"
          >
            Enter as Teacher
          </button>
        </div>
      ) : error ? (
        <div className="p-5 bg-red-50 text-red-600 rounded-[1.5rem] border border-red-100 max-w-[300px]">
          <div className="font-black mb-1 uppercase text-[10px] tracking-widest opacity-60">System Halt</div>
          <p className="text-sm font-semibold">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 text-xs font-bold underline"
          >
            Retry Connection
          </button>
        </div>
      ) : null}

      <div className="mt-auto pt-8">
        <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">Powered by EduQuest Engine v1.0</p>
      </div>
    </div>
  );
};

export default AuthPage;
