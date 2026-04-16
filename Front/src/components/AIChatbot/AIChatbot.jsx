import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { MessageCircle, X, Send, Bot, User, Minus, Sparkles, ShoppingBag, Truck, Headphones } from 'lucide-react';
import './AIChatbot.scss';

const QuickAction = ({ icon: Icon, label, onClick }) => (
  <button className="quick-action-chip" onClick={() => onClick(label)}>
    <Icon size={14} />
    <span>{label}</span>
  </button>
);

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('phonex_chat_history');
    return saved ? JSON.parse(saved) : [
      { 
        role: 'assistant', 
        text: '👋 Hi there! I am your Phonex Smart Assistant. I can help you find products, track orders, or answer any questions about our store!', 
        time: new Date().toLocaleTimeString() 
      }
    ];
  });
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const quickActions = [
    { icon: Sparkles, label: 'Trending Products' },
    { icon: Truck, label: 'Track My Order' },
    { icon: Headphones, label: 'Contact Support' },
    { icon: ShoppingBag, label: 'Shop Categories' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('phonex_chat_history', JSON.stringify(messages));
  }, [messages]);

  const handleSend = async (userMsgText) => {
    const textToSend = typeof userMsgText === 'string' ? userMsgText : message;
    if (!textToSend.trim()) return;

    const userMessage = { role: 'user', text: textToSend, time: new Date().toLocaleTimeString() };
    setMessages(prev => [...prev, userMessage]);
    if (typeof userMsgText !== 'string') setMessage('');
    setIsLoading(true);

    try {
      const history = messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.text }]
      }));

      const response = await axios.post('/api/v1/ai/chat', { message: textToSend, history });
      
      const aiMessage = { 
        role: 'assistant', 
        text: response.data.message, 
        time: new Date().toLocaleTimeString() 
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        text: 'I\'m currently optimizing my systems. You can also reach us directly via the contact page!', 
        time: new Date().toLocaleTimeString() 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
  };

  const clearHistory = () => {
    setMessages([{ 
      role: 'assistant', 
      text: '👋 Hello! How can I assist you today?', 
      time: new Date().toLocaleTimeString() 
    }]);
    localStorage.removeItem('phonex_chat_history');
  };

  return (
    <div className={`ai-chatbot-container ${isOpen ? 'open' : ''} ${isMinimized ? 'minimized' : ''}`}>
      {!isOpen && (
        <button className="chat-launcher" onClick={toggleChat} title="Chat with AI">
          <div className="launcher-icon">
             <MessageCircle size={28} />
             <div className="online-dot"></div>
          </div>
          <span className="launch-text">Need Help?</span>
        </button>
      )}

      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <div className="header-info">
              <div className="bot-avatar">
                <Bot size={20} />
                <div className="status-indicator"></div>
              </div>
              <div className="bot-status">
                <h3>Phonex Smart Assistant</h3>
                <span className="status-text">Ready to help</span>
              </div>
            </div>
            <div className="header-actions">
              <button onClick={() => setIsMinimized(!isMinimized)} title="Minimize">
                <Minus size={20} />
              </button>
              <button onClick={toggleChat} title="Close">
                <X size={20} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              <div className="chat-messages">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`message-wrapper ${msg.role}`}>
                    {msg.role === 'assistant' && (
                       <div className="message-icon">
                          <Bot size={14} />
                       </div>
                    )}
                    <div className="message-content">
                      <p>{msg.text}</p>
                      <span className="message-time">{msg.time}</span>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="message-wrapper assistant loading">
                    <div className="message-icon">
                      <Bot size={14} />
                    </div>
                    <div className="message-content">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="quick-actions-container">
                 <div className="quick-actions-track">
                    {quickActions.map((action, i) => (
                      <QuickAction 
                        key={i} 
                        icon={action.icon} 
                        label={action.label} 
                        onClick={handleSend}
                      />
                    ))}
                 </div>
              </div>

              <form className="chat-input" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
                <input
                  type="text"
                  placeholder="Ask me anything..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={isLoading}
                />
                <button type="submit" disabled={!message.trim() || isLoading}>
                  <Send size={18} />
                </button>
              </form>
              
              <div className="chat-footer">
                <button onClick={clearHistory}>Clear Conversation</button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AIChatbot;
