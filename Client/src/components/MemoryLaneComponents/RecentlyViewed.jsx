import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const RecentlyViewed = ({ memories, onClick, isLoading }) => {
  const scrollRef = useRef(null);

  if (isLoading) {
    return (
      <div className="mb-12">
        <div className="h-8 w-48 bg-gray-200 rounded-lg mb-6 animate-pulse" />
        <div className="flex gap-4 overflow-x-auto pb-2">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="min-w-[280px] h-48 bg-gradient-to-br from-gray-100 to-gray-50 rounded-3xl animate-pulse shadow-md"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Recently Viewed
        </h2>
        <div className="h-1 flex-1 ml-6 bg-gradient-to-r from-indigo-200 via-purple-200 to-transparent rounded-full" />
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <AnimatePresence>
          {memories.map((m, idx) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.05, y: -4 }}
              className="
                min-w-[280px] md:min-w-[320px]
                bg-gradient-to-br from-white/95 to-white/85 backdrop-blur-xl
                p-6 rounded-3xl
                shadow-[0_8px_30px_rgba(0,0,0,0.12)]
                hover:shadow-[0_15px_45px_rgba(99,102,241,0.2)]
                cursor-pointer snap-start
                border border-gray-200/50
                relative overflow-hidden
                transition-all duration-300
              "
              onClick={() => onClick(m.id)}
            >
              {/* Top Gradient Bar */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
              
              {/* Content */}
              <div className="relative z-10">
                <p className="font-semibold text-gray-900 mb-3 text-lg leading-snug line-clamp-2">
                  {m.summary}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {m.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-xs font-medium
                        bg-gradient-to-r from-indigo-50 to-purple-50
                        text-indigo-700 border border-indigo-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Decorative Divider */}
                <div className="h-0.5 w-full bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 rounded-full" />
              </div>

              {/* Background Pattern */}
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-purple-100/30 to-transparent rounded-tl-full pointer-events-none" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add styles for scrollbar hiding and line clamp */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default RecentlyViewed;