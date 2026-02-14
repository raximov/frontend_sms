
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Test } from '../../types';

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  
  const { data: tests, isLoading, isError } = useQuery({ 
    queryKey: ['student-tests'], 
    queryFn: api.student.getTests,
    retry: 1
  });

  // Mocking fallback for demo if API fails or returns empty during your testing
  const displayTests: Test[] = tests && tests.length > 0 ? tests : [
    { id: '1', title: 'Mathematics Quiz', description: 'Basic algebra and geometry concepts', durationMinutes: 30, questionCount: 15, isPublished: true, createdAt: '2023-10-01' },
    { id: '2', title: 'Science Mid-term', description: 'Biology and Chemistry fundamentals', durationMinutes: 45, questionCount: 20, isPublished: true, createdAt: '2023-10-05' },
  ];

  if (isLoading) return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20 page-transition">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold">Available Tests</h2>
          {isError && <p className="text-[10px] text-amber-600 font-bold uppercase mt-1">Offline / Demo Mode</p>}
        </div>
        <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">
          {displayTests.length} Found
        </div>
      </div>

      <div className="space-y-4">
        {displayTests.map(test => (
          <div 
            key={test.id} 
            onClick={() => navigate(`/student/test/${test.id}`)}
            className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm active:scale-[0.97] transition-all cursor-pointer hover:shadow-md relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <h3 className="font-bold text-lg mb-1">{test.title}</h3>
            <p className="text-gray-400 text-sm mb-4 line-clamp-1">{test.description}</p>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">
                <svg className="w-3 h-3 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                {test.durationMinutes}M
              </div>
              <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">
                <svg className="w-3 h-3 mr-1 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path></svg>
                {test.questionCount}Q
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentDashboard;
