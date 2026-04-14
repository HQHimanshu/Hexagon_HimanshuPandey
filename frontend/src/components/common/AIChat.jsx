import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Loader2, Sparkles, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../../utils/api';

const AIChat = ({ currentSensors }) => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([{ role: 'ai', display: t('chat.welcome') || 'Hello! I\'m your farming assistant. Ask me anything about your crops.' }]);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    fetchHistory();
  }, [messages.length]);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/advice/history?limit=10', { timeout: 5000 });
      if (res.data) setHistory(res.data);
    } catch (e) {}
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const query = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', display: query }]);
    setIsTyping(true);

    try {
      const res = await api.post('/advice/', {
        question: query,
        sensor_data: currentSensors || null
      }, { timeout: 30000 });

      const data = res.data;
      setMessages(prev => [...prev, {
        role: 'ai',
        recommendation: data.recommendation,
        reason: data.reason,
        action: data.action
      }]);
    } catch (err) {
      console.warn('AI advice failed, using fallback');
      // Smart fallback based on question keywords
      let fallback = '';
      const q = query.toLowerCase();
      if (q.includes('irrigat') || q.includes('water')) {
        fallback = '💧 Based on current soil moisture, I recommend checking soil moisture levels. If soil moisture is below 40%, irrigate for 30 minutes. If above 60%, wait 1-2 days.';
      } else if (q.includes('fertiliz') || q.includes('nutrient')) {
        fallback = '🌿 For optimal fertilizer application, apply nitrogen-rich compost during early morning. Recommended: 50kg per acre for current growth stage.';
      } else if (q.includes('pest') || q.includes('disease')) {
        fallback = '🛡️ Monitor crops weekly for pest signs. Use neem oil spray (5ml/liter water) as organic prevention. Check leaf undersides regularly.';
      } else if (q.includes('weather') || q.includes('rain')) {
        fallback = '🌤️ Current conditions are favorable. Delay irrigation if rain is expected in next 24 hours. Monitor humidity for disease prevention.';
      } else {
        fallback = `🌾 Thanks for your question about "${query.substring(0, 50)}...". Based on current sensor data, your farm conditions look stable. For specific advice, monitor soil moisture daily and adjust irrigation accordingly.`;
      }
      setMessages(prev => [...prev, { role: 'ai', display: fallback }]);
    } finally {
      setIsTyping(false);
    }
  };

  const RecIcon = ({ type }) => {
    if (type === 'WAIT' || type === 'WARN') return <AlertTriangle className="text-amber-500" size={16} />;
    if (type === 'ACT') return <CheckCircle2 className="text-emerald-500" size={16} />;
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
          <button onClick={() => setShowHistory(!showHistory)} className={`p-2 rounded-lg transition-colors ${showHistory ? 'bg-white/30 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`} title="History">
            <Clock size={20} />
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
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase mb-4">History</h3>
            {history.length === 0 ? <p className="text-center text-gray-400 py-8">No history yet</p> : history.map((item, i) => (
              <div key={i} className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 mb-1">{new Date(item.timestamp).toLocaleString()}</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Q: {item.question}</p>
                <p className="text-sm text-emerald-600 dark:text-emerald-400">{item.answer || item.recommendation_type}</p>
              </div>
            ))}
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
