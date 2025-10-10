import React from "react";
import { FiGithub, FiLinkedin, FiTwitter } from "react-icons/fi";

const socialLinks = [
  { Icon: FiGithub, href: "https://github.com/", label: "GitHub" },
  { Icon: FiLinkedin, href: "https://linkedin.com/", label: "LinkedIn" },
  { Icon: FiTwitter, href: "https://twitter.com/", label: "Twitter" },
];

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-b from-gray-900 via-gray-950 to-black text-gray-300 overflow-hidden border-t border-gray-800">
      {/* Subtle Floating Glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.12),transparent_70%)]"></div>

      <div className="relative container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Brand Section */}
        <div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent tracking-wide animate-gradient-x">
            WhisperRecall
          </h2>
          <p className="text-sm md:text-base leading-relaxed text-gray-400 max-w-md">
            Capture. Reflect. Evolve.<br />
            A space that helps you remember, relive, and rediscover yourself — powered by insights.
          </p>
        </div>

        {/* Social Section */}
        <div className="flex flex-col items-start md:items-end">
          <h3 className="text-lg font-semibold mb-4 text-white">Connect With Us</h3>
          <div className="flex items-center gap-5">
            {socialLinks.map(({ Icon, href, label }, idx) => (
              <a
                key={idx}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="p-3 rounded-full bg-gray-800/30 border border-gray-700 hover:border-indigo-500 hover:bg-indigo-500/20 hover:scale-110 transition-transform duration-300 flex items-center justify-center"
              >
                <Icon size={24} className="text-gray-300 hover:text-indigo-400 transition-colors duration-300" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-gray-800 py-5 text-center text-sm text-gray-400 backdrop-blur-sm bg-gray-900/60 flex flex-col md:flex-row justify-center items-center gap-2 md:gap-4">
        <span>
          © {new Date().getFullYear()}{" "}
          <span className="font-semibold text-indigo-400">WhisperRecall</span>
        </span>
        <span className="hidden md:inline">·</span>
        <span>Built with <span className="text-red-500">❤️</span> during Hackathon Hours</span>
      </div>
    </footer>
  );
};

export default Footer;
