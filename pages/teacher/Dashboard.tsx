
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Test } from '../../types';

const TeacherDashboard: React.FC = () => {
  const navigate = useNavigate();

  const { data: tests, isLoading, isError } = useQuery({ 
    queryKey: ['teacher-tests'], 
    queryFn: api.teacher.getTests,
    retry: 1
  });

  // Mocking tests for demo if API is not yet populated
  const displayTests: Test[] = tests && tests.length > 0 ? tests : [
    { id: '1', title: 'Mathematics Quiz', description: 'Basic algebra', durationMinutes: 30, questionCount: 15, isPublished: true, createdAt: '2023-10-01' },
    { id: '4', title: 'Physics Final', description: 'Newtonian mechanics', durationMinutes: 60, questionCount: 25, isPublished: false, createdAt: '2023-10-15' },
  ];

  if (isLoading) return (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="flex flex-col flex-1 p-6 bg-white overflow-y-auto pb-32 page-transition">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold">Instructor Hub</h2>
          {isError ? (
            <p className="text-[10px] text-amber-600 font-black uppercase tracking-wider mt-1">Working Offline</p>
          ) : (
            <p className="text-gray-400 text-sm">Manage your curriculum</p>
          )}
        </div>
        <div className="w-10 h-10 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black shadow-lg shadow-blue-100">
          IQ
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-gray-900 p-5 rounded-[2rem] text-white shadow-xl shadow-gray-100">
          <div className="text-3xl font-black mb-1">{displayTests.length}</div>
          <div className="text-[9px] font-bold uppercase opacity-50 tracking-[0.2em]">Total Tests</div>
        </div>
        <div className="bg-blue-600 p-5 rounded-[2rem] text-white shadow-xl shadow-blue-100">
          <div className="text-3xl font-black mb-1">0</div>
          <div className="text-[9px] font-bold uppercase opacity-60 tracking-[0.2em]">Avg Score</div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em] mb-4">Content Inventory</h3>
        {displayTests.map(test => (
          <div key={test.id} className="p-5 border border-gray-50 rounded-3xl flex items-center justify-between hover:border-blue-100 transition-colors bg-white shadow-sm">
            <div className="flex-1">
              <h4 className="font-bold text-gray-900 mb-1">{test.title}</h4>
              <div className="flex items-center space-x-3">
                <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider ${test.isPublished ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                  {test.isPublished ? 'Live' : 'Draft'}
                </span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{test.questionCount} Questions</span>
              </div>
            </div>
            <button 
              onClick={() => navigate(`/teacher/results/${test.id}`)}
              className="w-12 h-12 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 rounded-2xl flex items-center justify-center text-gray-400 transition-all active:scale-90"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
            </button>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white/95 to-transparent flex justify-center max-w-md mx-auto z-20">
        <button 
          onClick={() => navigate('/teacher/tests/create')}
          className="w-full py-4.5 bg-blue-600 text-white rounded-2xl font-black shadow-2xl shadow-blue-200 flex items-center justify-center transform active:scale-[0.98] transition-all"
        >
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path></svg>
          Build New Test
        </button>
      </div>
    </div>
  );
};

export default TeacherDashboard;
