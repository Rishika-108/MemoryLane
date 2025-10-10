import React from "react";
import MemoryCard from "./MemoryCard";

const MemoryGrid = ({ memories, onClick }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {memories.map((m) => (
      <MemoryCard key={m.id} memory={m} onClick={() => onClick(m.id)} />
    ))}
  </div>
);

export default MemoryGrid;
