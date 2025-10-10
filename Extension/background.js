// background service worker: receives light capture events, optionally takes screenshot and forwards to backend
const BACKEND_URL = 'http://localhost:4000/api/capture'; // change to your server


// throttle / debounce captures per tab to avoid spam
const lastCaptureAt = {}; // tabId -> timestamp
const CAPTURE_INTERVAL_MS = 30_000; // at most once every 30s per tab


chrome.runtime.onMessage.addListener((message, sender) => {
if(message?.type === 'capture_light'){
handleLightCapture(message.payload, sender.tab).catch(console.error);
}
});


async function handleLightCapture(payload, tab){
try{
const tabId = tab?.id;
const now = Date.now();
if(tabId){
const last = lastCaptureAt[tabId] || 0;
if(now - last < CAPTURE_INTERVAL_MS) return; // skip frequent
lastCaptureAt[tabId] = now;
}


// request a visible tab screenshot (requires activeTab or tabs permission)
let screenshotDataUrl = null;
try{
const captureOpts = {format: 'png'};
screenshotDataUrl = await chrome.tabs.captureVisibleTab(tab?.windowId, captureOpts);
}catch(err){
console.warn('screenshot failed', err);
}


const body = {
url: payload.url,
title: payload.title,
selection: payload.selection,
timestamp: payload.timestamp,
reason: payload.reason,
screenshot: screenshotDataUrl
};


// send to backend
await fetch(BACKEND_URL, {
method: 'POST',
headers: {'Content-Type':'application/json'},
body: JSON.stringify(body)
});


// optional: show a quiet notification
// chrome.notifications.create({type:'basic', iconUrl:'icon.png', title:'Memory Lane', message:'Captured page'});
}catch(e){
console.error('handleLightCapture error', e);
}
}


// alarm to cleanup old capture timestamps
chrome.alarms.create('cleanup', {periodInMinutes: 10});
chrome.alarms.onAlarm.addListener(() => {
const now = Date.now();
for(const k of Object.keys(lastCaptureAt)){
if(now - lastCaptureAt[k] > 60*60*1000) delete lastCaptureAt[k];
}
});