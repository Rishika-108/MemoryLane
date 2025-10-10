import React from "react";
import { FiGithub, FiLinkedin, FiTwitter } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="relative mt-20 bg-gradient-to-b from-gray-900 via-gray-950 to-black text-gray-300 overflow-hidden border-t border-gray-800">
      {/* Floating Glow Effect */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.15),transparent_70%)]"></div>

      <div className="relative container mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Brand Section */}
        <div>
          <h2 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent tracking-wide animate-gradient-x">
            WhisperRecall
          </h2>
          <p className="text-sm leading-relaxed text-gray-400 max-w-md">
            Capture. Reflect. Evolve.<br />
            A space that helps you remember, relive, and rediscover yourself — powered by insights.
          </p>
        </div>

        {/* Social Section */}
        <div className="flex flex-col items-start md:items-end">
          <h3 className="text-lg font-semibold mb-4 text-white">Connect With Us</h3>
          <div className="flex items-center gap-5">
            {[ 
              { Icon: FiGithub, href: "https://github.com/" },
              { Icon: FiLinkedin, href: "https://linkedin.com/" },
              { Icon: FiTwitter, href: "https://twitter.com/" },
            ].map(({ Icon, href }, idx) => (
              <a
                key={idx}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-gray-800/30 border border-gray-700 hover:border-indigo-500 hover:bg-indigo-500/20 hover:scale-110 transition-transform duration-300 flex items-center justify-center"
              >
                <Icon size={24} className="text-gray-300 hover:text-indigo-400 transition-colors duration-300" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-gray-800 py-5 text-center text-sm text-gray-500 backdrop-blur-sm bg-gray-900/50">
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold text-indigo-400">WhisperRecall</span> · Built with ❤️ during Hackathon Hours.
      </div>
    </footer>
  );
};

export default Footer;
