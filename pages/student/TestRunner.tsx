
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Question, QuestionType } from '../../types';

const TestRunner: React.FC = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 mins

  // Mock Questions
  const questions: Question[] = useMemo(() => [
    {
      id: 'q1',
      type: QuestionType.SINGLE_CHOICE,
      text: 'What is the capital of France?',
      points: 2,
      options: ['Berlin', 'Madrid', 'Paris', 'Rome']
    },
    {
      id: 'q2',
      type: QuestionType.MULTIPLE_CHOICE,
      text: 'Which of these are programming languages?',
      points: 3,
      options: ['Python', 'HTML', 'Java', 'Docker']
    },
    {
      id: 'q3',
      type: QuestionType.COMPUTATIONAL,
      text: 'Solve: 15 * 12',
      points: 5,
      tolerance: 0
    }
  ], []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleAnswerChange = (value: any) => {
    setAnswers({ ...answers, [questions[currentIdx].id]: value });
  };

  const handleSubmit = async () => {
    // In production: await api.student.submitAttempt(attemptId, answers);
    navigate(`/student/result/mock-attempt-1`);
  };

  const question = questions[currentIdx];

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center bg-gray-50 sticky top-0 z-10">
        <div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Question {currentIdx + 1} / {questions.length}</span>
          <div className="h-1 w-32 bg-gray-200 mt-1 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-300" 
              style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
        <div className={`px-3 py-1 rounded-lg text-sm font-mono font-bold ${timeLeft < 60 ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h2 className="text-xl font-bold mb-6">{question.text}</h2>

        <div className="space-y-4">
          {question.type === QuestionType.SINGLE_CHOICE && question.options?.map(opt => (
            <label key={opt} className={`flex items-center p-4 border rounded-2xl cursor-pointer transition-colors ${answers[question.id] === opt ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
              <input 
                type="radio" 
                name={question.id} 
                className="hidden" 
                checked={answers[question.id] === opt} 
                onChange={() => handleAnswerChange(opt)} 
              />
              <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${answers[question.id] === opt ? 'border-blue-500' : 'border-gray-300'}`}>
                {answers[question.id] === opt && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />}
              </div>
              <span className="font-medium">{opt}</span>
            </label>
          ))}

          {question.type === QuestionType.MULTIPLE_CHOICE && question.options?.map(opt => (
            <label key={opt} className={`flex items-center p-4 border rounded-2xl cursor-pointer transition-colors ${(answers[question.id] || []).includes(opt) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
              <input 
                type="checkbox" 
                className="hidden" 
                checked={(answers[question.id] || []).includes(opt)} 
                onChange={() => {
                  const current = answers[question.id] || [];
                  const next = current.includes(opt) ? current.filter((i: string) => i !== opt) : [...current, opt];
                  handleAnswerChange(next);
                }} 
              />
              <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center ${ (answers[question.id] || []).includes(opt) ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}`}>
                 {(answers[question.id] || []).includes(opt) && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
              </div>
              <span className="font-medium">{opt}</span>
            </label>
          ))}

          {question.type === QuestionType.COMPUTATIONAL && (
            <input 
              type="number"
              className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-blue-500 outline-none font-bold text-xl"
              placeholder="Enter numerical answer..."
              value={answers[question.id] || ''}
              onChange={(e) => handleAnswerChange(e.target.value)}
            />
          )}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="p-4 border-t bg-white flex justify-between items-center space-x-4">
        <button 
          onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
          disabled={currentIdx === 0}
          className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-2xl font-bold disabled:opacity-50"
        >
          Previous
        </button>
        {currentIdx === questions.length - 1 ? (
          <button 
            onClick={handleSubmit}
            className="flex-1 py-4 bg-blue-500 text-white rounded-2xl font-bold shadow-lg shadow-blue-200"
          >
            Submit Test
          </button>
        ) : (
          <button 
            onClick={() => setCurrentIdx(prev => Math.min(questions.length - 1, prev + 1))}
            className="flex-1 py-4 bg-blue-500 text-white rounded-2xl font-bold shadow-lg shadow-blue-200"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default TestRunner;
