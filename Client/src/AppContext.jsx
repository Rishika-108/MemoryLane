// AppContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";

/**
 * AppContext - Robust, hackathon-grade global state for MemoryLane.
 *
 * Improvements included:
 * - Stable memoized callbacks (useCallback) to avoid unnecessary re-renders.
 * - computeAnalytics is safe, only updates analytics state when changed.
 * - Mock fetch has cleanup to avoid leaks.
 * - Optional auto-logout-on-refresh behavior (enabled below per product requirement).
 * - Defensive checks to avoid runtime errors when data is absent.
 * - Memoized provider value to minimize consumer re-renders.
 */

// Create Context
const AppContext = createContext();

// Toggle behavior: set true to enforce automatic logout on every page refresh
const AUTO_LOGOUT_ON_REFRESH = true;

// Limits
const RECENTLY_VIEWED_LIMIT = 10;

// Mock data (used for local dev / hackathon MVP)
const mockMemories = [
  {
    id: "m1",
    title: "Beach Trip",
    description: "Vacation at Goa with friends",
    contentType: "image",
    tags: ["travel", "friends", "fun"],
    createdAt: "2025-09-01T10:00:00Z",
  },
  {
    id: "m2",
    title: "React Workshop",
    description: "Learned React hooks and context",
    contentType: "text",
    tags: ["learning", "react", "webdev"],
    createdAt: "2025-09-05T15:30:00Z",
  },
  {
    id: "m3",
    title: "Birthday Party",
    description: "Celebrated with family",
    contentType: "video",
    tags: ["family", "party", "celebration"],
    createdAt: "2025-09-10T19:00:00Z",
  },
  {
    id: "m4",
    title: "Hiking Adventure",
    description: "Hiked up to the mountains",
    contentType: "image",
    tags: ["adventure", "nature", "travel"],
    createdAt: "2025-09-12T08:20:00Z",
  },
];

export const AppProvider = ({ children }) => {
  // --- Global States ---
  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
    isLoggedIn: false,
  });

  const [memories, setMemories] = useState([]); // canonical memory list
  const [recentlyViewed, setRecentlyViewed] = useState([]); // derived array of memory objects, capped
  const [isLoading, setIsLoading] = useState(false);

  const [analyticsData, setAnalyticsData] = useState({
    contentTypePie: {},
    topTags: [],
    moodBar: {},
  });

  // --- Authentication helpers ---
  const login = useCallback((userData = {}) => {
    // Accepts minimal userData { id, name, email } and marks logged in
    const safeUser = {
      id: userData.id || "",
      name: userData.name || "",
      email: userData.email || "",
      isLoggedIn: true,
    };
    setUser(safeUser);
    // NOTE: per requirement: do NOT persist login across refresh (auto logout on refresh).
    // If you want persistence in future, store a token securely instead of raw user object.
  }, []);

  const logout = useCallback(() => {
    setUser({ id: "", name: "", email: "", isLoggedIn: false });
    // Clear any auth artifacts if present
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      sessionStorage.removeItem("userData");
    } catch (e) {
      // ignore storage errors
    }
  }, []);

  // If auto-logout-on-refresh is enabled, ensure no stale user persists between reloads
  useEffect(() => {
    if (AUTO_LOGOUT_ON_REFRESH) {
      // defensively clear any saved user data
      try {
        localStorage.removeItem("userData");
        sessionStorage.removeItem("userData");
      } catch (e) {
        /* ignore */
      }
      // also ensure in-memory user is signed out on mount
      setUser({ id: "", name: "", email: "", isLoggedIn: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  // --- Memory operations (memoized) ---
  const addMemory = useCallback((memory) => {
    if (!memory || !memory.id) return;
    setMemories((prev) => [memory, ...prev]);
  }, []);

  const updateMemory = useCallback((memoryId, updatedMemory) => {
    if (!memoryId) return;
    setMemories((prev) =>
      prev.map((m) => (m.id === memoryId ? { ...m, ...updatedMemory } : m))
    );
  }, []);

  const deleteMemory = useCallback((memoryId) => {
    if (!memoryId) return;
    setMemories((prev) => prev.filter((m) => m.id !== memoryId));
    // Also remove from recentlyViewed if present
    setRecentlyViewed((prev) => prev.filter((m) => m.id !== memoryId));
  }, []);

  // --- Recently viewed (store memory objects, keep capped) ---
  const markRecentlyViewed = useCallback(
    (memoryId) => {
      if (!memoryId) return;
      const mem = memories.find((m) => m.id === memoryId);
      if (!mem) return;
      setRecentlyViewed((prev) => {
        const newList = [mem, ...prev.filter((x) => x.id !== memoryId)];
        return newList.slice(0, RECENTLY_VIEWED_LIMIT);
      });
    },
    [memories]
  );

  // --- Analytics computation (memoized, safe update) ---
  const computeAnalytics = useCallback(
    (source = memories) => {
      // defensively handle empty list
      if (!Array.isArray(source) || source.length === 0) {
        setAnalyticsData((prev) => {
          // avoid setting identical empty structure repeatedly
          const empty = { contentTypePie: {}, topTags: [], moodBar: {} };
          return JSON.stringify(prev) === JSON.stringify(empty) ? prev : empty;
        });
        return;
      }

      // content type counts
      const contentTypeCounts = source.reduce((acc, m) => {
        const key = m?.contentType || "unknown";
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});

      // top tags
      const tags = source.flatMap((m) => m.tags || []);
      const uniqueTags = Array.from(new Set(tags));
      const tagFrequency = uniqueTags
        .map((t) => ({ tag: t, count: tags.filter((x) => x === t).length }))
        .sort((a, b) => b.count - a.count);

      // simple mood mock distribution (if AI sentiment exists in items, prefer that)
      const moodCounts = source.reduce((acc, m) => {
        const mood = m?.aiData?.sentiment || m?.mood || "neutral"; // allow real fields if available
        acc[mood] = (acc[mood] || 0) + 1;
        return acc;
      }, {});

      // only update analyticsData if different (minimize re-renders)
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

  // --- Initial mock load (with cleanup) ---
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setMemories(mockMemories);
      setIsLoading(false);
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  // Auto recompute analytics whenever `memories` changes
  useEffect(() => {
    computeAnalytics();
  }, [computeAnalytics]);

  // --- Memoized context value to minimize consumer re-renders ---
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
export const useAppContext = () => useContext(AppContext);

export default AppContext;
