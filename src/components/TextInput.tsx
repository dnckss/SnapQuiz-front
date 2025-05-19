import React, { useState } from 'react';
import { ArrowUp } from 'lucide-react';
import Latex from 'react-latex-next';
import 'katex/dist/katex.min.css';
import LoadingDots from './LoadingDots';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  subject: string;
}

const TextInput: React.FC<TextInputProps> = ({ value, onChange, subject }) => {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamedContent, setStreamedContent] = useState('');

  const handleSubmit = async () => {
    if (!question.trim()) return;

    setMessages((prev) => [...prev, { role: 'user', content: question }]);
    setIsLoading(true);
    setStreamedContent('');

    try {
      const response = await fetch('https://usa-v1.onrender.com/questions/answers/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: subject.toLowerCase(),
          question,
        }),
      });

      const data = await response.json();

      let parsedAnswer = data.answer;

      
      try {
        const innerParsed = JSON.parse(parsedAnswer);
        if (innerParsed.answer) {
          parsedAnswer = innerParsed.answer;
        }
      } catch (e) {

      }

      setMessages((prev) => [...prev, { role: 'assistant', content: parsedAnswer }]);
      onChange(value + '\n' + parsedAnswer);
    } catch (error) {
      console.error('Error fetching answer:', error);
    } finally {
      setIsLoading(false);
      setQuestion('');
      setStreamedContent('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      <div className="flex-1 overflow-y-auto px-4">
        {messages.map((message, index) => (
          <div key={index} className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
            <div
              className={`inline-block p-4 rounded-xl max-w-[80%] ${
                message.role === 'user'
                  ? 'bg-[#4A6FFF] text-white'
                  : 'bg-white border border-gray-200'
              }`}
            >
              {message.role === 'assistant' ? (
                <Latex>{message.content}</Latex>
              ) : (
                message.content
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="inline-block p-4 rounded-xl bg-white border border-gray-200">
              <LoadingDots />
            </div>
          </div>
        )}
      </div>

      <div className="sticky bottom-0 bg-gray-50 p-4">
        <div className="relative max-w-4xl mx-auto">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="What would you like to know?"
            className="w-full p-4 pr-12 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4A6FFF] resize-none bg-white"
            rows={3}
          />
          <button
            onClick={handleSubmit}
            disabled={isLoading || !question.trim()}
            className={`absolute right-4 bottom-4 p-2 rounded-lg transition-colors ${
              isLoading || !question.trim()
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-[#4A6FFF] text-white hover:bg-[#3258d8]'
            }`}
          >
            <ArrowUp size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TextInput;