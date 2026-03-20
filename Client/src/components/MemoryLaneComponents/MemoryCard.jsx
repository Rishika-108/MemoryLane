import React, { useState } from "react";
import { motion } from "framer-motion";

const MemoryCard = ({ memory, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Pick emotion color
  const emotionColorMap = {
    happy: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
    sad: "bg-blue-500/20 text-blue-300 border-blue-500/40",
    angry: "bg-red-500/20 text-red-300 border-red-500/40",
    excited: "bg-orange-500/20 text-orange-300 border-orange-500/40",
    neutral: "bg-gray-500/20 text-gray-300 border-gray-500/40",
    informative: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    inspiring: "bg-pink-500/20 text-pink-300 border-pink-500/40"
  };
  
  const emotionClass = emotionColorMap[memory.aiData?.emotion?.toLowerCase()] || "bg-indigo-500/20 text-indigo-300 border-indigo-500/40";

  return (
    <motion.div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="
        relative group
        bg-slate-800/80 backdrop-blur-xl
        p-6 rounded-3xl
        shadow-[0_8px_30px_rgba(0,0,0,0.4)]
        hover:shadow-[0_20px_60px_rgba(139,92,246,0.3)]
        cursor-pointer
        border border-slate-700/60
        overflow-hidden
        transition-all duration-300
        flex flex-col h-full
      "
    >
      {/* Dynamic Emotion Badge (Top Right) */}
      {memory.aiData?.emotion && (
        <div className={`absolute top-4 right-4 px-3 py-1 text-xs font-semibold rounded-full border shadow-sm ${emotionClass}`}>
          {memory.aiData.emotion}
        </div>
      )}

      {/* Gradient Accent Bar */}
      <div className={`
        absolute top-0 left-0 right-0 h-1
        bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
        transition-all duration-300
        ${isHovered ? "h-2" : "h-1"}
      `} />

      {/* Hover Glow Effect */}
      <div className={`
        absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5
        opacity-0 group-hover:opacity-100 transition-opacity duration-300
        pointer-events-none rounded-3xl
      `} />

      {/* Content */}
      <div className="relative z-10 flex flex-col flex-1 mt-6">
        {/* Title */}
        <h3 className="font-bold text-white mb-3 text-xl leading-tight pr-2">
          {memory.title || "Untitled Memory"}
        </h3>

        {/* Summary */}
        <p className="text-slate-300 mb-4 text-sm leading-relaxed line-clamp-3 overflow-hidden flex-1">
          {memory.aiData?.summary || "No summary available."}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4 mt-auto">
          {memory.aiData?.tags?.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="
                px-3 py-1.5 rounded-full text-xs font-medium
                bg-slate-700/50 text-indigo-300
                border border-indigo-500/30
                hover:bg-indigo-500/20 hover:border-indigo-400
                transition-all duration-200
              "
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
          <p className="text-slate-400 text-xs">
            {new Date(memory.createdAt || memory.timestamp).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })}
          </p>

          {memory.url && (
            <a
              href={memory.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="
                flex items-center gap-1.5
                text-purple-400 hover:text-purple-300
                text-xs font-medium
                transition-colors duration-200
              "
            >
              <span>Visit</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MemoryCard;