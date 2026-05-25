"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, User, Loader2 } from "lucide-react";

export default function AiChatModal({ isOpen, onClose, productName }: { isOpen: boolean; onClose: () => void; productName: string }) {
  const [messages, setMessages] = useState<{ role: "bot" | "user", text: string }[]>([
    { role: "bot", text: `Hello! I am the Khush Enterprises AI Assistant. How can I help you with the ${productName}? I can generate safety manuals or answer technical questions.` }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages(prev => [...prev, { role: "user", text: input }]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      setMessages(prev => [...prev, { role: "bot", text: `I have analyzed your request regarding the ${productName}. The technical documentation confirms that this equipment is suitable for advanced laboratory applications. Please refer to the AI Generated Manual tab for a complete protocol.` }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-theme/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-lg bg-theme border border-theme/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden h-[600px] max-h-full"
          >
            {/* Header */}
            <div className="p-4 border-b border-theme/10 bg-midnight-navy flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/20 text-purple-400 rounded-full flex items-center justify-center">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-theme text-sm">AI Product Assistant</h3>
                  <p className="text-xs text-green-400 flex items-center gap-1">Online</p>
                </div>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-theme">
                <X size={20} />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "self-end ml-auto flex-row-reverse" : "self-start"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === "bot" ? "bg-purple-500/20 text-purple-400" : "bg-electric-blue text-theme"}`}>
                    {msg.role === "bot" ? <Bot size={16} /> : <User size={16} />}
                  </div>
                  <div className={`p-3 rounded-2xl text-sm ${msg.role === "bot" ? "bg-theme/5 text-slate-300 rounded-tl-none border border-theme/5" : "bg-electric-blue text-theme rounded-tr-none"}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3 max-w-[85%] self-start">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-purple-500/20 text-purple-400">
                    <Bot size={16} />
                  </div>
                  <div className="p-3 rounded-2xl text-sm bg-theme/5 text-slate-300 rounded-tl-none border border-theme/5 flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin text-purple-400" /> AI is thinking...
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-theme/40 border-t border-theme/10">
              <form onSubmit={handleSend} className="flex gap-2">
                <input 
                  type="text" 
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask about specifications, manuals, or usage..." 
                  className="flex-1 bg-theme/5 border border-theme/10 rounded-xl px-4 py-3 text-theme text-sm outline-none focus:border-purple-400 transition-colors"
                />
                <button type="submit" disabled={!input.trim() || isTyping} className="bg-purple-500 hover:bg-purple-600 text-theme w-12 rounded-xl flex items-center justify-center transition-colors disabled:opacity-50">
                  <Send size={18} />
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
