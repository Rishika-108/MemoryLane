import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiGithub, FiLinkedin, FiTwitter } from "react-icons/fi";

const socialLinks = [
  { Icon: FiGithub, href: "https://github.com/", label: "GitHub" },
  { Icon: FiLinkedin, href: "https://linkedin.com/", label: "LinkedIn" },
  { Icon: FiTwitter, href: "https://twitter.com/", label: "Twitter" },
];

const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className="relative bg-transparent text-gray-300 overflow-hidden border-t border-white/5">
      {/* Subtle Floating Glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.08),transparent_70%)]"></div>

      <div className="relative container mx-auto px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Brand Section */}
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold mb-1 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent tracking-wide">
            MemoryLane
          </h2>
          <p className="text-xs text-gray-400 max-w-md leading-snug">
            Capture. Reflect. Evolve.<br />
            A space that helps you remember, relive, and rediscover yourself.
          </p>
        </div>

        {/* Social Section */}
        <div className="flex flex-col items-start md:items-end">
          <h3 className="text-xs font-semibold mb-1 text-white uppercase tracking-wider">Connect With Us</h3>
          <div className="flex items-center gap-2">
            {socialLinks.map(({ Icon, href, label }, idx) => (
              <a
                key={idx}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="p-1.5 rounded-full bg-white/5 border border-white/10 hover:border-purple-500 hover:bg-purple-500/20 hover:scale-110 transition-all duration-300 flex items-center justify-center"
              >
                <Icon size={18} className="text-gray-300 hover:text-purple-400 transition-colors duration-300" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-white/5 py-4 text-center text-[10px] uppercase tracking-[0.1em] text-gray-500 backdrop-blur-md bg-black/20 flex flex-col md:flex-row justify-center items-center gap-1 md:gap-2">
        <span>
          © {new Date().getFullYear()} <span className="font-semibold text-purple-400/80">MemoryLane</span>
        </span>
        <span className="hidden md:inline text-white/10">|</span>
        <button 
          onClick={() => {
            console.log("🚀 Navigating to /privacy...");
            navigate("/privacy");
          }}
          className="hover:text-white transition-colors duration-200"
        >
          Privacy Policy
        </button>
        <span className="hidden md:inline text-white/10">|</span>
        <span>Built with <span className="text-pink-500 animate-pulse">❤️</span> for digital mindfulness</span>
      </div>
    </footer>
  );
};

export default Footer;
