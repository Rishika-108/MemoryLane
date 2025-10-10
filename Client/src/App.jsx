import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import MemoryLane from "./pages/MemoryLane";
// import Profile from "./pages/Profile";

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/memorylane" element={<MemoryLane />} />
        {/*
          Profile page is linked only from Header dropdown.
          Add the Route when Profile page is implemented.
        */}
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
