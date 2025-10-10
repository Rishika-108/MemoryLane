import React, { useState } from "react";
import { useAppContext } from "../AppContext";
import SearchBar from "../components/MemoryLaneComponents/SearchBar";
import MemoryGrid from "../components/MemoryLaneComponents/MemoryGrid";
import RecentlyViewed from "../components/MemoryLaneComponents/RecentlyViewed";

const MemoryLane = () => {
  const { memories, recentlyViewed, markRecentlyViewed, isLoading } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMemories = memories.filter(
    (m) =>
      m.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-6">MemoryLane</h1>

      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {recentlyViewed.length > 0 && (
        <RecentlyViewed memories={recentlyViewed} onClick={markRecentlyViewed} />
      )}

      {isLoading ? (
        <p className="text-center mt-6">Loading memories...</p>
      ) : (
        <MemoryGrid memories={filteredMemories} onClick={markRecentlyViewed} />
      )}
    </div>
  );
};

export default MemoryLane;
