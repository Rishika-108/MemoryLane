import React from "react";

const MemoryCard = ({ memory, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
  >
    <p className="font-medium mb-2">{memory.summary}</p>
    <div className="flex flex-wrap gap-2 mb-2">
      {memory.tags.map((tag) => (
        <span key={tag} className="bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full text-xs">
          {tag}
        </span>
      ))}
    </div>
    <a
      href={memory.url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-indigo-500 hover:underline text-sm"
    >
      Visit Link
    </a>
    <p className="text-gray-400 text-xs mt-2">
      {new Date(memory.createdAt).toLocaleString()}
    </p>
  </div>
);

export default MemoryCard;

