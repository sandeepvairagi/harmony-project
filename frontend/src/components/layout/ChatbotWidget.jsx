import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, Sparkles, Loader2 } from 'lucide-react';
import api from '../../services/api';

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(() => {
    const saved = sessionStorage.getItem('harmony_chat_history');
    if (saved) {
      try {
        return JSON.parse(saved).map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      } catch (e) {
        // Fallback to default
      }
    }
    return [
      {
        id: 'init',
        sender: 'bot',
        text: 'Hi there! I am the Harmony Assistant. 🧘 How can I help you today?\n\nYou can ask me to recommend yoga instructors, find affordable classes, explain yoga styles, or guide you on how to book a session!',
        timestamp: new Date(),
      },
    ];
  });
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    sessionStorage.setItem('harmony_chat_history', JSON.stringify(messages));
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async (textToSend) => {
    const text = textToSend || message.trim();
    if (!text) return;

    if (!textToSend) {
      setMessage('');
    }

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Send chat history and current message to backend
      const historyPayload = messages.map(m => ({
        sender: m.sender,
        text: m.text
      }));

      const res = await api.post('/chat', {
        message: text,
        history: historyPayload,
      });

      if (res.data?.success) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: 'bot',
            text: res.data.message,
            timestamp: new Date(),
          },
        ]);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: "I'm having trouble connecting to the backend. Please check if the server is running or try again later.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickReplies = [
    { label: '🧘 Vinyasa Classes', text: 'Recommend a Vinyasa instructor' },
    { label: '💰 Under $75/hr', text: 'Show me instructors under $75' },
    { label: '📍 Located in NY', text: 'Find instructors in New York' },
    { label: '🗓️ How to book?', text: 'How do I book a session?' },
  ];

  // Helper function to safely format markdown links, bold text, and lists
  const formatMessageText = (text) => {
    if (!text) return '';
    
    // Escape basic HTML tags to avoid security issues
    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Convert bold: **text** -> <strong>text</strong>
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>');
    
    // Convert bullet points: - item -> <li>item</li>
    const lines = html.split('\n');
    let inList = false;
    const processedLines = lines.map(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const content = trimmed.substring(2);
        if (!inList) {
          inList = true;
          return `<ul class="list-disc pl-5 my-2 space-y-1"><li>${content}</li>`;
        }
        return `<li>${content}</li>`;
      } else {
        if (inList) {
          inList = false;
          return `</ul>\n${line}`;
        }
        return line;
      }
    });
    if (inList) {
      processedLines.push('</ul>');
    }
    html = processedLines.join('\n');

    // Convert markdown links: [text](url) -> <a href="url">text</a>
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-coral-500 hover:underline font-semibold">$1</a>');

    // Convert line breaks to <br />
    html = html.replace(/\n/g, '<br />');

    return html;
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Panel */}
      {isOpen && (
        <div className="w-[380px] h-[520px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-6rem)] mb-4 bg-white dark:bg-sage-900 border border-sage-100 dark:border-sage-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 transform scale-100 origin-bottom-right">
          {/* Header */}
          <div className="bg-gradient-to-r from-sage-600 to-sage-700 text-white px-5 py-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-white/10 rounded-lg">
                <Bot size={20} className="text-coral-400 animate-pulse-soft" />
              </div>
              <div>
                <h3 className="font-semibold text-sm tracking-wide">Harmony Assistant</h3>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                  <span className="text-[10px] text-sage-200">Online & Ready</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-sage-100 hover:text-white p-1 hover:bg-white/10 rounded-lg transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto bg-sage-50/50 dark:bg-sage-950/40 space-y-4">
            {messages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex gap-2 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-full bg-sage-100 dark:bg-sage-800 flex items-center justify-center shrink-0 border border-sage-200 dark:border-sage-700">
                    <Sparkles size={13} className="text-sage-600 dark:text-sage-300" />
                  </div>
                )}
                
                <div>
                  <div 
                    className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      msg.sender === 'user' 
                        ? 'bg-coral-500 text-white rounded-tr-none' 
                        : 'bg-white dark:bg-sage-800 text-sage-800 dark:text-sage-100 border border-sage-100 dark:border-sage-700/50 rounded-tl-none'
                    }`}
                    dangerouslySetInnerHTML={{ __html: formatMessageText(msg.text) }}
                  />
                  <span className={`text-[9px] text-sage-400 mt-1 block px-1 ${msg.sender === 'user' ? 'text-right' : ''}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-2 max-w-[80%]">
                <div className="w-7 h-7 rounded-full bg-sage-100 dark:bg-sage-800 flex items-center justify-center shrink-0">
                  <Bot size={13} className="text-sage-600 dark:text-sage-300 animate-spin" />
                </div>
                <div className="bg-white dark:bg-sage-800 p-3 rounded-2xl rounded-tl-none border border-sage-100 dark:border-sage-700/50 shadow-sm flex items-center gap-1.5">
                  <Loader2 size={14} className="text-sage-500 animate-spin" />
                  <span className="text-xs text-sage-500 dark:text-sage-400">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length === 1 && !isLoading && (
            <div className="px-4 py-2 border-t border-sage-100/50 dark:border-sage-800 bg-white dark:bg-sage-900 flex flex-wrap gap-1.5">
              {quickReplies.map((reply, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(reply.text)}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-sage-100 dark:bg-sage-800 text-sage-600 dark:text-sage-300 hover:bg-sage-200 dark:hover:bg-sage-700 transition border border-sage-200/30 dark:border-sage-700/30 cursor-pointer"
                >
                  {reply.label}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div className="p-3 border-t border-sage-100 dark:border-sage-800 bg-white dark:bg-sage-900 flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask me anything..."
              disabled={isLoading}
              className="flex-1 px-3.5 py-2 text-sm bg-sage-50 dark:bg-sage-950 border border-sage-200 dark:border-sage-800 rounded-xl focus:outline-none focus:border-sage-500 dark:focus:border-sage-600 text-sage-800 dark:text-sage-100 disabled:opacity-50"
            />
            <button
              onClick={() => handleSend()}
              disabled={isLoading || !message.trim()}
              className="p-2.5 bg-coral-500 hover:bg-coral-600 text-white rounded-xl transition flex items-center justify-center disabled:opacity-50 disabled:hover:bg-coral-500 cursor-pointer"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-sage-600 to-sage-700 text-white flex items-center justify-center shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 focus:outline-none animate-float group cursor-pointer"
        aria-label="Toggle chat helper"
      >
        {isOpen ? (
          <X size={24} className="transform rotate-0 transition-transform duration-300" />
        ) : (
          <div className="relative">
            <MessageCircle size={26} className="transform scale-100 transition-transform duration-300 group-hover:scale-110" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-coral-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-coral-500"></span>
            </span>
          </div>
        )}
      </button>
    </div>
  );
};

export default ChatbotWidget;
