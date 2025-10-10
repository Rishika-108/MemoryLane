Whisper Recall
REMEMBER MORE. FORGET LESS

Overview
MemoryLane is a personal digital memory assistant designed to capture, store, and help you revisit important online interactions automatically. It leverages browser extensions, backend APIs, and web interfaces to track user activities—like interactions on social media—and stores them securely for later retrieval and review.

Features
Automatic Interaction Capture
Captures user interactions such as likes, comments, shares on Instagram through a Chrome extension or alternative approaches like network proxy.

Secure User Authentication
Simple login system that generates session tokens to keep user memories isolated and secure.

Backend Storage & API
Stores memories in an in-memory data store via RESTful APIs with endpoints for login, adding memories, and fetching stored memories.

Frontend Dashboard
User-friendly interface to log in, fetch, and view the memories captured from user interactions.

Configurable Auto Capture
Enables or disables automatic capture from the extension popup.

Expandable Architecture
Designed with modular components—backend, extension, frontend—to allow easy customization and scaling.

Project Structure
backend/ - Node.js Express server implementing token-based login and memory storage APIs.

extension/ - Chrome extension capturing Instagram interactions with content and background scripts.

frontend/ - Web portal for user login and memory viewing, implemented in HTML/JavaScript.

proxy/ - (Optional) Python mitmproxy scripts for local proxy-based interaction capture.

Installation & Setup
Backend
Navigate to backend/ folder.

Install dependencies:

bash
npm install
Run server:

bash
node server.js
Backend runs on http://localhost:3000

Chrome Extension
Open Chrome and load extension as unpacked:

Go to chrome://extensions/

Enable Developer Mode

Click “Load unpacked” and select the extension/ folder

In the extension popup, enable “Auto Capture”.

Browse Instagram to automatically capture interactions.

Frontend
Open frontend/index.html in your browser.

Log in with a username to generate token.

Fetch your captured memories from the backend.

Optional: Local Proxy for Auto Capture
Use Python’s mitmproxy to intercept Instagram network requests for users preferring not to use an extension (advanced).

Usage
Log in via frontend to receive a session token.

Use extension or proxy to capture interactions tagged with your token.

Fetch memories through frontend for a seamless personal log of social activities.

Technologies
Backend: Node.js, Express, CORS, crypto

Frontend: HTML, JavaScript

Browser Extension: Chrome extension APIs, message passing

Proxy (optional): Python, mitmproxy

Contributing
Contributions and bug fixes are welcome. Feel free to submit pull requests or open issues.

License
This project is open source and free to use.

Contact
For questions or support, please open an issue on GitHub or contact the maintainers.