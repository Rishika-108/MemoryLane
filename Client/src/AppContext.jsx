// AppContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

// 1️⃣ Create Context
const AppContext = createContext();

// 2️⃣ Provider Component
export const AppProvider = ({ children }) => {
  const [user, setUser] = useState({ id: "", name: "", isLoggedIn: false });
  const [memories, setMemories] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState({
    contentTypePie: {},
    topTags: [],
    moodBar: {},
  });

  const login = (userData) => setUser({ ...userData, isLoggedIn: true });
  const logout = () => setUser({ id: "", name: "", isLoggedIn: false });

  const addMemory = (memory) => setMemories((prev) => [memory, ...prev]);
  const updateMemory = (memoryId, updatedMemory) =>
    setMemories((prev) =>
      prev.map((m) => (m.id === memoryId ? { ...m, ...updatedMemory } : m))
    );
  const deleteMemory = (memoryId) =>
    setMemories((prev) => prev.filter((m) => m.id !== memoryId));

  const markRecentlyViewed = (memoryId) => {
    const memory = memories.find((m) => m.id === memoryId);
    if (!memory) return;
    setRecentlyViewed((prev) =>
      [memory, ...prev.filter((m) => m.id !== memoryId)].slice(0, 10)
    );
  };

  const computeAnalytics = () => {
    // Content type counts
    const typeCounts = memories.reduce((acc, m) => {
      acc[m.contentType] = (acc[m.contentType] || 0) + 1;
      return acc;
    }, {});

    // Top tags
    const tags = memories.flatMap((m) => m.tags || []);
    const tagFrequency = [...new Set(tags)].map((tag) => ({
      tag,
      count: tags.filter((t) => t === tag).length,
    }));

    // Mood analytics (mock logic for now)
    const moods = ["happy", "sad", "neutral", "excited", "angry"];
    const moodBar = memories.reduce((acc, m, i) => {
      const mood = moods[i % moods.length];
      acc[mood] = (acc[mood] || 0) + 1;
      return acc;
    }, {});

    setAnalyticsData({
      contentTypePie: typeCounts,
      topTags: tagFrequency.sort((a, b) => b.count - a.count),
      moodBar,
    });
  };

  // --- Fetch Mock API Data on Mount ---
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setMemories(mockMemories);
      computeAnalytics();
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        memories,
        addMemory,
        updateMemory,
        deleteMemory,
        recentlyViewed,
        markRecentlyViewed,
        analyticsData,
        computeAnalytics,
        isLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// 3️⃣ Custom Hook
export const useAppContext = () => useContext(AppContext);

// --- Mock Data ---
const mockMemories = [
  {
    id: "m1",
    title: "Beach Trip",
    description: "Vacation at Goa with friends",
    contentType: "image",
    tags: ["travel", "friends", "fun"],
    date: "2025-09-01",
  },
  {
    id: "m2",
    title: "React Workshop",
    description: "Learned React hooks and context",
    contentType: "text",
    tags: ["learning", "react", "webdev"],
    date: "2025-09-05",
  },
  {
    id: "m3",
    title: "Birthday Party",
    description: "Celebrated with family",
    contentType: "video",
    tags: ["family", "party", "celebration"],
    date: "2025-09-10",
  },
  {
    id: "m4",
    title: "Hiking Adventure",
    description: "Hiked up to the mountains",
    contentType: "image",
    tags: ["adventure", "nature", "travel"],
    date: "2025-09-12",
  },
];
