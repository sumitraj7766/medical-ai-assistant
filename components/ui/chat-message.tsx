"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Send, Bot, User, Loader } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "ai";
  text: string;
  timestamp?: string;
}

function ChatMessage({ role, text, timestamp }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`flex gap-4 mb-6 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
          className="relative mt-1"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl blur-lg opacity-60" />
          <div className="relative bg-gradient-to-br from-cyan-500 to-blue-600 p-2.5 rounded-xl h-fit shadow-lg">
            <Bot size={20} className="text-white" strokeWidth={2} />
          </div>
        </motion.div>
      )}

      <div className="flex flex-col gap-1 max-w-2xl">
        <div
          className={`rounded-2xl p-4 text-sm leading-7 backdrop-blur-sm transition-all duration-300 ${
            isUser
              ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/20 rounded-br-sm"
              : "bg-gradient-to-br from-slate-800 to-slate-900 text-slate-50 shadow-lg shadow-slate-900/40 rounded-bl-sm border border-slate-700/50"
          }`}
        >
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown
              components={{
                p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                code: ({ node, inline, ...props }) => (
                  inline ? (
                    <code className="bg-slate-900/50 px-2 py-1 rounded text-xs font-mono" {...props} />
                  ) : (
                    <code className="block bg-slate-900/70 p-3 rounded-lg overflow-x-auto text-xs font-mono mb-2" {...props} />
                  )
                ),
                a: ({ node, ...props }) => (
                  <a className="text-cyan-300 hover:text-cyan-200 underline" {...props} />
                ),
              }}
            >
              {text}
            </ReactMarkdown>
          </div>
        </div>
        {timestamp && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`text-xs ${isUser ? "text-right" : "text-left"} text-slate-500`}
          >
            {timestamp}
          </motion.span>
        )}
      </div>

      {isUser && (
        <motion.div
          initial={{ scale: 0, rotate: 20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
          className="relative mt-1"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl blur-lg opacity-40" />
          <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 p-2.5 rounded-xl h-fit shadow-lg">
            <User size={20} className="text-white" strokeWidth={2} />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Array<{ role: "user" | "ai"; text: string; timestamp: string }>>([
    {
      role: "ai",
      text: "Hey there! 👋 I'm your AI assistant. How can I help you today? Feel free to ask me anything!",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: userMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);

    setIsLoading(true);
    // Simulate AI response delay
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "That's a great question! I'm working on understanding what you need. In a real application, I'd process your request and provide a thoughtful response here. Feel free to ask me anything!",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setIsLoading(false);
    }, 1500);

    inputRef.current?.focus();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
      </div>

      {/* Main container */}
      <div className="relative h-full flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-xl px-6 py-4 shadow-lg"
        >
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                <Bot size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                  AI Assistant
                </h1>
                <p className="text-xs text-slate-400">Online • Ready to help</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Messages container */}
        <div className="flex-1 overflow-y-auto px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="popLayout">
              {messages.map((msg, idx) => (
                <ChatMessage key={idx} role={msg.role} text={msg.text} timestamp={msg.timestamp} />
              ))}
            </AnimatePresence>

            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-4 mb-6"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl blur-lg opacity-60" />
                  <div className="relative bg-gradient-to-br from-cyan-500 to-blue-600 p-2.5 rounded-xl h-fit shadow-lg">
                    <Bot size={20} className="text-white" />
                  </div>
                </div>
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl rounded-bl-sm p-4 shadow-lg flex items-center gap-2">
                  <Loader size={16} className="text-cyan-400 animate-spin" />
                  <span className="text-sm text-slate-300">AI is thinking...</span>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input area */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="border-t border-slate-700/50 bg-slate-900/50 backdrop-blur-xl px-6 py-6 shadow-2xl"
        >
          <div className="max-w-4xl mx-auto">
            <div className="relative flex gap-3">
              <div className="relative flex-1 group">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything... (Shift+Enter for new line)"
                  className="w-full bg-slate-800/60 border border-slate-600/50 rounded-full py-3 px-6 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:bg-slate-800 focus:ring-1 focus:ring-cyan-500/30 transition-all duration-300"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 opacity-0 group-focus-within:opacity-10 blur transition-opacity duration-300 pointer-events-none" />
              </div>

              <motion.button
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full font-medium shadow-lg shadow-blue-500/40 hover:shadow-blue-500/60 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2"
              >
                <Send size={18} />
                <span className="hidden sm:inline">Send</span>
              </motion.button>
            </div>

            <p className="text-xs text-slate-500 mt-3 text-center">
              Press <kbd className="bg-slate-700 px-2 py-1 rounded text-slate-300 font-mono">Enter</kbd> to send • <kbd className="bg-slate-700 px-2 py-1 rounded text-slate-300 font-mono">Shift+Enter</kbd> for new line
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}