import React, { useState, useEffect, useCallback } from "react";
import { useAppContext } from "../AppContext";
import SearchBar from "../components/MemoryLaneComponents/SearchBar";
import MemoryGrid from "../components/MemoryLaneComponents/MemoryGrid";
import RecentlyViewed from "../components/MemoryLaneComponents/RecentlyViewed";
import { motion } from "framer-motion";
import debounce from "lodash.debounce";

const MemoryLane = () => {
  const { recentlyViewed, markRecentlyViewed } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch search results from backend
  const fetchSearchResults = async (keyword) => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/content/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword }),
      });
      const data = await res.json();
      setSearchResults(data.data || []);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search for better UX
  const debouncedSearch = useCallback(debounce(fetchSearchResults, 300), []);

  // Trigger search whenever searchTerm changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      return;
    }
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  return (
    <div
      className="min-h-screen flex flex-col px-6 py-10"
      style={{ background: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)" }}
    >
      {/* Search Bar */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }}>
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} onSearch={fetchSearchResults} />
      </motion.div>

      {/* Recently Viewed Section */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.6 }}>
        {searchTerm.trim() === "" ? (
          recentlyViewed?.length > 0 ? (
            <RecentlyViewed memories={recentlyViewed} onClick={markRecentlyViewed} />
          ) : (
            <p className="text-center mt-8 text-gray-400 text-lg">
              No recent activity yet. Start creating memories to see them here!
            </p>
          )
        ) : null}
      </motion.div>

      {/* Memory Grid / Skeleton / Empty State */}
      <div className="flex-1 mt-6">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="h-48 bg-white/20 backdrop-blur-md rounded-3xl animate-pulse shadow-md" />
            ))}
          </div>
        ) : searchResults?.length > 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.6 }}>
            <MemoryGrid memories={searchResults} onClick={markRecentlyViewed} />
          </motion.div>
        ) : searchTerm.trim() !== "" ? (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.6 }} className="text-center mt-10 text-gray-500 text-lg">
            No memories found for <span className="text-indigo-500">"{searchTerm}"</span>
          </motion.p>
        ) : null}
      </div>
    </div>
  );
};

export default MemoryLane;
