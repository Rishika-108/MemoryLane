// Runs in page context (isolated world). Collects title, url, selection and notifies background.
(function(){
function getSelectedText(){
const s = window.getSelection();
return s ? s.toString().slice(0, 20000) : '';
}


// send a lightweight message to background whenever user selects text or navigates
let lastUrl = location.href;


function captureEvent(reason){
const payload = {
url: location.href,
title: document.title || '',
selection: getSelectedText(),
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