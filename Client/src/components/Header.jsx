import React, { useState, useEffect, useRef } from "react";
import { useAppContext } from "../AppContext";
import {
  FiUser,
  FiLogIn,
  FiMenu,
  FiX,
  FiGithub,
  FiLinkedin,
  FiTwitter,
} from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import ThoughtProcess from "../assets/ThoughtProcess.svg";

const Header = () => {
  const { user, login, logout } = useAppContext();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const usernameRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogin = () => {
    const name = usernameRef.current.value.trim();
    if (!name) return;
    login({ id: "user_" + Date.now(), name });
    setShowLoginModal(false);
    usernameRef.current.value = "";
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "MemoryLane", path: "/memorylane" },
  ];

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "shadow-xl bg-white/80 backdrop-blur-lg" : "bg-white/95"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="flex flex-col leading-tight">
          <span className="text-2xl sm:text-3xl font-extrabold tracking-wide text-gray-900 font-sans bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500 animate-gradient-x">
            Whisper<span className="text-indigo-600">Recall</span>
          </span>
          <span className="text-xs sm:text-sm font-medium text-gray-500 tracking-wide">
            REMEMBER MORE. FORGET LESS
          </span>
        </Link>

        {/* Desktop Nav */}
        {user?.isLoggedIn && (
          <nav className="hidden md:flex gap-6 font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`relative group transition-all duration-300 ${
                  location.pathname === link.path
                    ? "text-indigo-600 underline"
                    : "text-gray-700 hover:text-indigo-500"
                }`}
              >
                {link.name}
                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-indigo-500 transition-all group-hover:w-full"></span>
              </Link>
            ))}
          </nav>
        )}

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {user?.isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 border px-3 py-1 rounded-full hover:bg-gray-100 transition shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                aria-label="User menu"
              >
                <FiUser size={20} />
                <span className="hidden md:block">{user.name}</span>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white shadow-xl rounded-lg overflow-hidden z-50 animate-fadeIn">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-indigo-50 transition"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 hover:bg-indigo-50 transition"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-indigo-50 transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 transition shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <FiLogIn size={18} /> Login / Register
            </button>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-600 hover:text-indigo-500 transition focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && user?.isLoggedIn && (
        <nav className="md:hidden bg-white shadow-lg flex flex-col gap-2 px-6 py-4 animate-slideDown backdrop-blur-sm">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`hover:text-indigo-500 font-medium transition-all duration-300 ${
                location.pathname === link.path
                  ? "text-indigo-600 underline"
                  : "text-gray-700"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 w-96 shadow-2xl relative animate-fadeInUp">
            
            {/* Close Button */}
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-white hover:text-indigo-400 transition text-2xl font-bold"
            >
              ✕
            </button>

            {/* SVG Illustration */}
            <img
              src={ThoughtProcess}
              alt="Thought Process"
              className="w-48 h-auto mx-auto mb-4 animate-fadeIn"
            />

            {/* Modal Title */}
            <h2 className="text-2xl font-bold mb-2 text-white text-center tracking-wide">
              Welcome Back!
            </h2>
            <p className="text-sm text-gray-200 mb-6 text-center">
              Log in or register to save your memories and insights
            </p>

            {/* Username Input */}
            <input
              ref={usernameRef}
              autoFocus
              type="text"
              placeholder="Enter your name"
              className="w-full border border-white/30 bg-white/10 placeholder-gray-300 px-4 py-3 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 backdrop-blur-sm text-white transition"
            />

            {/* Login Button */}
            <button
              onClick={handleLogin}
              className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-purple-500 hover:to-indigo-500 shadow-lg transition-all transform hover:scale-105"
            >
              Login / Register
            </button>

            {/* Social Login */}
            <div className="mt-6 flex justify-center gap-4">
              {[
                { Icon: FiGithub, color: "text-gray-200" },
                { Icon: FiLinkedin, color: "text-blue-500" },
                { Icon: FiTwitter, color: "text-blue-400" },
              ].map(({ Icon, color }, idx) => (
                <button
                  key={idx}
                  className={`p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-indigo-500/20 transition transform hover:scale-110 ${color}`}
                >
                  <Icon size={22} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
