"use client";

import { Send, ImagePlus, Mic, X } from "lucide-react";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatInputProps {
  message: string;
  setMessage: (value: string) => void;
  sendMessage: () => void;
  loading: boolean;
}

export default function ChatInput({
  message,
  setMessage,
  sendMessage,
  loading,
}: ChatInputProps) {

  const [isFocused, setIsFocused] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {

    if (e.key === "Enter" && !e.shiftKey) {

      e.preventDefault();

      if (message.trim()) {
        sendMessage();
      }

    }

  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    const file = e.target.files?.[0];

    if (file) {

      const reader = new FileReader();

      reader.onload = (event) => {
        setAttachedImage(event.target?.result as string);
      };

      reader.readAsDataURL(file);

    }

  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  return (

    <div className="relative border-t border-zinc-800/50 bg-gradient-to-b from-black to-zinc-950 p-4 shadow-2xl backdrop-blur-sm">

      {/* Top Glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

      <div className="max-w-4xl mx-auto space-y-3">

        {/* Image Preview */}
        <AnimatePresence>

          {attachedImage && (

            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >

              <div className="relative group rounded-xl overflow-hidden bg-zinc-900 border border-zinc-700/50 p-2">

                <img
                  src={attachedImage}
                  alt="Attached"
                  className="w-full h-32 object-cover rounded-lg"
                />

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setAttachedImage(null)}
                  className="absolute top-3 right-3 bg-black/80 p-1.5 rounded-full border border-zinc-600/50"
                >

                  <X
                    size={16}
                    className="text-zinc-300"
                  />

                </motion.button>

              </div>

            </motion.div>

          )}

        </AnimatePresence>

        {/* Main Input */}
        <motion.div
          layout
          className={`relative transition-all duration-300 rounded-2xl p-3 shadow-lg ${
            isFocused
              ? "ring-2 ring-emerald-500/40"
              : "ring-1 ring-zinc-700/50"
          } bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-800`}
        >

          {/* Focus Gradient */}
          <motion.div
            animate={{
              opacity: isFocused ? 1 : 0,
            }}
            className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/5 to-cyan-500/5 pointer-events-none"
          />

          <div className="relative flex items-end gap-2">

            {/* Image Upload */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="flex-shrink-0 p-2.5 rounded-lg text-zinc-400 hover:text-emerald-400 hover:bg-zinc-800/80 transition-all duration-200"
            >

              <ImagePlus size={20} />

            </motion.button>

            {/* Hidden Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            {/* Voice Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleRecording}
              disabled={loading}
              className={`flex-shrink-0 p-2.5 rounded-lg transition-all duration-200 ${
                isRecording
                  ? "bg-red-500/20 text-red-400"
                  : "text-zinc-400 hover:text-cyan-400 hover:bg-zinc-800/80"
              }`}
            >

              <Mic
                size={20}
                className={isRecording ? "animate-pulse" : ""}
              />

            </motion.button>

            {/* Textarea */}
            <div className="flex-1 relative">

              <textarea
                ref={inputRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Describe your symptoms or ask a question..."
                rows={1}
                className="w-full bg-transparent outline-none px-3 py-2 text-white placeholder-zinc-500 text-sm resize-none max-h-40"
              />

              {/* Character Count */}
              <AnimatePresence>

                {message.length > 0 && (

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute right-3 -bottom-5 text-xs text-zinc-500"
                  >

                    {message.length} characters

                  </motion.div>

                )}

              </AnimatePresence>

            </div>

            {/* Send Button */}
            <motion.button
              whileHover={
                !loading && message.trim()
                  ? { scale: 1.08 }
                  : {}
              }
              whileTap={
                !loading && message.trim()
                  ? { scale: 0.95 }
                  : {}
              }
              onClick={sendMessage}
              disabled={loading || !message.trim()}
              className={`flex-shrink-0 p-3 rounded-xl transition-all duration-300 ${
                loading || !message.trim()
                  ? "bg-zinc-700 text-zinc-400 cursor-not-allowed opacity-60"
                  : "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 shadow-lg shadow-emerald-500/30"
              }`}
            >

              <motion.div
                animate={{
                  rotate: loading ? 360 : 0,
                }}
                transition={{
                  duration: 1,
                  repeat: loading ? Infinity : 0,
                  ease: "linear",
                }}
              >

                <Send size={18} />

              </motion.div>

            </motion.button>

          </div>

        </motion.div>

        {/* Footer Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity:
              isFocused || message.length > 0
                ? 1
                : 0.5,
          }}
          className="flex justify-between items-center px-3 text-xs text-zinc-500"
        >

          <div>

            Press{" "}
            <kbd className="bg-zinc-800 px-2 py-0.5 rounded text-zinc-300 font-mono text-xs">
              Enter
            </kbd>{" "}
            to send

          </div>

          <div>

            {attachedImage && (
              <span className="text-emerald-500/70">
                📎 Image attached
              </span>
            )}

          </div>

        </motion.div>

      </div>

    </div>

  );
}