"use client";

import { useState, useRef, useEffect } from "react";

import {
  Send,
  ImagePlus,
  Mic,
  Loader,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

import toast from "react-hot-toast";

interface Message {
  role: "user" | "ai";
  text: string;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function Home() {
  
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const [isFocused, setIsFocused] = useState(false);

  const [isRecording, setIsRecording] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
const [imagePreview, setImagePreview] = useState<string | null>(null);
const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {

    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [chat, loading]);

 async function sendMessage() {
  if (!message.trim() && !selectedImage) return;

  const currentMessage = message;

  const userMessage: Message = {
    role: "user",
    text: selectedImage
      ? `${currentMessage || "Analyze this medical image"}\n\n[Image attached]`
      : currentMessage,
  };

  setChat((prev) => [...prev, userMessage]);

  setMessage("");
  setImagePreview(null);
  setLoading(true);

  try {
    const formData = new FormData();

    formData.append(
      "message",
      currentMessage || "Analyze this medical image and give a safe medical report"
    );

    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    const res = await fetch("${process.env.NEXT_PUBLIC_API_URL}/chat", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    const aiMessage: Message = {
      role: "ai",
      text: data.response,
    };

    setChat((prev) => [...prev, aiMessage]);
  } catch (error) {
    toast.error("Failed to get AI response");

    setChat((prev) => [
      ...prev,
      {
        role: "ai",
        text: "Something went wrong. Please try again.",
      },
    ]);
  } finally {
    setSelectedImage(null);
    setLoading(false);
  }

  inputRef.current?.focus();
}

  

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {

    if (
      e.key === "Enter" &&
      !e.shiftKey &&
      (message.trim() || selectedImage)
    ) {

      e.preventDefault();

      sendMessage();

    }

  };


  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];

  if (!file) return;

  if (!file.type.startsWith("image/")) {
    toast.error("Please upload only image file");
    return;
  }

  setSelectedImage(file);
  setImagePreview(URL.createObjectURL(file));

  toast.success("Image selected");
};

  const toggleRecording = () => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    toast.error("Mic is not supported. Please use Google Chrome.");
    return;
  }

  const recognition = new SpeechRecognition();

  recognition.lang = "en-IN";
  recognition.continuous = false;
  recognition.interimResults = true;

  recognition.start();
  setIsRecording(true);

  recognition.onresult = (event: any) => {
    let transcript = "";

    for (let i = event.resultIndex; i < event.results.length; i++) {
      transcript += event.results[i][0].transcript;
    }

    setMessage(transcript);
  };

  recognition.onerror = () => {
    toast.error("Mic error. Please allow microphone permission.");
    setIsRecording(false);
  };

  recognition.onend = () => {
    setIsRecording(false);
    inputRef.current?.focus();
  };
};

  return (

    <main className="h-screen bg-gradient-to-br from-black via-slate-950 to-black text-white flex flex-col overflow-hidden">

      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">

        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"
        />

        <motion.div
          animate={{
            x: [0, -30, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"
        />

      </div>

      {/* Header */}
      <motion.div
        initial={{
          y: -20,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.5,
        }}
        className="relative border-b border-zinc-800/50 bg-gradient-to-b from-black/90 to-black/40 backdrop-blur-xl px-6 py-5 shadow-lg"
      >

        <div className="flex items-center gap-3">

          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="p-2 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg shadow-lg"
          >

            <svg
              className="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >

              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />

            </svg>

          </motion.div>

          <div>

            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              MediMind AI
            </h1>

            <p className="text-xs text-zinc-400 flex items-center gap-2">

              <motion.span
                animate={{
                  opacity: [1, 0.5, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                className="inline-block w-2 h-2 bg-emerald-500 rounded-full"
              />

              AI Medical Assistant

            </p>

          </div>

        </div>

      </motion.div>

      {/* Chat Area */}
      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          delay: 0.1,
        }}
        className="relative flex-1 overflow-y-auto px-6 py-6 space-y-4 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent"
      >

        {/* Welcome */}
        {chat.length === 0 && !loading && (

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
            }}
            className="flex justify-start"
          >

            <div className="relative max-w-xl group">

              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl border border-slate-700/50 shadow-lg">

                <p className="text-slate-100 leading-relaxed">

                  👋 Hello! I'm your AI Medical Assistant.
                  Describe symptoms, upload reports,
                  or ask medical questions.

                </p>

              </div>

            </div>

          </motion.div>

        )}

        {/* Messages */}
        <AnimatePresence mode="popLayout">

          {chat.map((msg, index) => (

            <motion.div
              key={index}
              initial={{
                opacity: 0,
                y: 10,
                scale: 0.95,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: -10,
              }}
              transition={{
                duration: 0.3,
              }}
              className={`flex ${
                msg.role === "user"
                  ? "justify-end"
                  : "justify-start"
              }`}
            >

              <div className="relative max-w-xl group">

                {msg.role === "ai" && (

                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                )}

                <div
                  className={`relative p-4 rounded-2xl ${
                    msg.role === "user"
                      ? "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/20 rounded-br-sm"
                      : "bg-gradient-to-br from-slate-800 to-slate-900 text-slate-50 shadow-lg border border-slate-700/50 rounded-bl-sm"
                  }`}
                >

                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {msg.text}
                  </p>

                </div>

              </div>

            </motion.div>

          ))}

        </AnimatePresence>

        {/* Loading */}
        <AnimatePresence>

          {loading && (

            <motion.div
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -10,
              }}
              className="flex justify-start"
            >

              <div className="relative max-w-xl">

                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-2xl blur-lg" />

                <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 p-4 rounded-2xl border border-slate-700/50 shadow-lg flex items-center gap-3">

                  <motion.div
                    animate={{
                      rotate: 360,
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >

                    <Loader
                      size={18}
                      className="text-emerald-400"
                    />

                  </motion.div>

                  <span className="text-sm text-slate-300">
                    Please wait Bro....
                  </span>

                </div>

              </div>

            </motion.div>

          )}

        </AnimatePresence>

        <div ref={bottomRef} />

      </motion.div>

      {/* Input */}
      <motion.div
        initial={{
          y: 20,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          delay: 0.2,
        }}
        className="relative border-t border-zinc-800/50 bg-gradient-to-b from-black/90 to-black/40 backdrop-blur-xl px-6 py-5 shadow-2xl"
      >
        {imagePreview && (

  <div className="mb-3 relative w-28 h-28">

    <img
      src={imagePreview}
      alt="Preview"
      className="
        w-28
        h-28
        object-cover
        rounded-xl
        border
        border-emerald-500/30
      "
    />

    <button
      onClick={() => {

        setSelectedImage(null);
        setImagePreview(null);

      }}
      className="
        absolute
        -top-2
        -right-2
        bg-red-500
        text-white
        rounded-full
        w-6
        h-6
        text-xs
      "
    >

      ✕

    </button>

  </div>

)}

        <div className="flex items-end gap-3">

          {/* Image Button */}
          {/* Image Button */}
<motion.button
  whileHover={{
    scale: 1.1,
    rotate: 5,
  }}
  whileTap={{
    scale: 0.95,
  }}
  onClick={() => fileInputRef.current?.click()}
  className="flex-shrink-0 p-3 rounded-lg bg-zinc-900/80 border border-zinc-700/50 text-zinc-400 hover:text-emerald-400 hover:border-emerald-500/30 transition-all"
>

  <ImagePlus size={20} />

</motion.button>

<input
  ref={fileInputRef}
  type="file"
  accept="image/*"
  onChange={handleImageSelect}
  className="hidden"
/>

          {/* Voice Button */}
          <motion.button
            whileHover={{
              scale: 1.1,
            }}
            whileTap={{
              scale: 0.95,
            }}
            onClick={toggleRecording}
            className={`flex-shrink-0 p-3 rounded-lg border transition-all ${
              isRecording
                ? "bg-red-500/20 border-red-500/30 text-red-400"
                : "bg-zinc-900/80 border-zinc-700/50 text-zinc-400 hover:text-cyan-400 hover:border-cyan-500/30"
            }`}
          >

            <Mic
              size={20}
              className={
                isRecording
                  ? "animate-pulse"
                  : ""
              }
            />

          </motion.button>

          {/* Textarea */}
          <motion.div
            animate={{
              boxShadow: isFocused
                ? "0 0 20px rgba(16,185,129,0.3)"
                : "0 0 0px rgba(16,185,129,0)",
            }}
            className="flex-1 relative"
          >

            <textarea
              ref={inputRef}
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              onKeyDown={handleKeyPress}
              onFocus={() =>
                setIsFocused(true)
              }
              onBlur={() =>
                setIsFocused(false)
              }
              placeholder="Describe your symptoms..."
              rows={1}
              className="
                w-full
                bg-zinc-900/80
                border
                border-zinc-700/50
                p-4
                rounded-lg
                outline-none
                text-white
                placeholder-zinc-500
                transition-all
                duration-300
                focus:border-emerald-500/50
                focus:bg-zinc-800/80
                focus:ring-1
                focus:ring-emerald-500/20
                resize-none
                min-h-[56px]
                max-h-40
                overflow-y-auto
              "
            />

          </motion.div>

          {/* Send */}
          <motion.button
            whileHover={
              (message.trim() || selectedImage) && !loading
                ? { scale: 1.08 }
                : {}
            }
            whileTap={
              (message.trim() || selectedImage) && !loading
                ? { scale: 0.95 }
                : {}
            }
            onClick={sendMessage}
            
              disabled={(!message.trim() && !selectedImage) || loading}
            
            className={`flex-shrink-0 p-4 rounded-lg transition-all duration-300 ${
              (message.trim() || selectedImage) && !loading
                ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/40"
                : "bg-zinc-800 text-zinc-400 cursor-not-allowed opacity-60"
            }`}
          >

            <motion.div
              animate={{
                rotate: loading ? 360 : 0,
              }}
              transition={{
                duration: 1,
                repeat: loading ? Infinity : 0,
              }}
            >

              <Send size={20} />

            </motion.div>

          </motion.button>

        </div>

       

        

      </motion.div>

    </main>

  );
}