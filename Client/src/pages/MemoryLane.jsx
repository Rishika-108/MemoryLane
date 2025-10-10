import React, { useState, useEffect, useCallback } from "react";
import { useAppContext } from "../AppContext";
import SearchBar from "../components/MemoryLaneComponents/SearchBar";
import MemoryGrid from "../components/MemoryLaneComponents/MemoryGrid";
import RecentlyViewed from "../components/MemoryLaneComponents/RecentlyViewed";
import { motion, AnimatePresence } from "framer-motion";
import debounce from "lodash.debounce";

// Error Boundary for MemoryLane
class MemoryLaneErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("MemoryLane Error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-10 text-center text-red-500">
          <h2>Something went wrong in MemoryLane.</h2>
          <p>{this.state.error?.message || "Try refreshing the page."}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const MemoryLane = () => {
  const { recentlyViewed, markRecentlyViewed } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Vite environment variable
  const API_URL = import.meta.env.VITE_API_URL || "/api";

  const fetchSearchResults = async (keyword) => {
    if (!keyword || keyword.trim() === "") return setSearchResults([]);
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/content/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword }),
      });

      if (!res.ok) throw new Error(`Server responded with ${res.status}`);

      const data = await res.json();
      setSearchResults(data.data || []);
    } catch (err) {
      console.error("Search error:", err);
      setError(err.message || "Something went wrong while searching.");
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedSearch = useCallback(debounce(fetchSearchResults, 300), []);

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => debouncedSearch.cancel();
  }, [searchTerm, debouncedSearch]);

  return (
    <MemoryLaneErrorBoundary>
  <div
    className="relative min-h-screen flex flex-col px-6 py-10 bg-white/10 backdrop-blur-sm"
    style={{
      background: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
    }}
  >
    {/* Search Bar */}
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.5 }}
    >
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearch={fetchSearchResults}
      />
    </motion.div>

    {/* Recently Viewed / Empty State */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      {searchTerm.trim() === "" &&
        (recentlyViewed?.length > 0 ? (
          <RecentlyViewed
            memories={recentlyViewed}
            onClick={markRecentlyViewed}
          />
        ) : (
          <p className="text-center mt-8 text-gray-400 text-lg">
            No recent activity yet. Start creating memories to see them here!
          </p>
        ))}
    </motion.div>

    {/* Search Results / Skeleton / Empty */}
    <div className="flex-1 mt-6 relative">
      <AnimatePresence>
        {isLoading ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6"
          >
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="h-48 bg-white/20 backdrop-blur-md rounded-3xl animate-pulse shadow-md"
              />
            ))}
          </motion.div>
        ) : error ? (
          <motion.p
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center mt-10 text-red-500 text-lg"
          >
            {error}
          </motion.p>
        ) : searchResults?.length > 0 ? (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <MemoryGrid
              memories={searchResults}
              onClick={markRecentlyViewed}
            />
          </motion.div>
        ) : searchTerm.trim() !== "" ? (
          <motion.p
            key="no-results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center mt-10 text-gray-500 text-lg"
          >
            No memories found for{" "}
            <span className="text-indigo-500">"{searchTerm}"</span>
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>

    {/* Background Floating Nodes */}
    {Array.from({ length: 10 }).map((_, idx) => (
      <div
        key={idx}
        className="absolute w-4 h-4 bg-indigo-400/30 rounded-full animate-float-slower -z-20"
        style={{
          top: `${Math.random() * 80}%`,
          left: `${Math.random() * 90}%`,
          animationDelay: `${Math.random() * 3}s`,
        }}
      />
    ))}

    {/* Optional subtle purple tints for visual depth */}
    <div className="absolute top-20 left-10 w-32 h-32 bg-indigo-200/40 rounded-full filter blur-3xl animate-float-slow -z-10" />
    <div className="absolute bottom-10 right-20 w-40 h-40 bg-purple-300/30 rounded-full filter blur-4xl animate-float-slower -z-10" />
  </div>
</MemoryLaneErrorBoundary>

  );
};

export default MemoryLane;
