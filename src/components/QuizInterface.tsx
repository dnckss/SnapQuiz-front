import React, { useState } from 'react';
import { Question } from '../store/quizStore';

type QuizInterfaceProps = {
  questions: Question[];
  onSubmit: (answers: string[]) => void;
};

const QuizInterface: React.FC<QuizInterfaceProps> = ({ questions, onSubmit }) => {
  const [answers, setAnswers] = useState<string[]>(new Array(questions.length).fill(''));

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    onSubmit(answers);
  };

  return (
    <div>
      <div className="sticky top-0 bg-gray-50 z-10 pb-4">
        <h1 className="text-3xl font-semibold text-[#1a1f36] mb-8">Make a Quiz</h1>
        
        <div className="mb-8  border-[#e5e7eb]">
          <div className="flex space-x-8">
            <button className="pb-4 text-[#4A6FFF] font-medium relative">
              Import PDF
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4A6FFF]" />
            </button>
            <button className="pb-4 text-gray-500">
              Enter Text
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {questions.map((question, index) => (
          <div key={index} className="mb-10">
            <h2 className="text-xl font-medium text-[#1a1f36] mb-3">
              Question {index + 1}.
            </h2>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e5e7eb] mb-4">
              <div className="space-y-3">
                {question.question.split('\n').map((line, i) => (
                  <p key={i} className={`text-[#1a1f36] leading-relaxed ${line.startsWith('•') ? 'ml-4' : ''}`}>
                    {line}
                  </p>
                ))}
              </div>
            </div>

            {question.type === 'multiple_choice' && question.choices && (
              <div className="space-y-3">
                {question.choices.map((choice, choiceIndex) => (
                  <label
                    key={choiceIndex}
                    className="flex items-center space-x-3 p-4 rounded-xl border border-[#e5e7eb] hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={choice}
                      checked={answers[index] === choice}
                      onChange={(e) => handleAnswerChange(index, e.target.value)}
                      className="h-4 w-4 text-[#4A6FFF] focus:ring-[#4A6FFF] border-gray-300"
                    />
                    <span className="text-[#1a1f36]">{choice}</span>
                  </label>
                ))}
              </div>
            )}

            {(question.type === 'short_answer' || question.type === 'description') && (
              <div className="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] overflow-hidden">
                <textarea
                  value={answers[index]}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  placeholder="Write your answer!"
                  className="w-full p-6 text-[#1a1f36] placeholder-[#a0aec0] focus:outline-none resize-none min-h-[120px]"
                />
              </div>
            )}
          </div>
        ))}

        <div className="flex justify-end mt-12 mb-8">
          <button
            onClick={handleSubmit}
            className="bg-[#4A6FFF] text-white px-8 py-4 rounded-2xl hover:bg-[#3258d8] transition-colors text-lg font-medium"
          >
            Submit Answer
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizInterface;