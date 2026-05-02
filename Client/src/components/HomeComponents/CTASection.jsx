import React from "react";

const CTASection = ({ onStart }) => {
  const enableExtension = () => {
  // replace with your extension ID
  const EXTENSION_ID = "kocmbebpdmdinjbaemilimbeiblhedpg";
  window.open(`chrome-extension://${EXTENSION_ID}/popup.html`, "_blank");
};

  return (
    <section className="relative text-center py-20 px-6 mt-16 rounded-3xl overflow-hidden bg-slate-900/40 backdrop-blur-xl border border-white/10 shadow-2xl">
      {/* Floating Accent Shapes */}
      <div className="absolute top-10 left-0 w-32 h-32 bg-purple-600/20 rounded-full filter blur-3xl animate-float-slow"></div>
      <div className="absolute bottom-8 right-0 w-24 h-24 bg-pink-600/20 rounded-full filter blur-2xl animate-float-slower"></div>
      
      {/* Content */}
      <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
        Capture Today’s <span className="text-purple-400">Memory</span>
      </h2>
      <p className="text-gray-400 mb-10 max-w-xl mx-auto text-lg md:text-xl">
        Reflect on your day, capture your digital interactions automatically, and build your memory lane effortlessly.
      </p>

      {/* CTA Button */}
      <button
        onClick={enableExtension} 
        className="relative px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-semibold shadow-xl transform transition-all hover:scale-105 hover:shadow-purple-500/40"
      >
        Start Capturing
        <span className="absolute top-0 left-0 w-full h-full rounded-2xl opacity-0 hover:opacity-10 bg-white/20 transition-all"></span>
      </button>

      {/* Optional Floating Tech Nodes */}
      {Array.from({ length: 6 }).map((_, idx) => (
        <div
          key={idx}
          className="absolute w-3 h-3 bg-purple-400/20 rounded-full animate-float-slow"
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

export default CTASection;
