const toggle = document.getElementById('toggle');
const forceBtn = document.getElementById('force');
const recent = document.getElementById('recent');


// load setting
chrome.storage.sync.get({enabled:true}, (res) => {
toggle.checked = !!res.enabled;
});


toggle.addEventListener('change', () => {
chrome.storage.sync.set({enabled: toggle.checked});
});


forceBtn.addEventListener('click', async () => {
const [tab] = await chrome.tabs.query({active:true, currentWindow:true});
if(!tab) return;
chrome.scripting.executeScript({
target: {tabId: tab.id},
func: () => {
// force a capture by sending a message from content script context
const payload = {
url: location.href,
title: document.title,
selection: window.getSelection().toString().slice(0,20000),
timestamp: new Date().toISOString(),
reason: 'manual_popup'
};
chrome.runtime.sendMessage({type:'capture_light', payload});
}
});
});


// show recent light captures saved in local storage
function renderRecent(items){
recent.innerHTML = '';
items = items || [];
for(const it of items.slice(0,8)){
const li = document.createElement('li');
li.textContent = `${new Date(it.timestamp).toLocaleTimeString()} - ${it.title || it.url}`;
recent.appendChild(li);
}
}


chrome.storage.local.get({recentCaptures:[]}, (res)=> renderRecent(res.recentCaptures));


// listen for incoming captures to append to popup list
chrome.runtime.onMessage.addListener((msg) => {
if(msg?.type === 'local_capture_saved'){
chrome.storage.local.get({recentCaptures:[]}, (res)=> renderRecent(res.recentCaptures));
}
});