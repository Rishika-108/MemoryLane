import React from "react";
import Lottie from "lottie-react";
import memoryFlowAnimation from "../../assets/memoryFlow.json"; // Lottie JSON animation
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../AppContext";

const HeroSection = () => {
  const navigate = useNavigate();
  const { user, setShowLoginModal } = useAppContext(); // assuming you can toggle login modal from context

  // open extension
  const enableExtension = () => {
  // replace with your extension ID
  const EXTENSION_ID = "kocmbebpdmdinjbaemilimbeiblhedpg";
  window.open(`chrome-extension://${EXTENSION_ID}/popup.html`, "_blank");
};

  const goToPage = () => {
    if (user?.isLoggedIn) {
      navigate("/memorylane");
    } else {
      openLoginModal(); // call the function from Header
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50 to-white py-28 px-6">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-12 relative z-20">
        {/* Left Content */}
        <div className="max-w-xl space-y-6 z-20 relative">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
            Capture Your Digital Trail.{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
              Summarize Smarter.
            </span>{" "}
            Relive Effortlessly.
          </h1>
          <p className="text-gray-600 text-lg md:text-xl">
            WhisperRecall automatically logs your digital interactions and turns
            them into visual memory snapshots — all in the background,
            seamlessly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <button onClick={enableExtension} className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transform transition-all duration-300">
              Start Capturing Memories
            </button>
            <button
              type="button"
              onClick={goToPage}
              className="border border-indigo-500 text-indigo-600 px-6 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition transform hover:scale-105"
            >
              Explore Timeline
            </button>
          </div>
        </div>

        {/* Right Illustration */}
        <div className="relative w-full max-w-lg md:max-w-xl">
          <div className="bg-white/20 backdrop-blur-xl rounded-3xl p-6 shadow-2xl overflow-hidden relative z-10">
            {/* Animated Lottie */}
            <Lottie animationData={memoryFlowAnimation} loop={true} />
            <div className="absolute -bottom-4 -right-4 bg-indigo-100 px-4 py-1 rounded-full text-sm font-medium text-indigo-700 shadow-md">
              ✨ Automated Memory Capture
            </div>
          </div>
        </div>
      </div>

      {/* Background Floating Nodes */}
      {Array.from({ length: 10 }).map((_, idx) => (
        <div
          key={idx}
          className="absolute w-4 h-4 bg-indigo-400/30 rounded-full animate-float-slower"
          style={{
            top: `${Math.random() * 80}%`,
            left: `${Math.random() * 90}%`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        />
      ))}
    </section>
  );
};

export default HeroSection;
