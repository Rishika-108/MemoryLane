import React, { useState } from "react";
import { FiGithub, FiLinkedin, FiTwitter, FiX } from "react-icons/fi";

const socialLinks = [
  { Icon: FiGithub, href: "https://github.com/", label: "GitHub" },
  { Icon: FiLinkedin, href: "https://linkedin.com/", label: "LinkedIn" },
  { Icon: FiTwitter, href: "https://twitter.com/", label: "Twitter" },
];

const PrivacyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 animate-fadeIn">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      ></div>
      <div className="relative bg-slate-900 border border-white/10 w-full max-w-3xl max-h-[80vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-scaleIn">
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-slate-800/50">
          <h2 className="text-xl font-bold text-white">Privacy & Data Protection</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
          >
            <FiX size={24} />
          </button>
        </div>
        <div className="p-8 overflow-y-auto custom-scrollbar text-gray-300 space-y-6 text-sm md:text-base leading-relaxed">
          <section>
            <h3 className="text-lg font-bold text-purple-400 mb-2">Introduction</h3>
            <p>
              Memory Lane ("we", "our", or "us") is a personal knowledge and memory
              assistant designed to help users save, organize, summarize, and retrieve
              meaningful web content. This Privacy Policy explains what information is collected,
              how it is processed, and how users maintain control over their information.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-bold text-purple-400 mb-2">Information We Collect</h3>
            <p>When users manually save content or enable Auto Capture, Memory Lane may collect:</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Webpage URL and Page Title</li>
              <li>Relevant webpage text content for summarization</li>
              <li>YouTube metadata and PDF text content</li>
              <li>Engagement signals (time spent, scroll depth)</li>
              <li>Authentication tokens to link the extension to your account</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold text-purple-400 mb-2">Auto Capture Heuristics</h3>
            <p>Auto Capture is optional and only occurs after meaningful engagement:</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Minimum time spent (~15 seconds)</li>
              <li>Minimum scroll engagement (~20%)</li>
              <li>Minimum content threshold (~200+ characters)</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold text-purple-400 mb-2">Excluded Content</h3>
            <p>We strictly exclude the following from any capture:</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Banking and financial websites</li>
              <li>Password and login fields</li>
              <li>Email inboxes and private messaging</li>
              <li>Incognito/private browsing sessions</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold text-purple-400 mb-2">How Information Is Used</h3>
            <p>Your data is used solely to provide your personalized experience:</p>
            <ul className="list-disc ml-5 mt-2 space-y-1">
              <li>Generating AI summaries and insights</li>
              <li>Enabling semantic search and memory retrieval</li>
              <li>Synchronizing your captures across devices</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold text-purple-400 mb-2">Data Security</h3>
            <p>
              We implement industry-standard safeguards to protect your data, including secure transmission (HTTPS), 
              encrypted storage, and protected backend infrastructure. We do not sell your data for advertising purposes.
            </p>
          </section>

          <div className="pt-6 border-t border-white/5 text-xs text-gray-500">
            Effective Date: May 10, 2026 | support@memorylane.app
          </div>
        </div>
      </div>
    </div>
  );
};

const Footer = () => {
  const [isPrivacyOpen, setPrivacyOpen] = useState(false);

  return (
    <>
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
            onClick={() => setPrivacyOpen(true)}
            className="hover:text-white transition-colors duration-200"
          >
            Privacy Policy
          </button>
          <span className="hidden md:inline text-white/10">|</span>
          <span>Built with <span className="text-pink-500 animate-pulse">❤️</span> for digital mindfulness</span>
        </div>
      </footer>

      <PrivacyModal isOpen={isPrivacyOpen} onClose={() => setPrivacyOpen(false)} />
    </>
  );
};

export default Footer;
