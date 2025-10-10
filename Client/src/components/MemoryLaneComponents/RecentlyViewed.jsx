import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const RecentlyViewed = ({ memories, onClick, isLoading }) => {
  const scrollRef = useRef(null);

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  // Handle drag scroll (mouse/touch)
  const dragConstraints = { left: -((memories.length - 1) * 280), right: 0 };

  if (isLoading) {
    return (
      <div className="mb-12 flex gap-4 overflow-x-auto pb-2">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="min-w-[220px] h-44 bg-black/60 backdrop-blur-3xl rounded-3xl animate-pulse shadow-xl"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="mb-12">
      <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-gray-100 tracking-wide">
        Recently Viewed
      </h2>

      <motion.div
        ref={scrollRef}
        className="flex gap-4 overflow-x-hidden snap-x snap-mandatory pb-2 cursor-grab active:cursor-grabbing"
        variants={containerVariants}
        initial="hidden"
        animate="show"
        drag="x"
        dragConstraints={dragConstraints}
        dragElastic={0.1}
      >
        <AnimatePresence>
          {memories.map((m) => (
            <motion.div
              key={m.id}
              variants={cardVariants}
              className="
                min-w-[220px] md:min-w-[260px]
                bg-black/75 backdrop-blur-3xl
                p-5 rounded-3xl
                shadow-2xl hover:shadow-3xl
                transform transition duration-300 cursor-pointer
                snap-start
                border border-transparent hover:border-indigo-400/40
                relative overflow-hidden
              "
              onClick={() => onClick(m.id)}
              whileHover={{ scale: 1.08 }}
            >
              {/* Neon Glow Overlay */}
              <span className="absolute inset-0 rounded-3xl shadow-[0_0_20px_rgba(99,102,241,0.4)] pointer-events-none"></span>

              {/* Summary */}
              <p className="font-medium text-gray-100 mb-3 text-lg md:text-xl tracking-wide">
                {m.summary}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-3">
                {m.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs md:text-sm backdrop-blur-sm hover:bg-indigo-500/30 transition"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Divider */}
              <div className="h-[2px] w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full mt-2"></div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default RecentlyViewed;
