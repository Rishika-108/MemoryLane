// Runs in page context (isolated world). Collects title, url, selection and notifies background.
// Listen for token requests from popup
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "REQUEST_TOKEN") {
    // Get token from website's localStorage
    const token = localStorage.getItem("token") || null;
    sendResponse({ token });
  }
  return true; // keeps sendResponse valid for async
});



(function(){
function getReadableText() {
  const s = window.getSelection().toString().trim();
  if (s && s.length > 50) return s.slice(0, 20000);

  // Fallback 1: Core <article> tag containing the heavy payload
  const article = document.querySelector('article');
  if (article && article.innerText.length > 150) {
    return article.innerText.slice(0, 20000);
  }

  // Fallback 2: <main> container to avoid navbars/menus
  const main = document.querySelector('main, [role="main"], .main-content, #main-content');
  if (main && main.innerText.length > 150) {
    return main.innerText.slice(0, 20000);
  }

  // Fallback 3: Isolate and concat P and Headings nodes 
  const paragraphs = Array.from(document.querySelectorAll('p, h1, h2, h3, li'));
  const text = paragraphs.map(p => p.innerText.trim()).filter(t => t.length > 20).join('\n');
  return text.slice(0, 20000);
}


// send a lightweight message to background whenever user selects text or navigates
let lastUrl = location.href;

function captureEvent(reason){
const textContent = getReadableText();
// Prevent spam tracking: Only submit payload if it has genuine content to summarize
if(!textContent || textContent.trim().length < 50) return;

const payload = {
url: location.href,
title: document.title || '',
selection: textContent,
timestamp: new Date().toISOString(),
reason
};
// send to extension background
chrome.runtime.sendMessage({type: 'capture_light', payload});
}


// capture on selection change
document.addEventListener('selectionchange', () => {
const sel = getSelectedText();
if(sel && sel.length > 5){
captureEvent('selection');
}
});


// capture when page loads or URL changes (single-page apps)
const observer = new MutationObserver(() => {
if(location.href !== lastUrl){
lastUrl = location.href;
captureEvent('navigation');
}
});
observer.observe(document, {subtree: true, childList: true});


// also expose a small context-menu style trigger: double-press Ctrl+M to force capture
window.addEventListener('keydown', (e) => {
if(e.ctrlKey && e.key === 'm'){
captureEvent('manual-shortcut');
}
});
})();