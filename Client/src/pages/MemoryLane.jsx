import React, { useState, useEffect, useMemo } from "react";
import { useAppContext } from "../AppContext";
import SearchBar from "../components/MemoryLaneComponents/SearchBar";
import MemoryGrid from "../Components/MemoryLaneComponents/MemoryGrid";
import RecentlyViewed from "../components/MemoryLaneComponents/RecentlyViewed";
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

  // Frontend-only search: filter allMemories based on searchTerm
  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const lowerTerm = searchTerm.toLowerCase();
    return allMemories.filter(
      (m) =>
        m.title?.toLowerCase().includes(lowerTerm) ||
        m.aiData?.summary?.toLowerCase().includes(lowerTerm) ||
        m.aiData?.tags?.some((tag) => tag.toLowerCase().includes(lowerTerm)) ||
        m.aiData?.keywords?.some((kw) => kw.toLowerCase().includes(lowerTerm))
    );
  }, [searchTerm, allMemories]);

  return (
    <MemoryLaneErrorBoundary>
      <div 
        className="relative min-h-screen flex flex-col px-6 py-10 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
        }}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Gradient Orbs */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 left-10 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-pink-600/15 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.25, 0.45, 0.25],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl"
          />

          {/* Floating Particles */}
          {Array.from({ length: 15 }).map((_, idx) => (
            <motion.div
              key={idx}
              animate={{
                y: [0, -30, 0],
                x: [0, Math.random() * 20 - 10, 0],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 4 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut",
              }}
              className="absolute w-2 h-2 bg-purple-400/40 rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
            />
          ))}

          {/* Grid Pattern Overlay */}
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `linear-gradient(rgba(168, 85, 247, 0.3) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(168, 85, 247, 0.3) 1px, transparent 1px)`,
              backgroundSize: '50px 50px'
            }}
          />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-[1600px] mx-auto w-full">
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
              setSearchTerm={setSearchTerm}
              onSearch={() => {}}
            />
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
                    <MemoryGrid memories={searchResults} onClick={markRecentlyViewed} />
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
                      No memories found for <span className="text-purple-400 font-semibold">"{searchTerm}"</span>
                    </p>
                    <p className="text-gray-500 text-sm mt-2">Try different keywords or check your spelling</p>
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
                  <MemoryGrid memories={allMemories} onClick={markRecentlyViewed} />
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