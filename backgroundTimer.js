var contentUrls = [];
var currentTab = null;
var currentContent = null;

$.get("http://localhost:3001/contents", function(data) {
  contentUrls = data.map(function(content) {
    return content.link;
  })
});

var timer = new Tock({
  interval: 1000,
  callback: function() {
    sendCurrentTime(timer.msToTimecode(timer.lap()))
  }
});

function sendCurrentTime(time) {
  chrome.runtime.sendMessage({type: "time", timeSpent: time});
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.command == "StartTimer") {
    console.log(contentUrls);
    currentTab = message.tabId;
    timer.start();
  } else if (message.command == "StopTimer") {
    timer.stop();
    timer.reset();
  }
});

chrome.tabs.onRemoved.addListener(function(tabId, b) {
  if (currentTab == tabId) {
    timer.stop();
    timer.reset();
  }
})