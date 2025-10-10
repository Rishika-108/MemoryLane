import React from "react";

const RecentlyViewed = ({ recentlyViewed }) => {
  // Empty state
  if (!recentlyViewed || recentlyViewed.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl text-center animate-fadeIn">
        <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">
          Recently Viewed Memories
        </h3>
        <p className="text-gray-300 text-lg">
          No recently viewed memories yet. Start capturing memories to see them here!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-transform transform hover:scale-[1.02] animate-fadeIn">
      <h3 className="text-2xl md:text-3xl font-bold mb-6 text-white">
        Recently Viewed Memories
      </h3>

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-white/10 snap-x snap-mandatory">
        {recentlyViewed.slice(0, 10).map((memory) => (
          <div
            key={memory.id}
            className="min-w-[220px] flex-shrink-0 border border-white/20 bg-white/5 p-4 rounded-2xl shadow-md hover:shadow-xl hover:bg-white/15 transition-transform transform hover:scale-105 snap-start cursor-pointer"
            onClick={() => memory.url && window.open(memory.url, "_blank")}
            tabIndex={0}
            aria-label={`Memory: ${memory.summary}`}
          >
            <p className="font-semibold text-white mb-2 hover:text-indigo-400 transition-colors duration-300 truncate">
              {memory.summary}
            </p>

            {Array.isArray(memory.tags) && memory.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {memory.tags.slice(0, 5).map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-2 py-1 rounded-full text-[10px] md:text-xs font-semibold shadow-sm truncate"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <p className="text-gray-400 text-xs md:text-sm truncate">
              {new Date(memory.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <p className="text-gray-400 text-xs md:text-sm mt-2 text-center">
        Swipe/scroll to see more memories
      </p>
    </div>
  );
};

export default RecentlyViewed;
