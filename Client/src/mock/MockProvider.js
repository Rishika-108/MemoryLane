import React, { createContext, useState, useEffect } from "react";
import { mockAnalytics, mockRecentlyViewed, mockMemories } from "./index"; // adjust path if needed

export const MockContext = createContext();

export const MockProvider = ({ children }) => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const computeAnalytics = () => {
    // simulate async computation
    setIsLoading(true);
    setTimeout(() => {
      setAnalyticsData(mockAnalytics);
      setRecentlyViewed(mockRecentlyViewed);
      setIsLoading(false);
    }, 500); // small delay to simulate loading
  };

  useEffect(() => {
    computeAnalytics();
  }, []);

  return (
    <MockContext.Provider
      value={{ analyticsData, recentlyViewed, computeAnalytics, isLoading }}
    >
      {children}
    </MockContext.Provider>
  );
};
