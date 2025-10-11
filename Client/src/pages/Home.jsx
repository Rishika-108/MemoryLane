import React from "react";
import HeroSection from "../components/HomeComponents/Hero";
import FeatureHighlights from "../components/HomeComponents/FeatureHighlights";
import RecentMemories from "../components/HomeComponents/RecentMemories";
import CTASection from "../components/HomeComponents/CTASection";
import { useAppContext } from "../AppContext";

const Home = () => {
  const { user, recentlyViewed, isLoading } = useAppContext();

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection openLoginModal={() => setShowLoginModal(true)} />
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
