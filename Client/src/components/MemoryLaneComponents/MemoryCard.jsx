import React, { useState } from "react";
import { motion } from "framer-motion";

const MemoryCard = ({ memory, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

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
        bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl
        p-6 rounded-3xl
        shadow-[0_8px_30px_rgba(0,0,0,0.12)]
        hover:shadow-[0_20px_60px_rgba(99,102,241,0.25)]
        cursor-pointer
        border border-gray-200/50
        overflow-hidden
        transition-all duration-300
      "
    >
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
      <div className="relative z-10">
        {/* Title */}
        <h3 className="font-bold text-gray-900 mb-3 text-xl leading-tight">
          {memory.title || "Untitled Memory"}
        </h3>

        {/* Summary */}
        <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-3">
          {memory.aiData?.summary || "No summary available."}
        </p>

        {/* Category Badge */}
        {memory.aiData?.category && (
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-semibold
              bg-gradient-to-r from-indigo-500 to-purple-500 text-white
              shadow-md">
              {memory.aiData.category}
            </span>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {memory.aiData?.tags?.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="
                px-3 py-1.5 rounded-full text-xs font-medium
                bg-indigo-50 text-indigo-700
                border border-indigo-200
                hover:bg-indigo-100 hover:border-indigo-300
                transition-all duration-200
              "
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200/50">
          {/* Timestamp */}
          <p className="text-gray-500 text-xs">
            {new Date(memory.createdAt).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              year: 'numeric'
            })}
          </p>

          {/* Link Icon */}
          {memory.url && (
            <a
              href={memory.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="
                flex items-center gap-1.5
                text-indigo-600 hover:text-indigo-700
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

      {/* Corner Decoration */}
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-purple-500/5 to-transparent rounded-tl-full pointer-events-none" />

      {/* Add line-clamp styles */}
      <style jsx>{`
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </motion.div>
  );
};

export default MemoryCard;