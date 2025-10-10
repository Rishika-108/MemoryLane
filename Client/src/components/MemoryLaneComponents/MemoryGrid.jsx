import React from "react";
import MemoryCard from "./MemoryCard";
import { motion, AnimatePresence } from "framer-motion";

const MemoryGrid = ({ memories, onClick, isLoading }) => {
  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  if (isLoading) {
    // Skeleton Loader Grid
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div
            key={idx}
            className="bg-white/10 backdrop-blur-xl p-6 rounded-3xl animate-pulse h-48"
          />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <AnimatePresence>
        {memories.map((m) => (
          <motion.div key={m.id} variants={cardVariants} layout>
            <MemoryCard memory={m} onClick={() => onClick(m.id)} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default MemoryGrid;
