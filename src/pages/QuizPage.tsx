import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import Tab from '../components/Tab';
import Upload from '../components/Upload';
import QuizOptions from '../components/QuizOptions';
import QuizInterface from '../components/QuizInterface';
import { generateQuestions } from '../api/quizApi';
import { useQuizStore } from '../store/quizStore';

type AnswerType = 'Random' | 'Multiple Choice' | 'Short Answer' | 'Descriptive';
type Difficulty = 'Easy' | 'Medium' | 'Hard';
type Subject = 'Math' | 'English' | 'History';

const QuizPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('import');
  const [selectedAnswerType, setSelectedAnswerType] = useState<AnswerType | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [questionCount, setQuestionCount] = useState<number>(1);
  const [activeSubject, setActiveSubject] = useState<Subject>('Math');
  const [imageData, setImageData] = useState<File | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);

  const { questions, setQuestions, setLoading, setError } = useQuizStore();

  const generateQuizMutation = useMutation({
    mutationFn: () =>
      generateQuestions(
        activeSubject,
        selectedAnswerType || 'Random',
        selectedDifficulty || 'Easy',
        questionCount,
        imageData
      ),
    onSuccess: (data) => {
      setQuestions(data);
      setError(null);
      setShowQuiz(true);
    },
    onError: (error) => {
      setError(error instanceof Error ? error.message : 'An error occurred');
    },
  });

  const handleSubjectChange = (subject: Subject) => {
    setActiveSubject(subject);
    setSelectedAnswerType(null);
    setSelectedDifficulty(null);
    setQuestionCount(1);
    setImageData(null);
    setQuestions([]);
    setError(null);
    setShowQuiz(false);
  };

  const handleImageCapture = (capturedImage: File) => {
    setImageData(capturedImage);
    setError(null);
  };

  const handleQuizGeneration = () => {
    if (!selectedAnswerType || !selectedDifficulty) return;
    setLoading(true);
    generateQuizMutation.mutate();
  };

  const handleSubmitAnswers = (answers: string[]) => {
    console.log('Submitted answers:', answers);
    // Handle answer submission logic here
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="w-48 min-w-48 bg-[#1e2334] p-6 h-screen sticky top-0">
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

      <div className="flex-1 min-w-0 p-8">
        {!showQuiz ? (
          <>
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
                
                {generateQuizMutation.error && (
                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    {generateQuizMutation.error instanceof Error ? generateQuizMutation.error.message : 'Error!'}
                  </div>
                )}

                <button
                  className={`w-full py-4 rounded-lg text-white font-medium transition-colors ${
                    selectedAnswerType && selectedDifficulty && !generateQuizMutation.isPending
                      ? 'bg-[#4A6FFF] hover:bg-[#3258d8]'
                      : 'bg-[#8A94A6] cursor-not-allowed'
                  }`}
                  disabled={!selectedAnswerType || !selectedDifficulty || generateQuizMutation.isPending}
                  onClick={handleQuizGeneration}
                >
                  {generateQuizMutation.isPending ? 'Making Quiz...' : 'Make a Quiz'}
                </button>
              </>
            )}
          </>
        ) : (
          <QuizInterface questions={questions} onSubmit={handleSubmitAnswers} />
        )}
      </div>
    </div>
  );
};

export default QuizPage;