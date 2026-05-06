// // 🔐 Step 2: Request JWT token from frontend app
// window.addEventListener("load", () => {
//   // Ask the website (React app) for the token
//   window.postMessage({ type: "REQUEST_TOKEN" }, "*");

//   // Listen for token response from the web app
//   window.addEventListener("message", async (event) => {
//     if (event.source !== window) return;

//     if (event.data.type === "TOKEN_RESPONSE") {
//       const token = event.data.token;
//       if (token) {
//         console.log("✅ Token received from frontend:", token);
//         await chrome.storage.local.set({ token });
//       } else {
//         console.warn("⚠️ No token found — redirecting to login...");

//         // Direct the user to login page in a new tab
//         chrome.tabs.create({
//           url: "http://localhost:5173/", // or your actual deployed login route
//         });
//       }
//     }
//   });
// });


// const toggle = document.getElementById('toggle');
// const forceBtn = document.getElementById('force');
// const recent = document.getElementById('recent');

// forceBtn.addEventListener('click', async () => {
//   const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
//   if (!tab) return;
  

//   // Temporarily change button text to indicate bookmarking
//   const originalText = forceBtn.textContent;
//   forceBtn.textContent = "✅ Bookmarked!";
//   forceBtn.disabled = true; // optional — prevent multiple clicks

//   // Inject capture script into current tab
//   chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     func: () => {
//       const payload = {
//         url: location.href,
//         title: document.title,
//         selection: window.getSelection().toString().slice(0, 20000),
//         timestamp: new Date().toISOString(),
//         reason: 'manual_popup'
//       };
//       chrome.runtime.sendMessage({ type: 'capture_light', payload });
//     }
//   });

//   // Revert button back after 2 seconds
//   setTimeout(() => {
//     forceBtn.textContent = originalText;
//     forceBtn.disabled = false;
//   }, 2000);
// });

// // load setting
// chrome.storage.sync.get({enabled:true}, (res) => {
// toggle.checked = !!res.enabled;
// });


// toggle.addEventListener('change', () => {
// chrome.storage.sync.set({enabled: toggle.checked});
// });


// forceBtn.addEventListener('click', async () => {
// const [tab] = await chrome.tabs.query({active:true, currentWindow:true});
// if(!tab) return;
// chrome.scripting.executeScript({
// target: {tabId: tab.id},
// func: () => {
// // force a capture by sending a message from content script context
// const payload = {
// url: location.href,
// title: document.title,
// selection: window.getSelection().toString().slice(0,20000),
// timestamp: new Date().toISOString(),
// reason: 'manual_popup'
// };
// chrome.runtime.sendMessage({type:'capture_light', payload});
// }
// });
// });


// // show recent light captures saved in local storage
// function renderRecent(items){
// recent.innerHTML = '';
// items = items || [];
// for(const it of items.slice(0,8)){
// const li = document.createElement('li');
// li.textContent = `${new Date(it.timestamp).toLocaleTimeString()} - ${it.title || it.url}`;
// recent.appendChild(li);
// }
// }


// chrome.storage.local.get({recentCaptures:[]}, (res)=> renderRecent(res.recentCaptures));


// // listen for incoming captures to append to popup list
// chrome.runtime.onMessage.addListener((msg) => {
// if(msg?.type === 'local_capture_saved'){
// chrome.storage.local.get({recentCaptures:[]}, (res)=> renderRecent(res.recentCaptures));
// }
// });

// popup.js
const toggle = document.getElementById('toggle');
const forceBtn = document.getElementById('force');
const recent = document.getElementById('recent');
const statusDot = document.getElementById('status-dot');
const statusText = document.getElementById('status-text');

// 🔐 Step 1: Update UI based on connection
function updateConnectionStatus(token) {
  if (token) {
    statusDot.classList.remove('offline');
    statusText.textContent = "Vault Connected";
    statusText.style.color = "#4ade80";
  } else {
    statusDot.classList.add('offline');
    statusText.textContent = "Vault Disconnected (Login required)";
    statusText.style.color = "#f87171";
  }
}

