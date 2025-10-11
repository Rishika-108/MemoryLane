// ============================================
// Dashboard.jsx - COMPLETE VERSION WITH SEARCH
// ============================================
import React, { useEffect, useMemo, useState } from "react";
import { useAppContext } from "../AppContext";
import RecentlyViewed from "../components/DashboardComponents/RecentlyViewed";
import ContentAnalytics from "../components/DashboardComponents/ContentAnalytics";
import MoodAnalytics from "../components/DashboardComponents/MoodAnalytics";
import SearchBar from "../components/DashboardComponents/SearchBar";
import MemoryGrid from "../components/DashboardComponents/MemoryGrid";
import { motion } from "framer-motion";
import { FiSearch, FiBarChart2, FiClock } from "react-icons/fi";

const Dashboard = () => {
  const {
    analyticsData,
    recentlyViewed,
    memories,
    computeAnalytics,
    markRecentlyViewed,
    isLoading,
  } = useAppContext();

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    tags: [],
    category: '',
    sentiment: '',
    dateRange: null
  });
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' or 'search'

  // Extract available tags and categories
  const { availableTags, availableCategories } = useMemo(() => {
    const tagSet = new Set();
    const categorySet = new Set();

    memories.forEach(memory => {
      if (memory.aiData?.tags) {
        memory.aiData.tags.forEach(tag => tagSet.add(tag));
      }
      if (memory.aiData?.category) {
        categorySet.add(memory.aiData.category);
      }
    });

    return {
      availableTags: Array.from(tagSet).sort(),
      availableCategories: Array.from(categorySet).sort()
    };
  }, [memories]);

  // Handle search
  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term.trim() || filters.tags.length > 0 || filters.category || filters.sentiment) {
      setActiveTab('search');
    }
  };

  // Handle memory click
  const handleMemoryClick = (memoryId) => {
    markRecentlyViewed(memoryId);
    // Navigate to memory detail
    console.log('Memory clicked:', memoryId);
  };

  // Memoize analytics
  const memoizedAnalytics = useMemo(() => analyticsData || {}, [analyticsData]);

  // Transform recentlyViewed for component
  const recentlyViewedFormatted = useMemo(() => 
    recentlyViewed.map(mem => ({
      id: mem._id || mem.id,
      summary: mem.aiData?.summary || mem.title || 'Untitled',
      tags: mem.aiData?.tags || [],
      ...mem
    })),
    [recentlyViewed]
  );

  // Skeleton loaders
  const AnalyticsSkeleton = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="h-64 bg-black/20 backdrop-blur-xl animate-pulse rounded-2xl border border-gray-700/30"></div>
      <div className="h-64 bg-black/20 backdrop-blur-xl animate-pulse rounded-2xl border border-gray-700/30"></div>
    </div>
  );

  const RecentlyViewedSkeleton = () => (
    <div className="flex flex-wrap gap-6">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div
          key={idx}
          className="w-48 h-40 bg-black/20 backdrop-blur-xl animate-pulse rounded-2xl border border-gray-700/30"
        ></div>
      ))}
    </div>
  );

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-6 py-10 space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Your Memory Dashboard
          </h1>
          <p className="text-gray-300 text-lg">
            Search, explore, and analyze your captured moments
          </p>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="flex justify-center gap-4 mb-8"
        >
          <button
            onClick={() => setActiveTab('overview')}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-xl font-medium
              transition-all duration-300
              ${activeTab === 'overview'
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/50'
                : 'bg-black/30 text-gray-300 hover:bg-black/50'
              }
            `}
          >
            <FiBarChart2 size={20} />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-xl font-medium
              transition-all duration-300
              ${activeTab === 'search'
                ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/50'
                : 'bg-black/30 text-gray-300 hover:bg-black/50'
              }
            `}
          >
            <FiSearch size={20} />
            Search Memories
          </button>
        </motion.div>

        {/* Search Bar - Always visible */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onSearch={handleSearch}
            filters={filters}
            setFilters={setFilters}
            availableTags={availableTags}
            availableCategories={availableCategories}
          />
        </motion.div>

        {/* Conditional Content based on Active Tab */}
        {activeTab === 'overview' ? (
          <>
            {/* Recently Viewed Memories */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <FiClock size={24} className="text-indigo-400" />
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  Recently Viewed
                </h2>
              </div>
              {isLoading ? (
                <RecentlyViewedSkeleton />
              ) : recentlyViewedFormatted?.length > 0 ? (
                <RecentlyViewed
                  memories={recentlyViewedFormatted}
                  onClick={handleMemoryClick}
                  isLoading={false}
                />
              ) : (
                <div className="text-center py-12 bg-black/30 backdrop-blur-xl rounded-2xl border border-gray-700/30">
                  <FiClock size={48} className="text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">
                    You haven't viewed any memories yet.
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    Start exploring to see your recent activity here!
                  </p>
                </div>
              )}
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-6"
            >
              <div className="bg-black/40 backdrop-blur-xl p-6 rounded-2xl border border-gray-700/30 hover:border-indigo-500/50 transition-all duration-300">
                <h3 className="text-gray-400 text-sm mb-2 uppercase tracking-wide">Total Memories</h3>
                <p className="text-4xl font-bold text-white">{memories.length}</p>
                <div className="mt-2 h-1 w-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
              </div>
              
              <div className="bg-black/40 backdrop-blur-xl p-6 rounded-2xl border border-gray-700/30 hover:border-purple-500/50 transition-all duration-300">
                <h3 className="text-gray-400 text-sm mb-2 uppercase tracking-wide">Total Tags</h3>
                <p className="text-4xl font-bold text-white">{availableTags.length}</p>
                <div className="mt-2 h-1 w-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              </div>
              
              <div className="bg-black/40 backdrop-blur-xl p-6 rounded-2xl border border-gray-700/30 hover:border-pink-500/50 transition-all duration-300">
                <h3 className="text-gray-400 text-sm mb-2 uppercase tracking-wide">Categories</h3>
                <p className="text-4xl font-bold text-white">{availableCategories.length}</p>
                <div className="mt-2 h-1 w-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-full"></div>
              </div>
            </motion.div>

            {/* Analytics Section */}
            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <FiBarChart2 size={24} className="text-indigo-400" />
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  Your Analytics
                </h2>
              </div>
              {isLoading ? (
                <AnalyticsSkeleton />
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <ContentAnalytics contentData={memoizedAnalytics} />
                  <MoodAnalytics moodData={memoizedAnalytics.moodBar || {}} />
                </div>
              )}
            </motion.section>
          </>
        ) : (
          /* Search Results View */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <FiSearch size={24} className="text-indigo-400" />
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                {searchTerm ? `Results for "${searchTerm}"` : 'All Memories'}
              </h2>
            </div>
            
            <MemoryGrid
              onClick={handleMemoryClick}
              searchTerm={searchTerm}
              filters={filters}
            />
          </motion.div>
        )}

        {/* Background Effects */}
        <div className="absolute top-10 left-0 w-32 h-32 bg-indigo-500/20 rounded-full filter blur-3xl animate-float-slow -z-10 pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500/20 rounded-full filter blur-3xl animate-float-slower -z-10 pointer-events-none" />

        {/* Floating Nodes */}
        {Array.from({ length: 8 }).map((_, idx) => (
          <div
            key={idx}
            className="absolute w-3 h-3 bg-indigo-400/20 rounded-full animate-float-slower -z-20 pointer-events-none"
            style={{
              top: `${Math.random() * 80}%`,
              left: `${Math.random() * 90}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Add custom animations to your global CSS or Tailwind config */}
      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-slower {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(10px, -10px); }
          50% { transform: translate(-10px, -20px); }
          75% { transform: translate(-20px, 10px); }
        }
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        .animate-float-slower {
          animation: float-slower 10s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;