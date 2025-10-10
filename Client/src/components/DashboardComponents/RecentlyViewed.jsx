import React from "react";

const RecentlyViewed = ({ recentlyViewed }) => {
  if (!recentlyViewed || recentlyViewed.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-2xl text-center">
        <h3 className="text-2xl font-bold mb-4 text-white">Recently Viewed Memories</h3>
        <p className="text-gray-300">No recently viewed memories yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition transform hover:scale-[1.02]">
      <h3 className="text-2xl font-bold mb-6 text-white">Recently Viewed Memories</h3>

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-indigo-500 scrollbar-track-white/10">
        {recentlyViewed.slice(0, 5).map((memory) => (
          <div
            key={memory.id}
            className="min-w-[220px] flex-shrink-0 border border-white/20 bg-white/5 p-4 rounded-2xl shadow-md hover:shadow-xl hover:bg-white/15 transition cursor-pointer transform hover:scale-105"
            onClick={() => memory.url && window.open(memory.url, "_blank")}
          >
            <p className="font-semibold text-white mb-2 hover:text-indigo-400 transition duration-300">
              {memory.summary}
            </p>
            <div className="flex flex-wrap gap-1 mb-2">
              {memory.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-2 py-1 rounded-full text-[10px] font-semibold shadow-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
            <p className="text-gray-400 text-xs">
              {new Date(memory.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <p className="text-gray-400 text-xs mt-2 text-center">Swipe/scroll to see more</p>
    </div>
  );
};

export default RecentlyViewed;
