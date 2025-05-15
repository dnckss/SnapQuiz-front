import React, { useState } from 'react';
import Tab from '../components/Tab';
import Upload from '../components/Upload';
import QuizOptions from '../components/QuizOptions';

type AnswerType = 'Random' | 'Multiple Choice' | 'Short Answer' | 'Descriptive';
type Difficulty = 'Easy' | 'Medium' | 'Hard';
type Subject = 'Math' | 'English' | 'History';

interface Question {
  question: string;
  type: string;
  choices?: string[];
  correct_answer?: string;
}

const QuizPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('import');
  const [selectedAnswerType, setSelectedAnswerType] = useState<AnswerType | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [questionCount, setQuestionCount] = useState<number>(1);
  const [activeSubject, setActiveSubject] = useState<Subject>('Math');
  const [imageData, setImageData] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isFormComplete = selectedAnswerType && selectedDifficulty && questionCount > 0 && (activeTab === 'text' || imageData);

  const handleSubjectChange = (subject: Subject) => {
    setActiveSubject(subject);
    setSelectedAnswerType(null);
    setSelectedDifficulty(null);
    setQuestionCount(1);
    setImageData(null);
    setQuestions([]);
    setError(null);
  };

  const handleImageCapture = (capturedImage: string) => {
    setImageData(capturedImage);
    setError(null);
  };

  const handleQuizGeneration = async () => {
    if (!isFormComplete) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/questions/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          textbookImage: imageData,
          subject: activeSubject.toLowerCase(),
          questionType: selectedAnswerType?.toLowerCase(),
          difficulty: selectedDifficulty?.toLowerCase(),
          numberOfQuestions: questionCount,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate quiz');
      }

      const data = await response.json();
      setQuestions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* 사이드바 */}
      <div className="w-64 min-w-64 bg-[#1e2334] p-6 h-screen sticky top-0">
        <h2 className="text-[#4A6FFF] text-xl font-semibold mb-6">Subject</h2>
        <div className="space-y-2">
          {(['Math', 'English', 'History'] as Subject[]).map((subject) => (
            <div
              key={subject}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                activeSubject === subject
                  ? 'bg-[#2a324e] text-white'
                  : 'text-gray-400 hover:bg-[#262c40] hover:text-gray-300'
              }`}
              onClick={() => handleSubjectChange(subject)}
            >
              {subject}
            </div>
          ))}
        </div>
      </div>

      {/* 메인 */}
      <div className="flex-1 min-w-0 p-8">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">{activeSubject} Quiz</h1>
        
        <Tab activeTab={activeTab} setActiveTab={setActiveTab} />
        <Upload activeTab={activeTab} onImageCapture={handleImageCapture} />
        
        {activeTab === 'import' && (
          <>
            <QuizOptions
              selectedAnswerType={selectedAnswerType}
              setSelectedAnswerType={setSelectedAnswerType}
              selectedDifficulty={selectedDifficulty}
              setSelectedDifficulty={setSelectedDifficulty}
              questionCount={questionCount}
              setQuestionCount={setQuestionCount}
            />
            
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            <button
              className={`w-full py-4 rounded-lg text-white font-medium transition-colors ${
                isFormComplete && !loading
                  ? 'bg-[#4A6FFF] hover:bg-[#3258d8]'
                  : 'bg-[#8A94A6] cursor-not-allowed'
              }`}
              disabled={!isFormComplete || loading}
              onClick={handleQuizGeneration}
            >
              {loading ? 'Making Quiz...' : 'Make a Quiz'}
            </button>

            {questions.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Maked Questions</h2>
                <div className="space-y-6">
                  {questions.map((question, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                      <p className="text-lg font-medium text-gray-800 mb-4">
                        {index + 1}. {question.question}
                      </p>
                      {question.type === 'multiple choice' && question.choices && (
                        <div className="space-y-2">
                          {question.choices.map((choice, choiceIndex) => (
                            <div key={choiceIndex} className="flex items-center">
                              <input
                                type="radio"
                                name={`question-${index}`}
                                id={`choice-${index}-${choiceIndex}`}
                                className="mr-3"
                              />
                              <label htmlFor={`choice-${index}-${choiceIndex}`}>
                                {choice}
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                      {(question.type === 'short answer' || question.type === 'description') && (
                        <textarea
                          className="w-full mt-2 p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#4369e0] focus:border-transparent"
                          rows={4}
                          placeholder="Write your answer!"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default QuizPage;