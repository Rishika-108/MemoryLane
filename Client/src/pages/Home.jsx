import React from "react";
import HeroSection from "../Components/HomeComponents/Hero";
import FeatureHighlights from "../Components/HomeComponents/FeatureHighlights";
import RecentMemories from "../Components/HomeComponents/RecentMemories";
import CTASection from "../Components/HomeComponents/CTASection";
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
