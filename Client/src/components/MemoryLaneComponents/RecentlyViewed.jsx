import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDrag } from "react-use-gesture";

const RecentlyViewed = ({ memories, onClick, isLoading }) => {
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
    return (
      <div className="mb-10 flex gap-4 overflow-x-auto pb-2">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="min-w-[220px] h-40 bg-white/10 backdrop-blur-xl rounded-3xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="mb-10">
      <h2 className="text-2xl font-semibold mb-4 text-white tracking-wide">
        Recently Viewed
      </h2>

      <motion.div
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 scrollbar-thin scrollbar-thumb-indigo-500/50 scrollbar-track-transparent"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <AnimatePresence>
          {memories.map((m) => (
            <motion.div
              key={m.id}
              variants={cardVariants}
              className="
                min-w-[220px]
                bg-white/10 backdrop-blur-md
                p-4 rounded-3xl
                shadow-md hover:shadow-xl
                transform hover:scale-[1.05]
                transition duration-300 cursor-pointer
                snap-start
                hover:shadow-indigo-400/40
                hover:border hover:border-indigo-400/30
              "
              onClick={() => onClick(m.id)}
              whileHover={{ scale: 1.06 }}
            >
              <p className="font-medium text-white mb-2">{m.summary}</p>
              <div className="flex flex-wrap gap-2">
                {m.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-indigo-100/20 text-indigo-300 px-2 py-1 rounded-full text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default RecentlyViewed;
