"use client";
import { useState } from "react";
import { MessageSquarePlus, Trash2, Pin, Ellipsis, ChevronDown, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatItem {
  id: string;
  title: string;
  date: string;
  isPinned: boolean;
}

export default function Sidebar() {
  const [chats, setChats] = useState<ChatItem[]>([
    { id: "1", title: "Fever discussion", date: "Today", isPinned: true },
    { id: "2", title: "Headache symptoms", date: "Yesterday", isPinned: false },
    { id: "3", title: "Medication interactions", date: "2 days ago", isPinned: false },
    { id: "4", title: "Sleep issues", date: "1 week ago", isPinned: false },
  ]);

  const [activeChat, setActiveChat] = useState<string>("1");
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredChat, setHoveredChat] = useState<string | null>(null);

  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedChats = filteredChats.filter((chat) => chat.isPinned);
  const unpinnedChats = filteredChats.filter((chat) => !chat.isPinned);

  const togglePin = (id: string) => {
    setChats(chats.map((chat) =>
      chat.id === id ? { ...chat, isPinned: !chat.isPinned } : chat
    ));
  };

  const deleteChat = (id: string) => {
    setChats(chats.filter((chat) => chat.id !== id));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="hidden md:flex w-80 bg-gradient-to-b from-zinc-950 via-zinc-950 to-black border-r border-zinc-800/50 flex-col shadow-2xl">
      {/* Animated top border glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />

      {/* Header Section */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="p-4 border-b border-zinc-800/50 space-y-3"
      >
        {/* New Chat Button */}
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl p-3 flex items-center justify-center gap-2 font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all duration-300 text-sm"
        >
          <motion.div
            whileHover={{ rotate: 90 }}
            transition={{ duration: 0.3 }}
          >
            <MessageSquarePlus size={18} />
          </motion.div>
          New Chat
        </motion.button>

        {/* Search Bar */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-cyan-500/5 rounded-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
          <div className="relative flex items-center gap-2 bg-zinc-900/80 border border-zinc-700/50 rounded-lg px-3 py-2.5 group-focus-within:border-emerald-500/30 transition-all duration-300">
            <Search size={16} className="text-zinc-500 group-focus-within:text-emerald-500/70 transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chats..."
              className="flex-1 bg-transparent outline-none text-sm text-white placeholder-zinc-500"
            />
          </div>
        </div>
      </motion.div>

      {/* Chats List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex-1 overflow-y-auto px-3 py-4 space-y-3 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent"
      >
        {/* Pinned Section */}
        <AnimatePresence>
          {pinnedChats.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-2 py-1.5 flex items-center gap-2 text-xs font-semibold text-zinc-500 uppercase tracking-wide"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  📌
                </motion.div>
                Pinned
              </motion.div>
              <motion.div variants={containerVariants} initial="hidden" animate="show">
                {pinnedChats.map((chat) => (
                  <motion.div key={chat.id} variants={itemVariants}>
                    <ChatItemComponent
                      chat={chat}
                      isActive={activeChat === chat.id}
                      isHovered={hoveredChat === chat.id}
                      onHover={() => setHoveredChat(chat.id)}
                      onHoverEnd={() => setHoveredChat(null)}
                      onSelect={() => setActiveChat(chat.id)}
                      onPin={() => togglePin(chat.id)}
                      onDelete={() => deleteChat(chat.id)}
                      isPinned={chat.isPinned}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Recent Section */}
        <AnimatePresence>
          {unpinnedChats.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-2 py-1.5 flex items-center gap-2 text-xs font-semibold text-zinc-500 uppercase tracking-wide"
              >
                <motion.div
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ⏱️
                </motion.div>
                Recent
              </motion.div>
              <motion.div variants={containerVariants} initial="hidden" animate="show">
                {unpinnedChats.map((chat) => (
                  <motion.div key={chat.id} variants={itemVariants}>
                    <ChatItemComponent
                      chat={chat}
                      isActive={activeChat === chat.id}
                      isHovered={hoveredChat === chat.id}
                      onHover={() => setHoveredChat(chat.id)}
                      onHoverEnd={() => setHoveredChat(null)}
                      onSelect={() => setActiveChat(chat.id)}
                      onPin={() => togglePin(chat.id)}
                      onDelete={() => deleteChat(chat.id)}
                      isPinned={chat.isPinned}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        <AnimatePresence>
          {filteredChats.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex flex-col items-center justify-center py-12 px-4 text-center"
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-3xl mb-3"
              >
                💬
              </motion.div>
              <p className="text-xs text-zinc-500">
                {searchQuery ? "No chats found" : "No chats yet"}
              </p>
              <p className="text-xs text-zinc-600 mt-1">
                {searchQuery ? "Try a different search" : "Start a new conversation"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Footer Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="p-4 border-t border-zinc-800/50 space-y-3"
      >
        <div className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-lg p-3 text-xs text-zinc-300 leading-relaxed">
          <p className="font-semibold text-emerald-400 mb-1">💡 Tip</p>
          <p>Pin important conversations for quick access.</p>
        </div>
      </motion.div>
    </div>
  );
}

interface ChatItemComponentProps {
  chat: ChatItem;
  isActive: boolean;
  isHovered: boolean;
  onHover: () => void;
  onHoverEnd: () => void;
  onSelect: () => void;
  onPin: () => void;
  onDelete: () => void;
  isPinned: boolean;
}

function ChatItemComponent({
  chat,
  isActive,
  isHovered,
  onHover,
  onHoverEnd,
  onSelect,
  onPin,
  onDelete,
  isPinned,
}: ChatItemComponentProps) {
  const [showActions, setShowActions] = useState(false);

  return (
    <motion.div
      onHoverStart={onHover}
      onHoverEnd={onHoverEnd}
      onClick={onSelect}
      whileHover={{ x: 4 }}
      className={`relative group cursor-pointer rounded-lg transition-all duration-300 overflow-hidden ${
        isActive
          ? "bg-gradient-to-r from-emerald-500/20 to-cyan-500/10 border border-emerald-500/30"
          : "bg-zinc-900/40 border border-transparent hover:bg-zinc-800/60 hover:border-zinc-700/50"
      }`}
    >
      {/* Animated background glow */}
      {isActive && (
        <motion.div
          layoutId="activeGlow"
          className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent pointer-events-none"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}

      <div className="relative p-3 flex items-start justify-between gap-2">
        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium truncate transition-colors duration-300 ${
            isActive ? "text-emerald-300" : "text-white group-hover:text-emerald-300"
          }`}>
            {chat.title}
          </p>
          <p className="text-xs text-zinc-500 mt-1">{chat.date}</p>
        </div>

        {/* Action Buttons */}
        <AnimatePresence>
          {(isHovered || showActions) && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex items-center gap-1 flex-shrink-0"
            >
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onPin();
                }}
                className={`p-1.5 rounded-lg transition-all duration-200 ${
                  isPinned
                    ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                    : "text-zinc-500 hover:text-emerald-400 hover:bg-zinc-700/50"
                }`}
                title={isPinned ? "Unpin" : "Pin"}
              >
                <Pin size={14} className="fill-current" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                title="Delete"
              >
                <Trash2 size={14} />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Active indicator line */}
      {isActive && (
        <motion.div
          layoutId="activeLine"
          className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-400 to-cyan-500"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </motion.div>
  );
}