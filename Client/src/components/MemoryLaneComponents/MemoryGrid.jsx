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
    // Dark-themed skeleton loader grid
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div
            key={idx}
            className="bg-black/50 backdrop-blur-3xl p-6 rounded-3xl animate-pulse shadow-lg h-52"
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
          <motion.div
            key={m.id}
            variants={cardVariants}
            layout
            whileHover={{ scale: 1.04 }}
          >
            <MemoryCard memory={m} onClick={() => onClick(m.id)} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default MemoryGrid;
