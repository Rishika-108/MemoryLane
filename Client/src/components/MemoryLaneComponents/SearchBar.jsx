import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";

const SearchBar = ({ searchTerm, setSearchTerm, onSearch }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && onSearch) onSearch(searchTerm);
  };

  return (
    <div className="mb-10 w-full flex justify-center">
      <div
        className={`
          relative w-full max-w-xl
          transition-transform duration-500
          ${isFocused ? "scale-105" : "scale-100"}
        `}
      >
        {/* Input */}
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Search your memories..."
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full pr-16 pl-5 py-4
            bg-gray-900/70 backdrop-blur-2xl
            text-gray-100 placeholder-gray-400
            rounded-2xl border border-gray-700
            focus:outline-none focus:ring-4 focus:ring-indigo-500/40
            focus:border-indigo-500
            shadow-lg hover:shadow-2xl
            transition-all duration-300
          `}
        />

        {/* Search Button */}
        <button
          onClick={() => onSearch && onSearch(searchTerm)}
          className={`
            absolute inset-y-0 right-1 flex items-center justify-center
            w-14 h-14 rounded-full
            bg-gradient-to-r from-indigo-600 to-purple-600
            hover:from-purple-600 hover:to-indigo-600
            text-white
            shadow-xl hover:shadow-2xl
            transition-transform duration-300 transform hover:scale-110
          `}
          aria-label="Search memories"
        >
          <FiSearch size={22} />
        </button>

        {/* Optional Focus Glow */}
        {isFocused && (
          <span className="absolute inset-0 rounded-2xl ring-2 ring-indigo-500/30 animate-pulse pointer-events-none"></span>
        )}

        {/* Animated Border Highlight */}
        <span
          className={`
            absolute bottom-0 left-0 w-full h-1
            bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
            rounded-full
            ${isFocused ? "opacity-100 animate-pulse" : "opacity-0"}
            transition-opacity duration-300
          `}
        ></span>
      </div>
    </div>
  );
};

export default SearchBar;
