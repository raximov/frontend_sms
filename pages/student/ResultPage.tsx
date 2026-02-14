
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ResultPage: React.FC = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  // Mock Result Data
  const result = {
    score: 85,
    totalPoints: 100,
    percentage: 85,
    questions: [
      { text: 'What is the capital of France?', correct: true, points: 2 },
      { text: 'Which of these are programming languages?', correct: false, points: 0 },
      { text: 'Solve: 15 * 12', correct: true, points: 5 },
    ]
  };

  return (
    <div className="flex flex-col flex-1 p-6 bg-white overflow-y-auto">
      <div className="text-center mb-8 pt-6">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-green-50">
          <span className="text-3xl font-black text-green-600">{result.percentage}%</span>
        </div>
        <h2 className="text-2xl font-bold">Excellent Work!</h2>
        <p className="text-gray-500">You scored {result.score} out of {result.totalPoints} points.</p>
      </div>

      <div className="space-y-4 mb-8">
        <h3 className="font-bold text-gray-400 uppercase text-xs">Answer Breakdown</h3>
        {result.questions.map((q, idx) => (
          <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${q.correct ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {q.correct ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
                )}
              </div>
              <span className="font-medium text-sm line-clamp-1">{q.text}</span>
            </div>
            <span className="text-xs font-bold text-gray-400">+{q.points}pts</span>
          </div>
        ))}
      </div>

      <button 
        onClick={() => navigate('/student')}
        className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold mt-auto"
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default ResultPage;
