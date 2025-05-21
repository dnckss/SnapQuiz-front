import React, { useState } from 'react';
import { Question, useQuizStore } from '../store/quizStore';
import { verifyAnswer } from '../api/quizApi';
import { CheckCircle, XCircle } from 'lucide-react';
import Tab from '../components/Tab';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';

type QuizInterfaceProps = {
  questions: Question[];
  onSubmit: (answers: string[]) => void;
};

const QuizInterface: React.FC<QuizInterfaceProps> = ({ questions }) => {
  const [activeTab, setActiveTab] = useState<string>('import');
  const [answers, setAnswers] = useState<string[]>(new Array(questions.length).fill(''));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateQuestionStatus } = useQuizStore();

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      const answer = answers[i];

      if (question.type === 'multiple_choice' && question.correct_answer) {
        const isCorrect = answer === question.correct_answer;
        updateQuestionStatus(i, isCorrect ? 'correct' : 'incorrect');
      } else {
        try {
          const result = await verifyAnswer(question.question, answer, question.type);
          updateQuestionStatus(i, result.correct ? 'correct' : 'incorrect', result.feedback);
        } catch (error) {
          console.error('Error verifying answer:', error);
        }
      }
    }

    setIsSubmitting(false);
  };

  const getQuestionStyle = (question: Question) => {
    if (!question.status) return 'border-[#e5e7eb]';
    return question.status === 'correct' ? 'border-green-500' : 'border-red-500';
  };

  const getChoiceStyle = (question: Question, choice: string) => {
    if (!question.status) return 'border-[#e5e7eb] hover:bg-gray-50';

    if (question.type === 'multiple_choice' && question.correct_answer === choice) {
      return 'border-green-500 bg-green-50';
    }

    if (answers[questions.indexOf(question)] === choice) {
      return question.status === 'correct'
        ? 'border-green-500 bg-green-50'
        : 'border-red-500 bg-red-50';
    }

    return 'border-[#e5e7eb] opacity-50';
  };

  
  
  

  return (
    <div>
      <div className="sticky top-0 bg-gray-50 z-10 pb-4">
        <h1 className="text-3xl font-semibold text-[#1a1f36] mb-6">Questions</h1>
        <Tab activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <div className="max-w-4xl mx-auto">
        {questions.map((question, index) => (
          <div key={index} className="mb-10">
            <h2 className="text-xl font-medium text-[#1a1f36] mb-3">
              Question {index + 1}.
            </h2>

            <div className={`bg-white rounded-2xl p-6 shadow-sm border ${getQuestionStyle(question)} mb-4`}>
              <div className="space-y-3">
                {question.question.split('\n').map((line, i) => (
                  <p key={i} className={`text-[#1a1f36] leading-relaxed ${line.startsWith('•') ? 'ml-4' : ''}`}>
                    <Latex>{line}</Latex>
                  </p>
                ))}
              </div>
            </div>

            {question.type === 'multiple_choice' && question.choices && (
              <div className="space-y-3">
                {question.choices.map((choice, choiceIndex) => (
                  <label
                    key={choiceIndex}
                    className={`flex items-center space-x-3 p-4 rounded-xl border transition-colors ${getChoiceStyle(question, choice)}`}
                  >
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={choice}
                      checked={answers[index] === choice}
                      onChange={(e) => handleAnswerChange(index, e.target.value)}
                      className="h-4 w-4 text-[#4A6FFF] focus:ring-[#4A6FFF] border-gray-300"
                      disabled={question.status !== undefined}
                    />
                    <span className="text-[#1a1f36]">
                      <Latex>{choice}</Latex>
                    </span>
                  </label>
                ))}
              </div>
            )}

            {(question.type === 'short_answer' || question.type === 'description') && (
              <div className={`bg-white rounded-2xl shadow-sm border ${getQuestionStyle(question)} overflow-hidden`}>
                <textarea
                  value={answers[index]}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  placeholder="Write your answer!"
                  className="w-full p-6 text-[#1a1f36] placeholder-[#a0aec0] focus:outline-none resize-none min-h-[120px]"
                  disabled={question.status !== undefined}
                />
              </div>
            )}

            {question.status && (
              <div className={`mt-4 flex items-start gap-2 ${
                question.status === 'correct' ? 'text-green-600' : 'text-red-600'
              }`}>
                {question.status === 'correct' ? (
                  <CheckCircle className="w-5 h-5 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 mt-0.5" />
                )}
                <div>
                  <p className="font-medium">
                    {question.status === 'correct' ? 'Correct!' : 'Incorrect'}
                  </p>
                  
                  {question.feedback && (
                    <p className="text-sm mt-1 text-gray-600"><Latex>{question.feedback}</Latex></p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        <div className="flex justify-end mt-12 mb-8">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || questions.some(q => q.status !== undefined)}
            className={`px-8 py-4 rounded-2xl text-lg font-medium transition-colors ${
              isSubmitting || questions.some(q => q.status !== undefined)
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-[#4A6FFF] text-white hover:bg-[#3258d8]'
            }`}
          >
            {isSubmitting ? 'Checking Answers...' : 'Submit Answer'}
          </button>
        </div>
      </div>
    </div>
  );

  
};

export default QuizInterface;