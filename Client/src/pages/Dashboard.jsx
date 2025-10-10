import React, { useEffect } from "react";
import { useAppContext } from "../AppContext";
import RecentlyViewed from "../components/DashboardComponents/RecentlyViewed";
import ContentAnalytics from "../components/DashboardComponents/ContentAnalytics";
import MoodAnalytics from "../components/DashboardComponents/MoodAnalytics";

const Dashboard = () => {
  const { 
    analyticsData, 
    recentlyViewed, 
    memories, 
    computeAnalytics, 
    markRecentlyViewed, 
    isLoading 
  } = useAppContext();

  useEffect(() => {
    computeAnalytics(); // recompute analytics when memories change
  }, [memories]);

  if (isLoading) {
    return (
      <p className="text-center mt-20 text-gray-300 text-xl">Loading...</p>
    );
  }

  return (
    <div className="container mx-auto px-6 py-10 space-y-12">

      {/* Recently Viewed Memories */}
      <RecentlyViewed recentlyViewed={recentlyViewed} />
      

      {/* Analytics Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ContentAnalytics contentData={analyticsData} />
        <MoodAnalytics moodData={analyticsData.moodBar || {}} />
      </section>
    </div>
  );
};

export default Dashboard;
