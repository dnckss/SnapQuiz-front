import React, { useState } from 'react';
import { ArrowUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
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
  const [typingAnswer, setTypingAnswer] = useState('');

  const simulateTyping = (fullText: string) => {
    let index = 0;
    setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

    const interval = setInterval(() => {
      index++;
      const partial = fullText.slice(0, index);

      setMessages((prev) => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;

        if (updated[lastIndex]?.role === 'assistant') {
          updated[lastIndex] = {
            ...updated[lastIndex],
            content: partial,
          };
        }

        return updated;
      });

      if (index >= fullText.length) {
        clearInterval(interval);
        onChange(value + '\n' + fullText);
        setIsLoading(false);
      }
    }, 20);
  };

  const handleSubmit = async () => {
    if (!question.trim()) return;

    setMessages((prev) => [...prev, { role: 'user', content: question }]);
    setIsLoading(true);
    setTypingAnswer('');

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
      let parsed = data.answer;

      try {
        const innerParsed = JSON.parse(parsed);
        if (innerParsed.answer) {
          parsed = innerParsed.answer;
        }
      } catch (_) {}

      simulateTyping(parsed);
    } catch (error) {
      console.error('Error fetching answer:', error);
      setIsLoading(false);
    } finally {
      setQuestion('');
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
          <div
            key={index}
            className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}
          >
            <div
              className={`inline-block p-4 rounded-xl max-w-[80%] whitespace-pre-wrap ${
                message.role === 'user'
                  ? 'bg-[#4A6FFF] text-white'
                  : 'bg-white border border-gray-200'
              }`}
            >
              {message.role === 'assistant' ? (
                <ReactMarkdown
                  children={message.content}
                  remarkPlugins={[remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                />
              ) : (
                message.content
              )}
            </div>
          </div>
        ))}

        {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
          <div className="flex justify-start mb-4">
            <div className="inline-block p-4 rounded-xl bg-white border border-gray-200">
              <LoadingDots />
            </div>
          </div>
        )}

        {isLoading && typingAnswer && (
          <div className="mb-4 text-left">
            <div className="inline-block p-4 rounded-xl bg-white border border-gray-200 max-w-[80%] whitespace-pre-wrap">
              <ReactMarkdown
                children={typingAnswer}
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
              />
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