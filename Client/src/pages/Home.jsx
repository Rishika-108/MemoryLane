import React from "react";
import HeroSection from "../Components/HomeComponents/Hero";
import FeatureHighlights from "../Components/HomeComponents/FeatureHighlights";
import RecentMemories from "../Components/HomeComponents/RecentMemories";
import CTASection from "../Components/HomeComponents/CTASection";
import { useAppContext } from "../AppContext";

const Home = () => {
  const { user, recentlyViewed, isLoading } = useAppContext();

  return (
    <div className="min-h-screen text-white bg-transparent">
      <HeroSection />
      <FeatureHighlights />

      {user?.isLoggedIn && (
        <RecentMemories
          memories={recentlyViewed}
          loading={isLoading}
        />
      )}

      <CTASection />
    </div>
  );
};

export default Home;
