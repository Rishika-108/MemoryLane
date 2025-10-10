import React from "react";
import { FiExternalLink } from "react-icons/fi";
import { motion } from "framer-motion";

const MemoryCard = ({ memory, onClick }) => (
  <motion.div
    onClick={onClick}
    whileHover={{ scale: 1.06 }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: "spring", stiffness: 250, damping: 20 }}
    className="
      relative
      bg-black/70 backdrop-blur-3xl
      p-6 rounded-3xl
      shadow-2xl hover:shadow-3xl
      cursor-pointer
      flex flex-col justify-between
      border border-transparent hover:border-gradient-to-r hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500
      transition-all duration-300
      overflow-hidden
    "
  >
    {/* Neon Glow Overlay */}
    <span className="absolute inset-0 rounded-3xl shadow-[0_0_30px_rgba(99,102,241,0.3)] pointer-events-none"></span>

    {/* Memory Summary */}
    <p className="font-bold text-white mb-4 text-lg md:text-xl leading-snug tracking-wide">
      {memory.summary}
    </p>

    {/* Tags */}
    <div className="flex flex-wrap gap-2 mb-4 z-10 relative">
      {memory.tags.map((tag) => (
        <span
          key={tag}
          className="
            bg-indigo-600/20 text-indigo-300
            px-3 py-1 rounded-full text-xs md:text-sm
            font-medium
            hover:bg-indigo-500/30
            transition-all duration-300
          "
        >
          {tag}
        </span>
      ))}
    </div>

    {/* External Link */}
    {memory.url && (
      <a
        href={memory.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="
          flex items-center gap-1
          text-indigo-400 hover:text-indigo-200 hover:underline
          text-sm md:text-base
          font-medium
          transition-all duration-300
          z-10 relative
        "
      >
        Visit Link <FiExternalLink size={16} />
      </a>
    )}

    {/* Timestamp */}
    <p className="text-gray-400 text-xs md:text-sm mt-4 text-right z-10 relative">
      {new Date(memory.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
    </p>
  </motion.div>
);

export default MemoryCard;
