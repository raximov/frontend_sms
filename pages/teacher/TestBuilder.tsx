
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuestionType } from '../../types';

const TestBuilder: React.FC = () => {
  const navigate = useNavigate();
  const [testTitle, setTestTitle] = useState('');
  const [questions, setQuestions] = useState<any[]>([
    { id: Date.now(), type: QuestionType.SINGLE_CHOICE, text: '', points: 1, options: ['', ''] }
  ]);

  const addQuestion = () => {
    setQuestions([...questions, { id: Date.now(), type: QuestionType.SINGLE_CHOICE, text: '', points: 1, options: ['', ''] }]);
  };

  const removeQuestion = (id: number) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleSave = () => {
    // API call to create test
    alert('Test Created Successfully!');
    navigate('/teacher');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-y-auto">
      <div className="p-6 bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">New Test</h2>
          <button onClick={() => navigate('/teacher')} className="text-gray-400">Cancel</button>
        </div>
        <input 
          type="text" 
          placeholder="Enter Test Title..." 
          value={testTitle}
          onChange={(e) => setTestTitle(e.target.value)}
          className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 ring-blue-500 outline-none font-bold"
        />
      </div>

      <div className="p-6 space-y-6 pb-32">
        {questions.map((q, qIdx) => (
          <div key={q.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative group">
            <button 
              onClick={() => removeQuestion(q.id)} 
              className="absolute top-4 right-4 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Delete
            </button>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">Type</label>
                <select 
                  className="w-full p-2 bg-gray-50 rounded-lg text-sm mt-1"
                  value={q.type}
                  onChange={(e) => {
                    const newQs = [...questions];
                    newQs[qIdx].type = e.target.value;
                    setQuestions(newQs);
                  }}
                >
                  <option value={QuestionType.SINGLE_CHOICE}>Single Choice</option>
                  <option value={QuestionType.MULTIPLE_CHOICE}>Multiple Choice</option>
                  <option value={QuestionType.SHORT_ANSWER}>Short Answer</option>
                  <option value={QuestionType.COMPUTATIONAL}>Computational</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase">Points</label>
                <input 
                  type="number" 
                  className="w-full p-2 bg-gray-50 rounded-lg text-sm mt-1" 
                  value={q.points}
                  onChange={(e) => {
                    const newQs = [...questions];
                    newQs[qIdx].points = Number(e.target.value);
                    setQuestions(newQs);
                  }}
                />
              </div>
            </div>

            <textarea 
              placeholder="Enter question text..."
              className="w-full p-3 bg-gray-50 rounded-xl mb-4 text-sm focus:ring-2 ring-blue-500 outline-none"
              rows={3}
              value={q.text}
              onChange={(e) => {
                const newQs = [...questions];
                newQs[qIdx].text = e.target.value;
                setQuestions(newQs);
              }}
            />

            {(q.type === QuestionType.SINGLE_CHOICE || q.type === QuestionType.MULTIPLE_CHOICE) && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Options</label>
                {q.options.map((opt: string, optIdx: number) => (
                  <div key={optIdx} className="flex space-x-2">
                    <input 
                      type="text" 
                      className="flex-1 p-2 bg-gray-50 rounded-lg text-sm"
                      placeholder={`Option ${optIdx + 1}`}
                      value={opt}
                      onChange={(e) => {
                        const newQs = [...questions];
                        newQs[qIdx].options[optIdx] = e.target.value;
                        setQuestions(newQs);
                      }}
                    />
                    <button 
                      onClick={() => {
                        const newQs = [...questions];
                        newQs[qIdx].options = newQs[qIdx].options.filter((_: any, i: number) => i !== optIdx);
                        setQuestions(newQs);
                      }}
                      className="text-red-400 p-2"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button 
                  onClick={() => {
                    const newQs = [...questions];
                    newQs[qIdx].options.push('');
                    setQuestions(newQs);
                  }}
                  className="text-blue-500 text-xs font-bold"
                >
                  + Add Option
                </button>
              </div>
            )}
          </div>
        ))}

        <button 
          onClick={addQuestion}
          className="w-full py-4 border-2 border-dashed border-gray-300 rounded-2xl text-gray-400 font-bold hover:bg-gray-100 transition-colors"
        >
          + Add Question
        </button>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t flex justify-center max-w-md mx-auto z-20">
        <button 
          onClick={handleSave}
          className="w-full py-4 bg-blue-500 text-white rounded-2xl font-bold shadow-lg"
        >
          Publish Test
        </button>
      </div>
    </div>
  );
};

export default TestBuilder;
