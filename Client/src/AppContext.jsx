import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";

const AppContext = createContext();

const AUTO_LOGOUT_ON_REFRESH = false; // Changed to false for better UX
const RECENTLY_VIEWED_LIMIT = 10;

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
    isLoggedIn: false,
  });

  const [memories, setMemories] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [analyticsData, setAnalyticsData] = useState({
    contentTypePie: {},
    topTags: [],
    moodBar: {},
  });

  // Authentication helpers
  const login = useCallback((userData = {}) => {
    const safeUser = {
      id: userData.id || "",
      name: userData.name || "",
      email: userData.email || "",
      isLoggedIn: true,
    };
    setUser(safeUser);
    
    // Persist user data
    try {
      localStorage.setItem("userData", JSON.stringify(safeUser));
    } catch (e) {
      console.error("Failed to save user data:", e);
    }
  }, []);

  const logout = useCallback(() => {
    setUser({ id: "", name: "", email: "", isLoggedIn: false });
    setRecentlyViewed([]);
    
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      localStorage.removeItem("recentlyViewed");
      sessionStorage.removeItem("userData");
    } catch (e) {
      console.error("Failed to clear storage:", e);
    }
  }, []);

  // Load user data and recently viewed on mount
  useEffect(() => {
    if (AUTO_LOGOUT_ON_REFRESH) {
      try {
        localStorage.removeItem("userData");
        sessionStorage.removeItem("userData");
      } catch (e) {
        /* ignore */
      }
      setUser({ id: "", name: "", email: "", isLoggedIn: false });
    } else {
      // Load persisted user data
      try {
        const savedUser = localStorage.getItem("userData");
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          if (userData.isLoggedIn) {
            setUser(userData);
          }
        }
      } catch (e) {
        console.error("Failed to load user data:", e);
      }

      // Load recently viewed from localStorage
      try {
        const savedRecentlyViewed = localStorage.getItem("recentlyViewed");
        if (savedRecentlyViewed) {
          setRecentlyViewed(JSON.parse(savedRecentlyViewed));
        }
      } catch (e) {
        console.error("Failed to load recently viewed:", e);
      }
    }
  }, []);

  // Memory operations
  const addMemory = useCallback((memory) => {
    if (!memory || !(memory._id || memory.id)) return;
    setMemories((prev) => [memory, ...prev]);
  }, []);

  const updateMemory = useCallback((memoryId, updatedMemory) => {
    if (!memoryId) return;
    setMemories((prev) =>
      prev.map((m) => 
        (m._id === memoryId || m.id === memoryId) 
          ? { ...m, ...updatedMemory } 
          : m
      )
    );
  }, []);

  const deleteMemory = useCallback((memoryId) => {
    if (!memoryId) return;
    setMemories((prev) => 
      prev.filter((m) => m._id !== memoryId && m.id !== memoryId)
    );
    setRecentlyViewed((prev) => 
      prev.filter((m) => m._id !== memoryId && m.id !== memoryId)
    );
  }, []);

  // Recently viewed - now works with backend _id
  const markRecentlyViewed = useCallback(
    (memoryId) => {
      if (!memoryId) return;
      
      // Find memory from current memories or recentlyViewed
      let mem = memories.find((m) => m._id === memoryId || m.id === memoryId);
      
      // If not found in memories, check if it's already in recentlyViewed
      if (!mem) {
        mem = recentlyViewed.find((m) => m._id === memoryId || m.id === memoryId);
      }
      
      if (!mem) {
        console.warn("Memory not found:", memoryId);
        return;
      }

      setRecentlyViewed((prev) => {
        // Remove if already exists
        const filtered = prev.filter((x) => 
          x._id !== memoryId && x.id !== memoryId
        );
        
        // Add to front
        const newList = [mem, ...filtered].slice(0, RECENTLY_VIEWED_LIMIT);
        
        // Persist to localStorage
        try {
          localStorage.setItem("recentlyViewed", JSON.stringify(newList));
        } catch (e) {
          console.error("Failed to save recently viewed:", e);
        }
        
        return newList;
      });
    },
    [memories, recentlyViewed]
  );

  // Analytics computation
  const computeAnalytics = useCallback(
    (source = memories) => {
      if (!Array.isArray(source) || source.length === 0) {
        setAnalyticsData((prev) => {
          const empty = { contentTypePie: {}, topTags: [], moodBar: {} };
          return JSON.stringify(prev) === JSON.stringify(empty) ? prev : empty;
        });
        return;
      }

      // Content type counts
      const contentTypeCounts = source.reduce((acc, m) => {
        const key = m?.contentType || m?.type || "unknown";
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});

      // Top tags - handle both direct tags and aiData.tags
      const tags = source.flatMap((m) => 
        m.aiData?.tags || m.tags || []
      );
      const uniqueTags = Array.from(new Set(tags));
      const tagFrequency = uniqueTags
        .map((t) => ({ 
          tag: t, 
          count: tags.filter((x) => x === t).length 
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10); // Top 10 tags

      // Mood distribution
      const moodCounts = source.reduce((acc, m) => {
        const mood = m?.aiData?.sentiment || m?.mood || "neutral";
        acc[mood] = (acc[mood] || 0) + 1;
        return acc;
      }, {});

      setAnalyticsData((prev) => {
        const candidate = {
          contentTypePie: contentTypeCounts,
          topTags: tagFrequency,
          moodBar: moodCounts,
        };
        const same =
          JSON.stringify(prev.contentTypePie) === JSON.stringify(candidate.contentTypePie) &&
          JSON.stringify(prev.topTags) === JSON.stringify(candidate.topTags) &&
          JSON.stringify(prev.moodBar) === JSON.stringify(candidate.moodBar);
        return same ? prev : candidate;
      });
    },
    [memories]
  );

  // Auto recompute analytics whenever memories changes
  useEffect(() => {
    if (memories.length > 0) {
      computeAnalytics();
    }
  }, [memories, computeAnalytics]);

  // Memoized context value to minimize consumer re-renders
  const contextValue = useMemo(
    () => ({
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
    }),
    [
      user,
      memories,
      recentlyViewed,
      analyticsData,
      isLoading,
      login,
      logout,
      addMemory,
      updateMemory,
      deleteMemory,
      markRecentlyViewed,
      computeAnalytics,
    ]
  );

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

// Custom hook
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

export default AppContext;