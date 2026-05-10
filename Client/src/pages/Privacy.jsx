import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

const Privacy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-purple-500/30 font-sans">
      <main className="container mx-auto px-6 py-12 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Back Button */}
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors mb-12 group"
          >
            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          <div className="mb-12 text-left">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Privacy Policy
            </h1>
            <p className="text-gray-400">Effective Date: May 10, 2026</p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 md:p-12 space-y-12 text-gray-300 leading-relaxed backdrop-blur-sm">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center text-sm">01</span>
                Introduction
              </h2>
              <p>
                Memory Lane ("we", "our", or "us") is a personal knowledge and memory
                assistant designed to help users save, organize, summarize, and retrieve
                meaningful web content. This Privacy Policy explains what information is collected,
                how it is processed, and how users maintain control over their information when using Memory Lane.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center text-sm">02</span>
                Information We Collect
              </h2>
              <p>When users manually save content or enable Auto Capture, Memory Lane may collect:</p>
              <ul className="grid md:grid-cols-2 gap-3 mt-4">
                {[
                  "Webpage URL & Page Title",
                  "Relevant webpage text content",
                  "YouTube & Social Media metadata",
                  "PDF text content",
                  "Timestamps of captures",
                  "Engagement signals (Scroll/Time)",
                  "Authentication tokens"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 p-3 bg-white/5 rounded-xl border border-white/5">
                    <div className="w-1.5 h-1.5 rounded-full bg-pink-500"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center text-sm">03</span>
                Auto Capture Logic
              </h2>
              <p>
                Auto Capture is optional and disabled by default. It only operates after meaningful engagement thresholds:
              </p>
              <div className="grid sm:grid-cols-3 gap-4 mt-6">
                <div className="text-center p-4 bg-purple-500/5 rounded-2xl border border-purple-500/20">
                  <div className="text-xl font-bold text-purple-400">15s</div>
                  <div className="text-xs text-gray-500 uppercase mt-1">Min Time</div>
                </div>
                <div className="text-center p-4 bg-purple-500/5 rounded-2xl border border-purple-500/20">
                  <div className="text-xl font-bold text-purple-400">20%</div>
                  <div className="text-xs text-gray-500 uppercase mt-1">Min Scroll</div>
                </div>
                <div className="text-center p-4 bg-purple-500/5 rounded-2xl border border-purple-500/20">
                  <div className="text-xl font-bold text-purple-400">200+</div>
                  <div className="text-xs text-gray-500 uppercase mt-1">Characters</div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center text-sm">04</span>
                Security & Data Use
              </h2>
              <p>
                Memory Lane does not sell your activity for advertising. Collected information is used solely to generate AI-powered summaries,
                enable semantic search, and organize your digital memories. We use reasonable technical safeguards including secure transmission
                and protected backend infrastructure.
              </p>
            </section>

            <div className="pt-10 border-t border-white/10 text-center text-sm text-gray-500">
              <p className="mb-2">For privacy-related questions, please contact us at:</p>
              <a href="mailto:MemoryLane_support@gmail.com" className="text-purple-400 hover:text-purple-300 font-medium">support@memorylane.app</a>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Privacy;
