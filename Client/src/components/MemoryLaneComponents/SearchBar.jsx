import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";

const SearchBar = ({ searchTerm, setSearchTerm, onSearch }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && onSearch) onSearch(searchTerm);
  };

  return (
    <div className="mb-12 w-full flex justify-center px-4">
      <div
        className={`
          relative w-full max-w-2xl transition-transform duration-500
          ${isFocused ? "scale-105" : "scale-100"}
        `}
      >
        {/* Input */}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Search your memories..."
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          aria-label="Search your memories"
          className={`
            w-full pr-20 pl-6 py-5
            bg-black/10 backdrop-blur-lg
            text-black/90 placeholder-black-400
            rounded-3xl border border-gray-300/40
            focus:outline-none focus:ring-2 focus:ring-indigo-400/60
            shadow-lg hover:shadow-xl
            transition-all duration-300
          `}
        />

        {/* Search Button */}
        <button
          onClick={() => onSearch && onSearch(searchTerm)}
          aria-label="Search memories"
          className={`
            absolute inset-y-0 right-2 flex items-center justify-center
            w-16 h-16 rounded-full
            bg-gradient-to-r from-indigo-500 to-purple-500
            hover:from-indigo-600 hover:to-purple-600
            text-white
            shadow-md hover:shadow-lg
            transition-transform duration-300 transform hover:scale-105
          `}
        >
          <FiSearch size={24} />
        </button>

        {/* Focus Glow */}
        {isFocused && (
          <span className="absolute inset-0 rounded-3xl ring-1 ring-indigo-400/40 animate-pulse pointer-events-none"></span>
        )}

        {/* Animated Bottom Highlight */}
        <span
          className={`
            absolute bottom-0 left-0 w-full h-1
            bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
            rounded-full
            ${isFocused ? "opacity-100 animate-pulse" : "opacity-0"}
            transition-opacity duration-300
          `}
        ></span>

        {/* Floating Shadow Overlay for depth */}
        <span className="absolute inset-0 rounded-3xl shadow-[0_0_30px_rgba(0,0,0,0.2)] pointer-events-none"></span>
      </div>
    </div>
  );
};

export default SearchBar;
