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

// 🔐 Step 2: Request JWT from the webpage via content script
async function fetchToken() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) return;

  chrome.tabs.sendMessage(tab.id, { type: "REQUEST_TOKEN" }, (response) => {
    const token = response?.token;
    if (token) {
      chrome.storage.local.set({ token });
      console.log("✅ Token saved in extension:", token);
    } else {
      console.warn("⚠️ No token found — opening login page");
      chrome.tabs.create({ url: "http://localhost:5173/" }); // or deployed login
    }
  });
}

// Call fetchToken when popup opens
fetchToken();

// Bookmark / force capture button
forceBtn.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) return;

  const originalText = forceBtn.textContent;
  forceBtn.textContent = "✅ Bookmarked!";
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
        selection: text.slice(0, 20000),
        timestamp: new Date().toISOString(),
        reason: 'manual_popup'
      };
      chrome.runtime.sendMessage({ type: 'capture_light', payload });
    }
  });

  setTimeout(() => {
    forceBtn.textContent = originalText;
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
  for (const it of items.slice(0, 8)) {
    const li = document.createElement('li');
    li.textContent = `${new Date(it.timestamp).toLocaleTimeString()} - ${it.title || it.url}`;
    recent.appendChild(li);
  }
}

chrome.storage.local.get({ recentCaptures: [] }, (res) => renderRecent(res.recentCaptures));

// Update recent captures dynamically
chrome.runtime.onMessage.addListener((msg) => {
  if (msg?.type === 'local_capture_saved') {
    chrome.storage.local.get({ recentCaptures: [] }, (res) => renderRecent(res.recentCaptures));
  }
});
