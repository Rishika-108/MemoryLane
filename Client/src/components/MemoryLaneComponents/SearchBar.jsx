import React from "react";

const SearchBar = ({ searchTerm, setSearchTerm }) => (
  <div className="mb-6">
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search memories..."
      className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
    />
  </div>
);

export default SearchBar;
