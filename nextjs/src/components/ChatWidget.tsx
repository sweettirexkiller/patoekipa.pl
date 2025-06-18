'use client';

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isStreaming?: boolean;
}

// Custom components for markdown rendering
const MarkdownComponents = {
  code({ node, inline, className, children, ...props }: any) {
    const match = /language-(\w+)/.exec(className || '');
    return !inline && match ? (
      <div className="relative">
        <div className="flex items-center justify-between bg-slate-800 text-slate-300 px-4 py-2 rounded-t-lg">
          <span className="text-sm font-medium">{match[1]}</span>
          <button
            onClick={() => navigator.clipboard.writeText(String(children).replace(/\n$/, ''))}
            className="text-xs bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded transition-colors"
          >
            Copy
          </button>
        </div>
        <SyntaxHighlighter
          style={oneDark}
          language={match[1]}
          PreTag="div"
          className="!mt-0 !rounded-t-none"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      </div>
    ) : (
      <code className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
        {children}
      </code>
    );
  },
  h1: ({ children }: any) => (
    <h1 className="text-xl font-bold text-slate-800 dark:text-white mb-3 border-b border-slate-200 dark:border-slate-700 pb-2">
      {children}
    </h1>
  ),
  h2: ({ children }: any) => (
    <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-2">
      {children}
    </h2>
  ),
  h3: ({ children }: any) => (
    <h3 className="text-md font-semibold text-slate-800 dark:text-white mb-2">
      {children}
    </h3>
  ),
  p: ({ children }: any) => (
    <p className="text-slate-700 dark:text-slate-300 mb-2 leading-relaxed">
      {children}
    </p>
  ),
  ul: ({ children }: any) => (
    <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 mb-2 space-y-1">
      {children}
    </ul>
  ),
  ol: ({ children }: any) => (
    <ol className="list-decimal list-inside text-slate-700 dark:text-slate-300 mb-2 space-y-1">
      {children}
    </ol>
  ),
  li: ({ children }: any) => (
    <li className="text-slate-700 dark:text-slate-300">
      {children}
    </li>
  ),
  blockquote: ({ children }: any) => (
    <blockquote className="border-l-4 border-blue-500 pl-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 italic mb-2">
      {children}
    </blockquote>
  ),
  a: ({ href, children }: any) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
    >
      {children}
    </a>
  ),
  table: ({ children }: any) => (
    <div className="overflow-x-auto mb-2">
      <table className="min-w-full border-collapse border border-slate-300 dark:border-slate-700">
        {children}
      </table>
    </div>
  ),
  th: ({ children }: any) => (
    <th className="border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 px-3 py-2 text-left font-semibold text-slate-800 dark:text-white">
      {children}
    </th>
  ),
  td: ({ children }: any) => (
    <td className="border border-slate-300 dark:border-slate-700 px-3 py-2 text-slate-700 dark:text-slate-300">
      {children}
    </td>
  ),
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Cześć! Jestem asystentem AI zespołu Patoekipa. Jak mogę Ci pomóc?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const streamingContainerRef = useRef<HTMLDivElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pl-PL', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Cancel any existing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            ...messages.filter(m => !m.isStreaming).map(m => ({
              role: m.isUser ? 'user' : 'assistant',
              content: m.text,
            })),
            { role: 'user', content: userMessage.text },
          ],
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setIsTyping(false);
      setIsStreaming(true);

      // Small delay to ensure streaming container is rendered
      await new Promise(resolve => setTimeout(resolve, 50));

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let accumulatedText = '';
        
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const data = JSON.parse(line.slice(6));
                  if (data.content) {
                    accumulatedText += data.content;
                    
                    // Update DOM directly if container exists
                    if (streamingContainerRef.current) {
                      const textElement = streamingContainerRef.current.querySelector('.streaming-text-content');
                      if (textElement) {
                        textElement.textContent = accumulatedText;
                        scrollToBottom();
                      }
                    }
                  }
                } catch (parseError) {
                  console.warn('Failed to parse SSE data:', parseError);
                }
              }
            }
          }
        } finally {
          // Add final message to messages array
          setMessages(prev => [...prev, {
            id: Date.now().toString(),
            text: accumulatedText,
            isUser: false,
            timestamp: new Date(),
          }]);
          setIsStreaming(false);
        }
      }
    } catch (error: any) {
      setIsTyping(false);
      if (error.name === 'AbortError') {
        console.log('Request was aborted');
        return;
      }
      
      console.error('Chat error:', error);
      setIsConnected(false);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        text: 'Przepraszam, wystąpił problem z połączeniem. Spróbuj ponownie za chwilę.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      
      // Restore connection after 3 seconds
      setTimeout(() => setIsConnected(true), 3000);
    }
  };

  const TypingIndicator = () => (
    <div className="flex justify-start mb-3 animate-message-slide-in">
      <div className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-2xl rounded-bl-md px-4 py-3 max-w-xs shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full typing-dot"></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full typing-dot" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full typing-dot" style={{ animationDelay: '0.4s' }}></div>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400">AI pisze...</span>
        </div>
      </div>
    </div>
  );



  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-80 h-[500px] sm:w-96 sm:h-[600px] max-sm:fixed max-sm:inset-4 max-sm:w-auto max-sm:h-auto flex flex-col border border-gray-200 dark:border-gray-700 animate-chat-widget-slide-up">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-2xl">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-lg">🤖</span>
                </div>
                {isConnected && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-sm">Asystent AI Patoekipa</h3>
                <p className="text-xs text-blue-100">
                  {isConnected ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Zamknij chat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
            {messages.map((message) => (
              <div key={message.id}>
                <div
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-message-slide-in`}
                >
                  {message.isUser ? (
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl rounded-br-md px-4 py-3 max-w-xs shadow-sm chat-message">
                      <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
                      <p className="text-xs text-blue-100 mt-2">
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  ) : (
                    <div className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-2xl rounded-bl-md px-4 py-3 max-w-xs shadow-sm border border-gray-200 dark:border-gray-600 chat-message">
                      <div className="whitespace-pre-wrap leading-relaxed">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={MarkdownComponents}
                        >
                          {message.text}
                        </ReactMarkdown>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Show typing indicator when AI is thinking (before streaming starts) */}
            {isTyping && <TypingIndicator />}
            
            {/* Streaming message container - completely separate from React state */}
            {isStreaming && (
              <div className="flex justify-start animate-message-slide-in">
                <div 
                  ref={streamingContainerRef}
                  className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-2xl rounded-bl-md px-4 py-3 max-w-xs shadow-sm relative"
                >
                  <div className="whitespace-pre-wrap leading-relaxed">
                    <span className="streaming-text-content"></span>
                    <span className="inline-block w-0.5 h-5 bg-blue-500 ml-1 animate-pulse opacity-75"></span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {formatTime(new Date())}
                  </p>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-2xl">
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={isConnected ? "Napisz wiadomość..." : "Brak połączenia..."}
                  disabled={isTyping || !isConnected}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed bg-gray-50 dark:bg-gray-700 dark:text-white chat-input resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping || !isConnected}
                className="px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
              >
                {isTyping ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Toggle Button - Only show when chat is closed */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full p-4 shadow-2xl transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
          aria-label="Open chat"
        >
          {/* Notification Badge */}
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
            1
          </div>
          
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      )}
    </div>
  );
} 