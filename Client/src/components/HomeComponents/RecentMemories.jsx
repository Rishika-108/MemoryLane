import React, { useEffect, useState } from "react";
import { FiClock, FiExternalLink } from "react-icons/fi";

const RecentMemories = () => {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock API simulation
    setTimeout(() => {
      setMemories([
        {
          id: "1",
          summary: "Watched 5 travel reels on Instagram.",
          tags: ["travel", "social"],
          url: "https://instagram.com/reel/abc123",
          createdAt: "2025-10-10T10:30:00Z",
        },
        {
          id: "2",
          summary: "Had a deep talk with a friend about purpose.",
          tags: ["emotional", "growth"],
          url: "",
          createdAt: "2025-10-09T09:20:00Z",
        },
        {
          id: "3",
          summary: "Read an insightful article on AI memory systems.",
          tags: ["AI", "tech"],
          url: "https://example.com/article",
          createdAt: "2025-10-08T15:45:00Z",
        },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  if (loading)
    return (
      <p className="text-center text-gray-500 mt-6 animate-pulse">
        Loading memories...
      </p>
    );

  if (memories.length === 0)
    return (
      <p className="text-center text-gray-500 mt-6 animate-pulse">
        No recent memories yet.
      </p>
    );

  return (
    <section className="max-w-6xl mx-auto mt-12 px-4 relative">
      <h2 className="text-3xl md:text-4xl font-extrabold mb-12 text-white text-center">
        Recent Memories
      </h2>

      <div className="relative grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {memories.map((memory, idx) => (
          <div
            key={memory.id}
            className={`group bg-slate-900/40 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-lg hover:shadow-purple-500/20 transition-transform transform hover:scale-105 cursor-pointer relative animate-fadeInUp`}
            style={{ animationDelay: `${idx * 0.1}s` }}
            onClick={() => memory.url && window.open(memory.url, "_blank")}
          >
            {/* Floating accent dot */}
            <div className="absolute -top-3 -left-3 w-3 h-3 bg-purple-500 rounded-full animate-pulse-slow shadow-[0_0_10px_rgba(168,85,247,0.5)]"></div>

            <p className="font-medium text-white mb-3 group-hover:text-purple-200 transition-colors">{memory.summary}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {memory.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-300"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between text-gray-500 text-xs">
              <div className="flex items-center gap-1">
                <FiClock />
                <span>{new Date(memory.createdAt).toLocaleString()}</span>
              </div>
              {memory.url && <FiExternalLink className="text-purple-400" />}
            </div>
          </div>
        ))}

        {/* Optional floating tech accents */}
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="absolute w-2 h-2 bg-purple-400/20 rounded-full animate-float-slow"
            style={{
              top: `${Math.random() * 90}%`,
              left: `${Math.random() * 90}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default RecentMemories;
