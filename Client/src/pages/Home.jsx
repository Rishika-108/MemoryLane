import React from "react";
import HeroSection from "../components/HomeComponents/Hero";
import FeatureHighlights from "../components/HomeComponents/FeatureHighlights";
import RecentMemories from "../components/HomeComponents/RecentMemories";
import CTASection from "../components/HomeComponents/CTASection";
import { useAppContext } from "../AppContext";

const Home = () => {
  const { user, recentlyViewed, memories, isLoading } = useAppContext();

  return (
    <div className="min-h-screen text-white bg-transparent">
      <HeroSection />
      <FeatureHighlights />

      {user?.isLoggedIn && memories.length > 0 && (
        <RecentMemories
          memories={memories.slice(0, 3)}
          loading={isLoading}
        />
      )}

      <CTASection />
    </div>
  );
};

export default Home;
