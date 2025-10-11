// // background service worker: receives light capture events, optionally takes screenshot and forwards to backend
// const BACKEND_URL = 'http://localhost:5000/api/capture'; // change to your server


// // throttle / debounce captures per tab to avoid spam
// const lastCaptureAt = {}; // tabId -> timestamp
// const CAPTURE_INTERVAL_MS = 30_000; // at most once every 30s per tab


// chrome.runtime.onMessage.addListener((message, sender) => {
// if(message?.type === 'capture_light'){
// handleLightCapture(message.payload, sender.tab).catch(console.error);
// }
// });


// async function handleLightCapture(payload, tab){
// try{
// const tabId = tab?.id;
// const now = Date.now();
// if(tabId){
// const last = lastCaptureAt[tabId] || 0;
// if(now - last < CAPTURE_INTERVAL_MS) return; // skip frequent
// lastCaptureAt[tabId] = now;
// }


// // request a visible tab screenshot (requires activeTab or tabs permission)
// let screenshotDataUrl = null;
// try{
// const captureOpts = {format: 'png'};
// screenshotDataUrl = await chrome.tabs.captureVisibleTab(tab?.windowId, captureOpts);
// }catch(err){
// console.warn('screenshot failed', err);
// }


// const body = {
// url: payload.url,
// title: payload.title,
// selection: payload.selection,
// timestamp: payload.timestamp,
// reason: payload.reason,
// screenshot: screenshotDataUrl
// };

// const { userId, token } = await chrome.storage.local.get(["userId", "token"]);

// await fetch(BACKEND_URL, {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//     ...(token ? { Authorization: `Bearer ${token}` } : {}),
//   },
//   body: JSON.stringify({
//     url: payload.url,
//     title: payload.title,
//     selection: payload.selection,
//     timestamp: payload.timestamp,
//     reason: payload.reason,
//     screenshot: screenshotDataUrl,
//     userId, // optional if you use JWT
//   }),
// });



// // send to backend
// // await fetch(BACKEND_URL, {
// // method: 'POST',
// // headers: {'Content-Type':'application/json'},
// // body: JSON.stringify(body)
// // });


// // optional: show a quiet notification
// // chrome.notifications.create({type:'basic', iconUrl:'icon.png', title:'Memory Lane', message:'Captured page'});
// }catch(e){
// console.error('handleLightCapture error', e);
// }
// }


// // alarm to cleanup old capture timestamps
// chrome.alarms.create('cleanup', {periodInMinutes: 10});
// chrome.alarms.onAlarm.addListener(() => {
// const now = Date.now();
// for(const k of Object.keys(lastCaptureAt)){
// if(now - lastCaptureAt[k] > 60*60*1000) delete lastCaptureAt[k];
// }
// });


// const BACKEND_URL = 'http://localhost:5000/api/capture';
// const lastCaptureAt = {};
// const CAPTURE_INTERVAL_MS = 30_000;

// chrome.runtime.onMessage.addListener((message, sender) => {
//   console.log("📩 Received message in background:", message);
//   if (message?.type === 'capture_light') {
//     handleLightCapture(message.payload, sender.tab).catch(console.error);
//   }
// });

// async function handleLightCapture(payload, tab) {
//   try {
//     console.log("⚙️ Starting handleLightCapture with payload:", payload);

//     const tabId = tab?.id;
//     const now = Date.now();
//     if (tabId) {
//       const last = lastCaptureAt[tabId] || 0;
//       if (now - last < CAPTURE_INTERVAL_MS) {
//         console.log("⏱ Skipping capture due to throttle");
//         return;
//       }
//       lastCaptureAt[tabId] = now;
//     }

//     // Get stored user data
//     const { userId, token } = await new Promise((resolve) => {
//       chrome.storage.local.get(["userId", "token"], resolve);
//     });
//     console.log("🧠 Got userId/token:", userId, !!token);

//     // Send to backend
//     const response = await fetch(BACKEND_URL, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         ...(token ? { Authorization: `Bearer ${token}` } : {}),
//       },
//       body: JSON.stringify({
//         url: payload.url,
//         title: payload.title,
//         reason: payload.reason,
//         timestamp: payload.timestamp,
//         userId,
//       }),
//     });

//     console.log("📡 Fetch sent to backend:", BACKEND_URL);

//     const result = await response.json().catch(() => ({}));
//     console.log("✅ Backend response:", result);

//   } catch (e) {
//     console.error('❌ handleLightCapture error', e);
//   }
// }

const BACKEND_URL = 'http://localhost:5000/api/capture';
const ANALYZE_URL = 'http://localhost:5000/api/analyze';
const lastCaptureAt = {};
const CAPTURE_INTERVAL_MS = 30_000;

chrome.runtime.onMessage.addListener((message, sender) => {
  console.log("📩 Received message in background:", message);
  if (message?.type === 'capture_light') {
    handleLightCapture(message.payload, sender.tab).catch(console.error);
  }
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

    if (!userId) {
      console.warn("⚠️ No userId found in chrome.storage.local");
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

    // 🧠 If capture saved successfully, auto-trigger analysis
    if (response.ok && result?.savedUrl) {
      console.log("🧩 Triggering AI analysis for:", result.savedUrl);

      const analyzeResponse = await fetch(ANALYZE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          url: result.savedUrl,
          userId,
        }),
      });

      if (analyzeResponse.ok) {
        console.log("✨ AI analysis triggered successfully!");
      } else {
        console.warn("⚠️ AI analysis trigger failed:", analyzeResponse.status);
      }
    } else {
      console.warn("⚠️ No savedUrl returned — skipping AI analysis.");
    }

  } catch (e) {
    console.error("❌ handleLightCapture error", e);
  }
}
