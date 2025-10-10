import React from "react";

const RecentlyViewed = ({ memories, onClick }) => (
  <div className="mb-6">
    <h2 className="text-xl font-semibold mb-4">Recently Viewed</h2>
    <div className="flex gap-4 overflow-x-auto">
      {memories.map((m) => (
        <div
          key={m.id}
          className="min-w-[200px] bg-white p-3 rounded-lg shadow hover:shadow-lg cursor-pointer"
          onClick={() => onClick(m.id)}
        >
          <p className="font-medium">{m.summary}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {m.tags.map((tag) => (
              <span key={tag} className="bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full text-xs">
                {tag}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default RecentlyViewed;
