import React, { useEffect, useState } from "react";
import MemoryCard from "./MemoryCard";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const MemoryGrid = ({ onClick }) => {
  const [memories, setMemories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const BASE_URL = "http://localhost:5000"

  const fetchMemories = async () => {
    setIsLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
    console.log("Token being sent:", token);

      const res = await axios.get(`${BASE_URL}/api/content/getContent`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setMemories(res.data.data); // each object is now a memory with _id
    } catch (err) {
      console.error("Error fetching memories:", err);
      setError("Failed to load memories.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMemories();
    const interval = setInterval(fetchMemories, 20000); // auto-refresh every 20s
    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  if (isLoading)
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

  if (error)
    return <p className="text-red-400 text-center">{error}</p>;

  if (memories.length === 0)
    return <p className="text-gray-400 text-center">No memories found.</p>;

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <AnimatePresence>
        {memories.map((memory) => (
          <motion.div
            key={memory._id}
            variants={cardVariants}
            layout
            whileHover={{ scale: 1.04 }}
          >
            <MemoryCard
              memory={memory}
              onClick={() => onClick(memory._id)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default MemoryGrid;
