import React, { useEffect, useMemo } from "react";
import { useAppContext } from "../AppContext";
import RecentlyViewed from "../components/DashboardComponents/RecentlyViewed";
import ContentAnalytics from "../components/DashboardComponents/ContentAnalytics";
import MoodAnalytics from "../components/DashboardComponents/MoodAnalytics";
import { motion } from "framer-motion";

const Dashboard = () => {
  const { 
    analyticsData, 
    recentlyViewed, 
    memories, 
    computeAnalytics, 
    markRecentlyViewed, 
    isLoading 
  } = useAppContext();

  // Recompute analytics whenever memories change
  // useEffect(() => {
  //   computeAnalytics();
  // }, [memories, computeAnalytics]);

  // Memoize analytics to avoid unnecessary re-renders
  const memoizedAnalytics = useMemo(() => analyticsData || {}, [analyticsData]);

  // Skeleton loader for analytics
  const AnalyticsSkeleton = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="h-64 bg-gray-200/20 animate-pulse rounded-2xl"></div>
      <div className="h-64 bg-gray-200/20 animate-pulse rounded-2xl"></div>
    </div>
  );

  // Skeleton loader for recently viewed
  const RecentlyViewedSkeleton = () => (
    <div className="flex flex-wrap gap-6">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div key={idx} className="w-48 h-40 bg-gray-200/20 animate-pulse rounded-2xl"></div>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto px-6 py-10 space-y-12 min-h-screen">

      {/* Recently Viewed Memories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          Recently Viewed
        </h2>
        {isLoading ? (
          <RecentlyViewedSkeleton />
        ) : recentlyViewed?.length > 0 ? (
          <RecentlyViewed recentlyViewed={recentlyViewed} onClick={markRecentlyViewed} />
        ) : (
          <p className="text-gray-500 text-lg">
            You haven’t viewed any memories yet. Start capturing to see them here!
          </p>
        )}
      </motion.div>

      <RecentlyViewed recentlyViewed={recentlyViewed} />
      

      {/* Analytics Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
          Your Analytics
        </h2>
        {isLoading ? (
          <AnalyticsSkeleton />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ContentAnalytics contentData={memoizedAnalytics} />
            <MoodAnalytics moodData={memoizedAnalytics.moodBar || {}} />
          </div>
        )}
      </motion.section>
    </div>
  );
};

export default Dashboard;
