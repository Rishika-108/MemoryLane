import React from "react";
import { features as mockFeatures } from "../../mock/features";

const FeatureHighlights = ({ features = mockFeatures }) => {
  return (
    <section className="relative py-20 bg-transparent overflow-hidden">
      {/* Floating Accent Circles */}
      <div className="absolute top-10 left-0 w-32 h-32 bg-purple-600/10 rounded-full filter blur-3xl animate-float-slow"></div>
      <div className="absolute bottom-16 right-0 w-24 h-24 bg-pink-600/10 rounded-full filter blur-2xl animate-float-slower"></div>

      <div className="container mx-auto px-6 relative z-10">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-16 text-white">
          Why <span className="text-purple-400">MemoryLane?</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map(({ id, title, description, icon }) => (
            <div
              key={id}
              className="group bg-slate-900/40 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-lg hover:shadow-purple-500/20 transform hover:scale-105 transition-all flex flex-col items-center text-center"
            >
              <div className="text-6xl mb-6 text-purple-400 transform transition-transform group-hover:rotate-12 group-hover:scale-110">
                {icon}
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-white group-hover:text-purple-300 transition-colors">
                {title}
              </h3>
              <p className="text-gray-400 text-md">{description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Optional Floating Tech Nodes */}
      {Array.from({ length: 8 }).map((_, idx) => (
        <div
          key={idx}
          className="absolute w-3 h-3 bg-purple-400/10 rounded-full animate-float-slow"
          style={{
            top: `${Math.random() * 90}%`,
            left: `${Math.random() * 90}%`,
            animationDelay: `${Math.random() * 3}s`,
          }}
        />
      ))}
    </section>
  );
};

export default FeatureHighlights;
