import React, { useState, useEffect } from "react";
import { useAppContext } from "../AppContext";
import SearchBar from "../components/MemoryLaneComponents/SearchBar";
import MemoryGrid from "../components/MemoryLaneComponents/MemoryGrid";
import RecentlyViewed from "../components/MemoryLaneComponents/RecentlyViewed";
import Timeline from "../components/MemoryLaneComponents/Timeline";
import { motion, AnimatePresence } from "framer-motion";

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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <div className="text-center p-10 bg-red-500/10 border border-red-500/30 rounded-3xl backdrop-blur-xl max-w-md">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20 mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-red-400 mb-2">Something went wrong</h2>
            <p className="text-gray-400">{this.state.error?.message || "Try refreshing the page."}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const MemoryLane = () => {
  const { recentlyViewed, markRecentlyViewed } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [allMemories, setAllMemories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch memories from backend once
  useEffect(() => {
    const fetchMemories = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/content/getContent", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error(`Server responded with ${res.status}`);
        const data = await res.json();
        setAllMemories(data.data || []);
      } catch (err) {
        console.error("Error fetching memories:", err);
        setError(err.message || "Failed to load memories.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMemories();
  }, []);

  const [searchMode, setSearchMode] = useState("keyword");
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Search execution hitting the backend matching logical modes (Semantic vs DB Matches)
  const executeSearch = async () => {
    if (!searchTerm.trim()) {
      setHasSearched(false);
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    setHasSearched(true);
    
    try {
      const token = localStorage.getItem("token");
      const payload = {};
      
      if (searchMode === "keyword") payload.keyword = searchTerm;
      else if (searchMode === "emotion") payload.mood = searchTerm;
      else if (searchMode === "semantic") payload.semanticQuery = searchTerm;

      const res = await fetch("http://localhost:5000/api/content/search", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Search configuration failed.");
      
      const data = await res.json();
      setSearchResults(data.data || []);
    } catch (err) {
      console.error("Search failed:", err);
      setError("Failed to execute search query.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MemoryLaneErrorBoundary>
      <div className="relative min-h-screen flex flex-col px-6 py-10 overflow-hidden text-white w-full max-w-[1600px] mx-auto">
        {/* Content Container */}
        <div className="relative z-10 w-full">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Memory Vault
            </h1>
            <p className="text-gray-400 text-lg">Your personal knowledge repository</p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={(val) => {
                setSearchTerm(val);
                if (!val) setHasSearched(false); // Reset on empty clear
              }}
              onSearch={executeSearch}
              searchMode={searchMode}
              setSearchMode={setSearchMode}
            />
          </motion.div>
          
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
             {!hasSearched && allMemories.length > 0 && <Timeline memories={allMemories} />}
          </motion.div>

          {/* Recently Viewed Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {!searchTerm.trim() && recentlyViewed?.length > 0 && (
              <RecentlyViewed
                memories={recentlyViewed}
                onClick={markRecentlyViewed}
                isLoading={false}
              />
            )}
          </motion.div>

          {/* Main Content Area */}
          <div className="flex-1 mt-6">
            <AnimatePresence mode="wait">
              {isLoading ? (
                // Loading Skeleton
                <motion.div
                  key="skeleton"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                >
                  {Array.from({ length: 8 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="h-[380px] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-3xl animate-pulse shadow-md border border-purple-500/20 relative overflow-hidden"
                    >
                      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-purple-500/10 to-transparent" />
                    </div>
                  ))}
                </motion.div>
              ) : error ? (
                // Error State
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center py-20"
                >
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 border border-red-500/30 mb-6">
                    <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-red-400 mb-2">Failed to Load</h3>
                  <p className="text-gray-400 mb-6">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg shadow-purple-500/50"
                  >
                    Try Again
                  </button>
                </motion.div>
              ) : searchTerm.trim() ? (
                // Search Results
                searchResults.length > 0 ? (
                  <motion.div
                    key="search-results"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <p className="text-gray-400">
                        Found <span className="text-purple-400 font-semibold">{searchResults.length}</span> {searchResults.length === 1 ? 'result' : 'results'}
                      </p>
                    </div>
                    <MemoryGrid memories={searchResults} onClick={markRecentlyViewed} isLoading={isLoading} error={error}/>
                  </motion.div>
                ) : (
                  <motion.div
                    key="no-results"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center py-20"
                  >
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-500/10 border border-purple-500/30 mb-6">
                      <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-semibold text-white mb-2">No Results Found</h3>
                    <p className="text-gray-400">
                      No memories found for <span className="text-purple-400 font-semibold">"{searchTerm}"</span> in <span className="text-pink-400 font-semibold">{searchMode}</span> mode.
                    </p>
                    <p className="text-gray-500 text-sm mt-2">Try different search terms or toggle semantic search</p>
                  </motion.div>
                )
              ) : allMemories.length > 0 ? (
                // All Memories Grid
                <motion.div
                  key="all-memories"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="mb-4">
                    <p className="text-gray-400">
                      Showing <span className="text-purple-400 font-semibold">{allMemories.length}</span> {allMemories.length === 1 ? 'memory' : 'memories'}
                    </p>
                  </div>
                  <MemoryGrid memories={allMemories} onClick={markRecentlyViewed} isLoading={isLoading} error={error} />
                </motion.div>
              ) : (
                // Empty State
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center py-20"
                >
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 mb-6">
                    <svg className="w-12 h-12 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-2">No Memories Yet</h3>
                  <p className="text-gray-400 mb-6">Start creating memories to see them here</p>
                  <button className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg shadow-purple-500/50">
                    Create Your First Memory
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Shimmer Animation Keyframes */}
        <style jsx>{`
          @keyframes shimmer {
            100% {
              transform: translateX(100%);
            }
          }
        `}</style>
      </div>
    </MemoryLaneErrorBoundary>
  );
};

export default MemoryLane;