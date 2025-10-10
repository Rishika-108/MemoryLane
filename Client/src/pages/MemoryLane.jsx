import React, { useState } from "react";
import { useAppContext } from "../AppContext";
import SearchBar from "../components/MemoryLaneComponents/SearchBar";
import MemoryGrid from "../components/MemoryLaneComponents/MemoryGrid";
import RecentlyViewed from "../components/MemoryLaneComponents/RecentlyViewed";
import { motion } from "framer-motion";

const MemoryLane = () => {
  const { memories, recentlyViewed, markRecentlyViewed, isLoading } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");

  // Safe filtering
  const filteredMemories = memories
    ?.filter(Boolean)
    .filter((m) => {
      const summaryMatch = m.summary?.toLowerCase().includes(searchTerm.toLowerCase());
      const tagsMatch = Array.isArray(m.tags)
        ? m.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        : false;
      return summaryMatch || tagsMatch;
    });

  return (
    <div
      className="min-h-screen px-6 py-10"
      style={{
        background: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
      }}
    >
      {/* Page Title */}
      {/* <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl sm:text-5xl font-bold mb-8 text-gray-800 tracking-wide text-center"
      >
        MemoryLane
      </motion.h1> */}

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </motion.div>

      {/* Recently Viewed */}
      {recentlyViewed?.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <RecentlyViewed memories={recentlyViewed} onClick={markRecentlyViewed} />
        </motion.div>
      )}

      {/* Memory Grid / Skeleton / Empty State */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className="h-48 bg-white/20 backdrop-blur-md rounded-3xl animate-pulse shadow-md"
            />
          ))}
        </div>
      ) : filteredMemories?.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-6"
        >
          <MemoryGrid memories={filteredMemories} onClick={markRecentlyViewed} />
        </motion.div>
      ) : (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-center mt-10 text-gray-500 text-lg"
        >
          No memories found matching{" "}
          <span className="text-indigo-500">"{searchTerm}"</span>
        </motion.p>
      )}
    </div>
  );
};

export default MemoryLane;
