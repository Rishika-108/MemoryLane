import React, { useState } from "react";
import { FiSearch, FiZap, FiTarget, FiSmile } from "react-icons/fi";

const SearchBar = ({ searchTerm, setSearchTerm, onSearch, searchMode, setSearchMode }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && onSearch) onSearch();
  };

  const getPlaceholder = () => {
    if (searchMode === "semantic") return "Describe concepts, ideas, or meanings...";
    if (searchMode === "emotion") return "Enter a valid emotion (e.g. happy, sad, angry)...";
    return "Search exact memory keywords...";
  };

  const modes = [
    { id: "keyword", icon: <FiTarget className="w-4 h-4" />, label: "Keyword" },
    { id: "semantic", icon: <FiZap className="w-4 h-4" />, label: "Semantic/AI" },
    { id: "emotion", icon: <FiSmile className="w-4 h-4" />, label: "Emotion" }
  ];

  return (
    <div className="mb-12 w-full flex flex-col items-center px-4">
      {/* Input Field Container */}
      <div className={`relative w-full max-w-2xl transition-transform duration-500 ${isFocused ? "scale-105" : "scale-100"}`}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={getPlaceholder()}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="
            w-full pr-20 pl-6 py-5
            bg-slate-800/80 backdrop-blur-lg
            text-white/90 placeholder-slate-400
            rounded-3xl border border-slate-600/50
            focus:outline-none focus:ring-2 focus:ring-purple-500/60
            shadow-lg hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]
            transition-all duration-300
          "
        />

        <button
          onClick={() => onSearch && onSearch()}
          className="
            absolute inset-y-2 right-2 flex items-center justify-center
            w-14 rounded-2xl
            bg-gradient-to-r from-purple-500 to-pink-500
            hover:from-purple-600 hover:to-pink-600
            text-white shadow-md hover:shadow-lg
            transition-all duration-300 hover:scale-105
          "
        >
          <FiSearch size={22} />
        </button>

        {isFocused && (
          <span className="absolute inset-0 rounded-3xl ring-1 ring-purple-500/40 animate-pulse pointer-events-none"></span>
        )}
      </div>

      {/* Mode Toggles */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
        {modes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => setSearchMode && setSearchMode(mode.id)}
            className={`
              flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border
              ${searchMode === mode.id 
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.3)]' 
                : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-slate-200'}
            `}
          >
            {mode.icon}
            {mode.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
