import React from "react";

const CTASection = ({ onStart }) => {
  return (
    <section className="relative text-center py-20 px-6 mt-16 rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-100 shadow-lg">
      {/* Floating Accent Shapes */}
      <div className="absolute top-10 left-0 w-32 h-32 bg-indigo-200/40 rounded-full filter blur-3xl animate-float-slow"></div>
      <div className="absolute bottom-8 right-0 w-24 h-24 bg-purple-200/30 rounded-full filter blur-2xl animate-float-slower"></div>
      
      {/* Content */}
      <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
        Capture Today’s <span className="text-indigo-600">Memory</span>
      </h2>
      <p className="text-gray-600 mb-10 max-w-xl mx-auto text-lg md:text-xl">
        Reflect on your day, capture your digital interactions automatically, and build your memory lane effortlessly.
      </p>

      {/* CTA Button */}
      <button
        onClick={onStart}
        className="relative px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl font-semibold shadow-xl transform transition-all hover:scale-105 hover:shadow-2xl"
      >
        Start Capturing
        <span className="absolute top-0 left-0 w-full h-full rounded-2xl opacity-0 hover:opacity-10 bg-white/20 transition-all"></span>
      </button>

      {/* Optional Floating Tech Nodes */}
      {Array.from({ length: 6 }).map((_, idx) => (
        <div
          key={idx}
          className="absolute w-3 h-3 bg-indigo-400/30 rounded-full animate-float-slow"
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
