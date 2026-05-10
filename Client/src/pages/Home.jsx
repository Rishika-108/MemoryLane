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

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-6 bg-slate-900/50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            How to Start Capturing
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
              <div className="text-3xl mb-4">🧩</div>
              <h3 className="text-xl font-bold mb-2">Pin Extension</h3>
              <p className="text-gray-400 text-sm">Install the MemoryLane extension and pin it to your browser toolbar for easy access.</p>
            </div>
            <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
              <div className="text-3xl mb-4">🔐</div>
              <h3 className="text-xl font-bold mb-2">Log In Once</h3>
              <p className="text-gray-400 text-sm">Log in to this website. The extension will automatically detect your session and sync.</p>
            </div>
            <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
              <div className="text-3xl mb-4">🧠</div>
              <h3 className="text-xl font-bold mb-2">Surf Naturally</h3>
              <p className="text-gray-400 text-sm">The AI will automatically save meaningful articles and pages as you read them.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