// Helper to check if we can actually run scripts on this tab
function isSafeTab(url) {
  return url && !url.startsWith('chrome://') && !url.startsWith('edge://') && !url.startsWith('about:') && !url.startsWith('view-source:');
}

// 🔐 Step 2: Request JWT from the webpage via content script
async function fetchToken() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !isSafeTab(tab.url)) {
    // If we can't talk to the tab, just load what we have in storage
    chrome.storage.local.get("token", (res) => {
      updateConnectionStatus(res.token);
    });
    return;
  }

  try {
    chrome.tabs.sendMessage(tab.id, { type: "REQUEST_TOKEN" }, (response) => {
      // Check for 'Receiving end does not exist' error
      if (chrome.runtime.lastError) {
        console.warn("⚠️ Content script not loaded on this tab yet. Refresh the page.");
        chrome.storage.local.get("token", (res) => {
          updateConnectionStatus(res.token);
        });
        return;
      }

      const token = response?.token;
      if (token) {
        chrome.storage.local.set({ token });
        updateConnectionStatus(token);
        console.log("✅ Token found via tab bridge");
      } else {
        chrome.storage.local.get("token", (res) => {
          updateConnectionStatus(res.token);
        });
      }
    });
  } catch (err) {
    console.error("Popup fetchToken error:", err);
  }
}

// Bookmark / force capture button
forceBtn.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  if (!tab || !isSafeTab(tab.url)) {
    forceBtn.innerHTML = "Cannot capture here";
    forceBtn.style.background = "#ef4444";
    setTimeout(() => {
      forceBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> Capture Tab';
      forceBtn.style.background = "";
    }, 2000);
    return;
  }

  const originalContent = forceBtn.innerHTML;
  forceBtn.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
    Saved!
  `;
  forceBtn.disabled = true;

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      let text = window.getSelection().toString().trim();
      if (!text || text.length < 50) {
        const structural = document.querySelector('article') || document.querySelector('main');
        text = structural ? structural.innerText : Array.from(document.querySelectorAll('p')).map(p=>p.innerText).join('\n');
      }

      const payload = {
        url: location.href,
        title: document.title,
        content: text.slice(0, 30000),
        timestamp: new Date().toISOString(),
        reason: 'manual-button'
      };
      chrome.runtime.sendMessage({ type: 'capture_light', payload });
    }
  });

  setTimeout(() => {
    forceBtn.innerHTML = originalContent;
    forceBtn.disabled = false;
  }, 2000);
});

// Load toggle setting
chrome.storage.sync.get({ enabled: true }, (res) => {
  toggle.checked = !!res.enabled;
});

toggle.addEventListener('change', () => {
  chrome.storage.sync.set({ enabled: toggle.checked });
});

// Render recent captures
function renderRecent(items) {
  recent.innerHTML = '';
  items = items || [];
  
  if (items.length === 0) {
    recent.innerHTML = '<li style="text-align:center; color:var(--text-secondary); background:transparent; border:none;">No recent captures</li>';
    return;
  }

  for (const it of items.slice(0, 8)) {
    const li = document.createElement('li');
    const time = new Date(it.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    li.innerHTML = `<span class="timestamp">${time}</span> ${it.title || it.url}`;
    li.title = it.title || it.url;
    recent.appendChild(li);
  }
}

// Initial Load
chrome.storage.local.get({ recentCaptures: [], token: null }, (res) => {
  renderRecent(res.recentCaptures);
  updateConnectionStatus(res.token);
  fetchToken();
});

// Update recent captures dynamically
chrome.runtime.onMessage.addListener((msg) => {
  if (msg?.type === 'local_capture_saved') {
    chrome.storage.local.get({ recentCaptures: [] }, (res) => renderRecent(res.recentCaptures));
  } else if (msg?.type === 'CAPTURE_FAILED') {
    forceBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
      Error
    `;
    forceBtn.style.background = "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)";
    console.error("❌ Capture failed:", msg.error);
    
    setTimeout(() => {
       forceBtn.innerHTML = `
         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
         Capture Tab
       `;
       forceBtn.style.background = "";
       forceBtn.disabled = false;
    }, 3000);
  }
});
