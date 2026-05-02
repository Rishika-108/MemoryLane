import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import Home from "./Pages/Home";
import Dashboard from "./Pages/Dashboard";
import MemoryLane from "./Pages/MemoryLane";
import AnimatedBackground from "./Components/AnimatedBackground";
import { useAppContext } from "./AppContext";


const ProtectedRoute = ({ children }) => {
  const { user } = useAppContext();
  return user.isLoggedIn ? children : <Navigate to="/" replace />;
};

const App = () => {
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
