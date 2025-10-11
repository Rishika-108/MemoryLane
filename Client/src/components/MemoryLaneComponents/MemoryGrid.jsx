// import React from "react";
// import MemoryCard from "./MemoryCard";
// import { motion, AnimatePresence } from "framer-motion";

// const MemoryGrid = ({ memories, onClick, isLoading }) => {
//   const containerVariants = {
//     hidden: {},
//     show: {
//       transition: {
//         staggerChildren: 0.08,
//       },
//     },
//   };

//   const cardVariants = {
//     hidden: { opacity: 0, y: 20 },
//     show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
//   };

//   if (isLoading) {
//     // Dark-themed skeleton loader grid
//     return (
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//         {Array.from({ length: 8 }).map((_, idx) => (
//           <div
//             key={idx}
//             className="bg-black/50 backdrop-blur-3xl p-6 rounded-3xl animate-pulse shadow-lg h-52"
//           />
//         ))}
//       </div>
//     );
//   }

//   return (
//     <motion.div
//       className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
//       variants={containerVariants}
//       initial="hidden"
//       animate="show"
//     >
//       <AnimatePresence>
//         {memories.map((m) => (
//           <motion.div
//             key={m.id}
//             variants={cardVariants}
//             layout
//             whileHover={{ scale: 1.04 }}
//           >
//             <MemoryCard memory={m} onClick={() => onClick(m.id)} />
//           </motion.div>
//         ))}
//       </AnimatePresence>
//     </motion.div>
//   );
// };

// export default MemoryGrid;
import React, { useEffect, useState } from "react";
import MemoryCard from "./MemoryCard";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const MemoryGrid = ({ onClick }) => {
  const [memories, setMemories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const BASE_URL = "http://localhost:5000";

  // Fetch user content from backend
  const fetchMemories = async () => {
    setIsLoading(true);
    setError("");
    try {
      // const token = localStorage.getItem("token"); // Assuming JWT is stored
      // const response = await axios.get(`${BASE_URL}/api/content/getContent`, {
      //   headers: { Authorization: `Bearer ${token}` },
      // });
      const token = localStorage.getItem("token"); // or wherever you store JWT
      const res = await fetch(`${API_URL}/content/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // <<< add this
        },
        body: JSON.stringify({ keyword }),
      });


      const formattedData = response.data.data.map((item) => ({
        id: item._id,
        summary: item.aiData.summary || item.title || "No summary available",
        tags: item.aiData.tags || [],
        url: item.url,
        createdAt: item.createdAt,
      }));

      setMemories(formattedData);
    } catch (err) {
      console.error("Error fetching memories:", err);
      setError("Failed to load memories. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMemories();
  }, []);

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  if (isLoading) {
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
  }

  if (error) {
    return <p className="text-red-400 text-center">{error}</p>;
  }

  if (memories.length === 0) {
    return <p className="text-gray-400 text-center">No memories found.</p>;
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <AnimatePresence>
        {memories.map((m) => (
          <motion.div
            key={m.id}
            variants={cardVariants}
            layout
            whileHover={{ scale: 1.04 }}
          >
            <MemoryCard memory={m} onClick={() => onClick(m.id)} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default MemoryGrid;
