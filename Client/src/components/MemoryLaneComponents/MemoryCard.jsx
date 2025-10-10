import React from "react";
import { FiExternalLink } from "react-icons/fi";

const MemoryCard = ({ memory, onClick }) => (
  <div
    onClick={onClick}
    className="
      bg-white/10 backdrop-blur-xl
      p-6 rounded-3xl
      shadow-lg hover:shadow-2xl
      transform hover:scale-[1.04]
      transition-all duration-300 ease-in-out
      cursor-pointer
      flex flex-col justify-between
      border border-white/20
      hover:border-indigo-400/30
    "
  >
    {/* Memory Summary */}
    <p className="font-bold text-white mb-4 text-lg md:text-xl leading-snug">
      {memory.summary}
    </p>

    {/* Tags */}
    <div className="flex flex-wrap gap-2 mb-4">
      {memory.tags.map((tag) => (
        <span
          key={tag}
          className="
            bg-indigo-200/20 text-indigo-300
            px-3 py-1 rounded-full text-xs md:text-sm
            font-medium
            hover:bg-indigo-300/30
            transition
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
        className="
          flex items-center gap-1
          text-indigo-400 hover:text-indigo-200 hover:underline
          text-sm md:text-base
          transition
        "
        onClick={(e) => e.stopPropagation()}
      >
        Visit Link <FiExternalLink size={16} />
      </a>
    )}

    {/* Timestamp */}
    <p className="text-gray-400 text-xs md:text-sm mt-4 text-right">
      {new Date(memory.createdAt).toLocaleString()}
    </p>
  </div>
);

export default MemoryCard;
