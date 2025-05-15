import React from 'react';

type AnswerType = 'Random' | 'Multiple Choice' | 'Short Answer' | 'Descriptive';
type Difficulty = 'Easy' | 'Medium' | 'Hard';

type QuizOptionsProps = {
  selectedAnswerType: AnswerType | null;
  setSelectedAnswerType: (type: AnswerType) => void;
  selectedDifficulty: Difficulty | null;
  setSelectedDifficulty: (difficulty: Difficulty) => void;
  questionCount: number;
  setQuestionCount: (count: number) => void;
};

const QuizOptions: React.FC<QuizOptionsProps> = ({
  selectedAnswerType,
  setSelectedAnswerType,
  selectedDifficulty,
  setSelectedDifficulty,
  questionCount,
  setQuestionCount,
}) => {
  const answerTypes: AnswerType[] = ['Random', 'Multiple Choice', 'Short Answer', 'Descriptive'];
  const difficulties: Difficulty[] = ['Easy', 'Medium', 'Hard'];

  const incrementCount = () => {
    if (questionCount < 10) {
      setQuestionCount(questionCount + 1);
    }
  };

  const decrementCount = () => {
    if (questionCount > 1) {
      setQuestionCount(questionCount - 1);
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Quiz option</h2>
      
      <div className="mb-6">
        <p className="mb-2 text-[#2A2F45]">Answer Type</p>
        <div className="flex flex-wrap gap-2">
          {answerTypes.map((type) => (
            <button
              key={type}
              className={`py-2 px-8 rounded-xl transition-colors ${
                selectedAnswerType === type
                  ? 'bg-[#4A6FFF] text-white'
                  : 'bg-[#ffffff] border border-[#8A94A6] text-[#8A94A6] hover:bg-gray-200'
              }`}
              onClick={() => setSelectedAnswerType(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row items-start gap-8">
        <div>
          <p className="mb-2 text-[#2A2F45]">Difficulty</p>
          <div className="flex gap-2">
            {difficulties.map((difficulty) => (
              <button
                key={difficulty}
                className={`py-2 px-6 rounded-xl transition-colors ${
                  selectedDifficulty === difficulty
                    ? 'bg-[#4A6FFF] text-white'
                    : 'bg-[#ffffff] border border-[#8A94A6] text-[#8A94A6] hover:bg-gray-200'
                }`}
                onClick={() => setSelectedDifficulty(difficulty)}
              >
                {difficulty}
              </button>
            ))}
          </div>
        </div>
        
        <div className="md:pl-[2vw]">
          <p className="mb-2 text-[#2A2F45]">Questions <span className="text-[#8A94A6] text-sm">(limit 10)</span></p>
          <div className="flex items-center border rounded-lg bg-[#ffffff]">
            <button 
              className={`px-5 py-2 transition-colors ${
                questionCount === 1 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-[#4A6FFF] hover:text-[#3258d8]'
              }`}
              onClick={decrementCount}
              disabled={questionCount === 1}
            >
              −
            </button>
            <span className="px-4 py-2 text-center w-12">{questionCount}</span>
            <button 
              className={`px-5 py-2 transition-colors ${
                questionCount === 10 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-[#4A6FFF] hover:text-[#3258d8]'
              }`}
              onClick={incrementCount}
              disabled={questionCount === 10}
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizOptions;