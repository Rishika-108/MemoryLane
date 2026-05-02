/**
 * Memory Lane - Smart Capture Layer (Content Script)
 * Passively observes user activity and selectively records meaningful content interactions.
 */

(function () {
  // --- CONFIGURATION & STATE ---
  let lastUrl = location.href;
  let isActive = true;
  let timeSpent = 0; // seconds
  let maxScrollDepth = 0; // percentage
  let interactionCount = 0;
  let startTime = Date.now();
  let lastEngagementUpdate = Date.now();
  let hasAutoCaptured = false;

  const CONFIG = {
    ENGAGEMENT_THRESHOLD: 40, // Score required for auto-capture
    MIN_TIME_SPENT: 15, // seconds
    MIN_SCROLL_DEPTH: 20, // percentage
    BATCH_INTERVAL: 60000, // 1 minute
    CONTENT_MIN_LENGTH: 200,
  };

  // --- UTILS ---

  function getPlatformMetadata() {
    const meta = {
      platform: 'web',
      id: null,
      media: [],
    };

    if (location.hostname.includes('youtube.com')) {
      const urlParams = new URLSearchParams(location.search);
      meta.platform = 'youtube';
      meta.id = urlParams.get('v');
    } else if (location.hostname.includes('twitter.com') || location.hostname.includes('x.com')) {
      meta.platform = 'twitter';
      const parts = location.pathname.split('/');
      if (parts.includes('status')) {
        meta.id = parts[parts.indexOf('status') + 1];
      }
    }

    // Extract images
    const images = Array.from(document.querySelectorAll('article img, main img, .content img'))
      .filter(img => img.width > 200 && img.height > 200)
      .map(img => ({ src: img.src, alt: img.alt, width: img.width, height: img.height }))
      .slice(0, 5);
    
    meta.media = images;

    return meta;
  }

  function getCleanContent() {
    // Try to find the most relevant content block
    const article = document.querySelector('article');
    const main = document.querySelector('main, [role="main"], .main-content, #main-content');
    
    let container = article || main || document.body;
    
    // Simple cleaning: remove scripts, styles, and hidden elements
    const clone = container.cloneNode(true);
    clone.querySelectorAll('script, style, nav, footer, header, .ads, .sidebar').forEach(el => el.remove());
    
    return clone.innerText.trim().slice(0, 30000);
  }

  function calculateEngagementScore() {
    // Basic heuristic score (0-100+)
    let score = 0;
    score += Math.min(timeSpent, 120) / 2; // Up to 60 points for 2 mins
    score += maxScrollDepth / 2; // Up to 50 points
    score += Math.min(interactionCount, 20) * 2; // Up to 40 points
    return Math.round(score);
  }

  // --- AUTH BRIDGE ---
  
  function checkAuthBridge() {
    // If we are on the Memory Lane web app, try to grab the token
    if (location.hostname === 'localhost' || location.hostname.includes('memory-lane')) {
      console.log('[MemoryLane] On app domain, requesting session bridge...');
      window.postMessage({ type: "REQUEST_TOKEN" }, "*");
    }
  }

  window.addEventListener("message", (event) => {
    if (event.source !== window) return;
    if (event.data.type === "TOKEN_RESPONSE" && event.data.token) {
      console.log('[MemoryLane] Session token received, bridging to extension storage.');
      chrome.runtime.sendMessage({ 
        type: "SET_SESSION", 
        token: event.data.token 
      });
    }
  });

  // Initial check
  checkAuthBridge();

  // --- CORE LOGIC ---

  function capture(reason) {
    const content = getCleanContent();
    if (content.length < CONFIG.CONTENT_MIN_LENGTH && reason !== 'manual-shortcut' && reason !== 'manual-button') {
      console.log('Skipping capture: content too short');
      return;
    }

    const payload = {
      url: location.href,
      title: document.title,
      content,
      timestamp: new Date().toISOString(),
      engagement: {
        score: calculateEngagementScore(),
        timeSpent,
        scrollDepth: maxScrollDepth,
        interactions: interactionCount,
      },
      metadata: getPlatformMetadata(),
      reason,
    };

    // Use 'capture_light' to match background.js listener
    chrome.runtime.sendMessage({ type: 'capture_light', payload });
    console.log(`[MemoryLane] Captured (${reason}) with score: ${payload.engagement.score}`);
    hasAutoCaptured = true;
  }

  // --- TRACKING ---

  function updateEngagement() {
    const now = Date.now();
    if (document.visibilityState === 'visible') {
      timeSpent += (now - lastEngagementUpdate) / 1000;
    }
    lastEngagementUpdate = now;

    // Update scroll depth
    const scrollPercent = Math.round(
      (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100
    );
    if (scrollPercent > maxScrollDepth) {
      maxScrollDepth = scrollPercent;
    }

    // Check for auto-capture
    if (!hasAutoCaptured && calculateEngagementScore() >= CONFIG.ENGAGEMENT_THRESHOLD) {
      if (timeSpent >= CONFIG.MIN_TIME_SPENT && maxScrollDepth >= CONFIG.MIN_SCROLL_DEPTH) {
        capture('auto-heuristic');
      }
    }
  }

  // --- LISTENERS ---

  window.addEventListener('scroll', () => updateEngagement(), { passive: true });
  window.addEventListener('click', () => { interactionCount++; updateEngagement(); });
  window.addEventListener('keypress', () => { interactionCount++; updateEngagement(); });
  
  setInterval(updateEngagement, 5000);

  // Manual shortcut: Alt+S
  window.addEventListener('keydown', (e) => {
    if (e.altKey && e.key === 's') {
      capture('manual-shortcut');
    }
  });

  // Listen for messages from background/popup
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === 'GET_ENGAGEMENT') {
      sendResponse({
        score: calculateEngagementScore(),
        timeSpent,
        scrollDepth: maxScrollDepth,
        interactions: interactionCount,
        hasAutoCaptured
      });
    } else if (msg.type === 'MANUAL_CAPTURE') {
      capture('manual-button');
    } else if (msg.type === 'REQUEST_TOKEN') {
       const token = localStorage.getItem("token") || null;
       sendResponse({ token });
    }
    return true;
  });

  // Handle SPA navigation
  const observer = new MutationObserver(() => {
    if (location.href !== lastUrl) {
      // If we haven't captured yet but spent significant time, capture before reset
      if (!hasAutoCaptured && calculateEngagementScore() > 20) {
        capture('navigation-exit');
      }
      
      // Reset state for new URL
      lastUrl = location.href;
      timeSpent = 0;
      maxScrollDepth = 0;
      interactionCount = 0;
      startTime = Date.now();
      lastEngagementUpdate = Date.now();
      hasAutoCaptured = false;
    }
  });
  observer.observe(document, { subtree: true, childList: true });

  console.log('[MemoryLane] Smart Capture Layer initialized');
})();