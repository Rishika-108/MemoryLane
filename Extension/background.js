const BACKEND_URL = 'http://localhost:5000/api/capture';
const ANALYZE_URL = 'http://localhost:5000/api/analyze';
const lastCaptureAt = {};
const CAPTURE_INTERVAL_MS = 30_000;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("📩 Received message in background:", message);
  
  if (message?.type === 'capture_light') {
    handleLightCapture(message.payload, sender.tab).catch(console.error);
  } else if (message?.type === 'SET_SESSION') {
    chrome.storage.local.set({ 
      token: message.token, 
      userId: message.userId || null,
      lastSync: new Date().toISOString()
    }, () => {
      console.log("✅ Session updated in background storage");
    });
  }
  return true;
});

async function handleLightCapture(payload, tab) {
  try {
    console.log("⚙️ Starting handleLightCapture with payload:", payload);

    const tabId = tab?.id;
    const now = Date.now();
    const isManual = payload.reason === 'manual-button' || payload.reason === 'manual-shortcut';

    if (tabId && !isManual) {
      const last = lastCaptureAt[tabId] || 0;
      if (now - last < CAPTURE_INTERVAL_MS) {
        console.log("⏱ Skipping auto-capture due to throttle");
        return;
      }
      lastCaptureAt[tabId] = now;
    }

    // 🧩 Get stored user data
    const { token } = await new Promise((resolve) => {
      chrome.storage.local.get(["token"], resolve);
    });

    if (!token) {
      console.warn("⚠️ No token found. Capture aborted.");
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icon128.png',
        title: 'Memory Lane: Login Required',
        message: 'Please open your Memory Lane vault once to link the extension.'
      });
      chrome.runtime.sendMessage({ type: 'CAPTURE_FAILED', error: 'Please log in to the website first.' });
      return;
    }

    // 📨 Send to backend -> /api/capture
    console.log("📡 Sending capture to backend...");
    const response = await fetch(BACKEND_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        url: payload.url,
        title: payload.title,
        content: payload.content,
        reason: payload.reason,
        timestamp: payload.timestamp,
      }),
    });

    const result = await response.json().catch(() => ({}));
    console.log("✅ Backend response:", result);

    if (response.ok && result?.ok) {
       console.log("✨ Capture successful!");
       chrome.runtime.sendMessage({ type: 'local_capture_saved', payload: result });
    } else {
       console.warn("⚠️ Capture failed:", result);
       chrome.runtime.sendMessage({ type: 'CAPTURE_FAILED', error: result.message || 'Server error' });
    }

  } catch (e) {
    console.error("❌ handleLightCapture error", e);
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icon128.png',
      title: 'Memory Lane: Error',
      message: 'Failed to connect to the vault server. Is it running?'
    });
    chrome.runtime.sendMessage({ type: 'CAPTURE_FAILED', error: 'Network error or server offline' });
  }
}
