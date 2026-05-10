import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import MemoryLane from "./pages/MemoryLane";
import Privacy from "./pages/Privacy";
import AnimatedBackground from "./components/AnimatedBackground";
import { useAppContext } from "./AppContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProtectedRoute = ({ children }) => {
  const { user } = useAppContext();
  return user.isLoggedIn ? children : <Navigate to="/" replace />;
};

// Component to handle conditional layout
const AppContent = () => {
  const location = useLocation();
  const isPrivacyPage = location.pathname === "/privacy";

  return (
    <div className="relative z-0 min-h-screen flex flex-col font-sans">
      {!isPrivacyPage && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route
          path="/memorylane"
          element={
            <ProtectedRoute>
              <MemoryLane />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!isPrivacyPage && <Footer />}
    </div>
  );
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
      <AppContent />
      <ToastContainer position="bottom-right" theme="dark" />
    </Router>
  );
};

export default App;
