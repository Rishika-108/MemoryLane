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
    if (tabId) {
      const last = lastCaptureAt[tabId] || 0;
      if (now - last < CAPTURE_INTERVAL_MS) {
        console.log("⏱ Skipping capture due to throttle");
        return;
      }
      lastCaptureAt[tabId] = now;
    }

    // 🧩 Get stored user data
    const { userId, token } = await new Promise((resolve) => {
      chrome.storage.local.get(["userId", "token"], resolve);
    });
    console.log("🧠 Got userId/token:", userId, !!token);

    if (!userId && !token) {
      console.warn("⚠️ No userId or token found in chrome.storage.local. Capture aborted.");
      return;
    }

    // 📨 Send to backend -> /api/capture
    console.log("📡 Sending capture to backend...");
    const response = await fetch(BACKEND_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        url: payload.url,
        title: payload.title,
        reason: payload.reason,
        timestamp: payload.timestamp,
        userId,
      }),
    });

    console.log("📡 Fetch sent to backend:", BACKEND_URL);

    const result = await response.json().catch(() => ({}));
    console.log("✅ Backend response:", result);

    if (response.ok && result?.id) {
       console.log("✨ Capture and analysis completed successfully!", result.aiData);
    } else {
       console.warn("⚠️ Capture failed or returned unexpected data:", result);
    }

  } catch (e) {
    console.error("❌ handleLightCapture error", e);
  }
}
