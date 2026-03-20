import React from "react";
import MemoryCard from "./MemoryCard";
import { motion, AnimatePresence } from "framer-motion";

const MemoryGrid = ({ memories, onClick, isLoading, error }) => {
  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div
            key={idx}
            className="bg-slate-800/80 backdrop-blur-xl p-6 rounded-3xl animate-pulse shadow-md h-64 border border-slate-700/50"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-4 border border-red-500/30">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-red-400 font-medium">{error}</p>
      </div>
    );
  }

  if (!memories || memories.length === 0) {
    return null; // Let the parent handle the empty state exclusively 
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <AnimatePresence>
        {memories.map((memory) => (
          <motion.div
            key={memory._id}
            variants={cardVariants}
            layout
          >
            <MemoryCard
              memory={memory}
              onClick={() => onClick(memory._id)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default MemoryGrid;