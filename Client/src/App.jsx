import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import MemoryLane from "./pages/MemoryLane";
import AnimatedBackground from "./components/AnimatedBackground";


const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 🔒 Handle auto logout on refresh
  useEffect(() => {
    const session = localStorage.getItem("isAuthenticated");
    if (session === "true") {
      // Immediately clear auth on page reload (forces re-login)
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("token");
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.source !== window) return;
      if (event.data.type === "REQUEST_TOKEN") {
        const token = localStorage.getItem("token");
        if (token) {
          window.postMessage({ type: "TOKEN_RESPONSE", token }, "*");
          console.log("🔐 Token sent to Chrome Extension:", token);
        } else {
          console.log("⚠️ No token found in localStorage.");
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);


  return (
    <Router>
      <AnimatedBackground />
      <div className="relative z-0 min-h-screen flex flex-col font-sans">
        <Header />
        <Routes>
        {/* Public Route */}
        <Route path="/" element={<Home />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/memorylane"
          element={
            <ProtectedRoute>
              <MemoryLane />
            </ProtectedRoute>
          }
        />

        {/* Catch-all route to prevent unknown page access */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
      </div>
    </Router>
  );
};

export default App;
