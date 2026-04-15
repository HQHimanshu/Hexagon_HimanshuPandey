import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Loader2, Sparkles, AlertTriangle, CheckCircle2, Clock, MessageSquareText, History, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../../utils/api';

const AIChat = ({ currentSensors }) => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([{ role: 'ai', display: t('chat.welcome') || 'Hello! I\'m your farming assistant. Ask me anything about your crops.' }]);
  const [history, setHistory] = useState([]);
  const [chatSessions, setChatSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  useEffect(() => {
    fetchHistory();
    loadChatSessions();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/advice/history?limit=10', { timeout: 5000 });
      if (res.data) setHistory(res.data);
    } catch (e) {}
  };

  const loadChatSessions = () => {
    const saved = localStorage.getItem('chat_sessions');
    if (saved) {
      const sessions = JSON.parse(saved);
      setChatSessions(sessions);
    }
  };

  const saveChatSession = (sessionMessages) => {
    const sessions = [...chatSessions];
    const sessionId = currentSessionId || Date.now().toString();
    
    const session = {
      id: sessionId,
      title: sessionMessages.length > 1 ? (sessionMessages.find(m => m.role === 'user')?.display?.substring(0, 50) || 'New Chat') : 'Welcome Chat',
      messages: sessionMessages,
      timestamp: new Date().toISOString(),
      lastMessage: sessionMessages[sessionMessages.length - 1]?.display || sessionMessages[sessionMessages.length - 1]?.action || ''
    };

    const existingIndex = sessions.findIndex(s => s.id === sessionId);
    if (existingIndex >= 0) {
      sessions[existingIndex] = session;
    } else {
      sessions.unshift(session); // Add to beginning
    }

    // Keep only last 20 sessions
    if (sessions.length > 20) {
      sessions.splice(20);
    }

    setChatSessions(sessions);
    localStorage.setItem('chat_sessions', JSON.stringify(sessions));
    setCurrentSessionId(sessionId);
  };

  const loadChatSession = (sessionId) => {
    const session = chatSessions.find(s => s.id === sessionId);
    if (session) {
      setMessages(session.messages);
      setCurrentSessionId(sessionId);
      setShowChatHistory(false);
    }
  };

  const startNewChat = () => {
    // Save current session before starting new one
    if (messages.length > 1) {
      saveChatSession(messages);
    }
    
    const welcomeMessage = { role: 'ai', display: t('chat.welcome') || 'Hello! I\'m your farming assistant. Ask me anything about your crops.' };
    setMessages([welcomeMessage]);
    setCurrentSessionId(null);
    setShowChatHistory(false);
  };

  const deleteChatSession = (sessionId) => {
    const updatedSessions = chatSessions.filter(s => s.id !== sessionId);
    setChatSessions(updatedSessions);
    localStorage.setItem('chat_sessions', JSON.stringify(updatedSessions));
    
    if (currentSessionId === sessionId) {
      startNewChat();
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const query = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', display: query }]);
    setIsTyping(true);

    try {
      // Fetch latest sensor data for the AI
      let sensorData = currentSensors;
      try {
        console.log('🔄 Chat: Fetching latest sensor data...');
        const sensorRes = await api.get('/sensors/latest', { timeout: 5000 });
        if (sensorRes.data) {
          console.log('✅ Chat: Got live sensor data:', sensorRes.data);
          sensorData = sensorRes.data;
        }
      } catch (err) {
        console.log('⚠️ Chat: Could not fetch sensor data -', err.message);
      }

      console.log('💬 Chat: Sending to AI with sensor data:', sensorData);
      const res = await api.post('/advice/', {
        question: query,
        sensor_data: sensorData
      }, { timeout: 40000 });

      const data = res.data;
      console.log('✅ Chat: Got AI response:', data);
      setMessages(prev => [...prev, {
        role: 'ai',
        recommendation: data.recommendation,
        reason: data.reason,
        action: data.action,
        risk: data.risk
      }]);
      
      // Save chat session after AI response
      setTimeout(() => {
        setMessages(prevMsgs => {
          saveChatSession(prevMsgs);
          return prevMsgs;
        });
      }, 100);
    } catch (err) {
      console.error('❌ Chat: AI request failed:', err.message);
      if (err.response?.status === 408 || err.code === 'ECONNABORTED') {
        console.error('⏱️ Chat: Request timeout - Ollama may be slow or unavailable');
      }
      
      // Smart fallback based on question keywords
      let fallback = '';
      let rec = 'GENERAL';
      const q = query.toLowerCase();
      
      if (q.includes('irrigat') || q.includes('water')) {
        fallback = '💧 Based on soil moisture levels, I recommend checking if soil is dry. If soil moisture is below 40%, irrigate immediately for 30-45 minutes. If above 60%, wait and monitor.';
        rec = 'IRRIGATE';
      } else if (q.includes('fertiliz') || q.includes('nutrient')) {
        fallback = '🌿 For optimal fertilizer application, apply nitrogen-rich compost during early morning hours. Recommended: 50kg per acre. Water thoroughly after application.';
        rec = 'FERTILIZE';
      } else if (q.includes('pest') || q.includes('disease')) {
        fallback = '🛡️ Monitor crops weekly for pest signs. Use neem oil spray (5ml per liter of water) as organic prevention. Check leaf undersides regularly for infestations.';
        rec = 'PEST_CONTROL';
      } else if (q.includes('weather') || q.includes('rain')) {
        fallback = '🌤️ Current weather conditions look favorable for farming. If rain is expected in next 24-48 hours, delay irrigation. Monitor humidity levels for disease prevention.';
        rec = 'WAIT';
      } else {
        fallback = `🌾 For your question about "${query.substring(0, 40)}...", I recommend monitoring soil moisture daily, maintaining proper irrigation schedule, and watching for any signs of stress or disease in your crops.`;
        rec = 'MONITOR';
      }
      
      const newMessages = [{ 
        role: 'ai',
        display: '⚠️ AI Service: ' + fallback,
        recommendation: rec,
        reason: 'Using intelligent fallback - Ollama service may be temporarily unavailable',
        action: fallback,
        risk: 'Backend AI currently unavailable'
      }];
      
      setMessages(prev => [...prev, newMessages[0]]);
      
      // Save fallback response to chat session
      setTimeout(() => {
        setMessages(prevMsgs => {
          saveChatSession(prevMsgs);
          return prevMsgs;
        });
      }, 100);
      
      // Save chat session after fallback response
      setTimeout(() => saveChatSession(newMessages), 100);
    } finally {
      setIsTyping(false);
    }
  };

  const RecIcon = ({ type }) => {
    if (type === 'WAIT' || type === 'WARN') return <AlertTriangle className="text-amber-500" size={16} />;
    if (type === 'IRRIGATE' || type === 'ACT') return <CheckCircle2 className="text-emerald-500" size={16} />;
    if (type === 'GENERAL') return <Bot className="text-blue-500" size={16} />;
    return <Sparkles className="text-blue-500" size={16} />;
  };

  return (
    <div className="flex flex-col h-[500px] sm:h-[600px] w-full bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-500 p-4 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
            <Bot className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white leading-tight">{t('chat.title') || 'AI Farming Advice'}</h3>
            <p className="text-emerald-100 text-xs font-medium">{t('chat.subtitle') || 'Powered by local LLM'}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowChatHistory(!showChatHistory)} className={`p-2 rounded-lg transition-colors ${showChatHistory ? 'bg-white/30 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`} title="Chat History">
            <Clock size={20} />
          </button>
          <button onClick={startNewChat} className="p-2 rounded-lg bg-white/10 text-white/70 hover:bg-white/20 transition-colors" title="New Chat">
            <MessageSquareText size={20} />
          </button>
          <button onClick={() => setShowHistory(!showHistory)} className={`p-2 rounded-lg transition-colors ${showHistory ? 'bg-white/30 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`} title="Advice History">
            <History size={20} />
          </button>
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-40"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
            </span>
            <span className="text-white text-xs font-bold uppercase">{t('chat.online') || 'ONLINE'}</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-gray-900/50">
        {showHistory ? (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase mb-4">Advice History</h3>
            {history.length === 0 ? <p className="text-center text-gray-400 py-8">No advice history yet</p> : history.map((item, i) => (
              <div key={i} className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 mb-1">{new Date(item.timestamp).toLocaleString()}</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Q: {item.question}</p>
                <p className="text-sm text-emerald-600 dark:text-emerald-400">{item.answer || item.recommendation_type}</p>
              </div>
            ))}
          </div>
        ) : showChatHistory ? (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase mb-4">Chat Sessions</h3>
            <button onClick={startNewChat} className="w-full p-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors">
              Start New Chat
            </button>
            {chatSessions.length === 0 ? (
              <p className="text-center text-gray-400 py-8">No saved chat sessions yet</p>
            ) : (
              chatSessions.map((session) => (
                <div key={session.id} className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{session.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(session.timestamp).toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 truncate">
                        {session.lastMessage}
                      </p>
                    </div>
                    <div className="flex gap-2 ml-2">
                      <button 
                        onClick={() => loadChatSession(session.id)}
                        className="p-1 text-emerald-600 hover:text-emerald-700 transition-colors"
                        title="Load Chat"
                      >
                        <MessageSquareText size={16} />
                      </button>
                      <button 
                        onClick={() => deleteChatSession(session.id)}
                        className="p-1 text-red-600 hover:text-red-700 transition-colors"
                        title="Delete Chat"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-teal-100 text-teal-600' : 'bg-emerald-100 text-emerald-600'}`}>
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`p-4 rounded-2xl text-sm shadow-sm ${msg.role === 'user' ? 'bg-teal-600 text-white rounded-tr-none' : 'bg-white text-gray-800 border border-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 rounded-tl-none'}`}>
                    {msg.display && <p>{msg.display}</p>}
                    {msg.action && (
                      <div className="space-y-3">
                        {msg.recommendation && <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-white uppercase tracking-wider text-xs border-b border-gray-100 dark:border-gray-700 pb-2"><RecIcon type={msg.recommendation} />{msg.recommendation}</div>}
                        {msg.reason && <div className="text-gray-600 dark:text-gray-400"><span className="font-semibold text-gray-900 dark:text-white mr-2">Reason:</span>{msg.reason}</div>}
                        {msg.action && <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-xl border border-emerald-100 dark:border-emerald-800/30 text-emerald-800 dark:text-emerald-300 font-medium">{msg.action}</div>}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0"><Loader2 size={16} className="animate-spin" /></div>
                  <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4 rounded-2xl flex gap-1 items-center">
                    <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce"></span>
                    <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 shrink-0 flex gap-2">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about your crops..." className="flex-1 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 border border-gray-200 dark:border-gray-700" />
        <button type="submit" disabled={!input.trim() || isTyping} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-5 py-3 transition-colors disabled:opacity-50 flex items-center justify-center">
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default AIChat;
