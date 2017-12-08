chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.type == "time") {
      console.log(message.timeSpent);
    } else {
      console.log("message received: ", message);
      sendResponse("yoyooyooyoy");
    }
});

document.addEventListener('DOMContentLoaded', () => {  
  var currentTabUrl;
  chrome.tabs.getSelected(null, function(tab) {
    currentTab = tab.url;
  });

  $('#start').on('click', function() {
    chrome.runtime.sendMessage({command: "StartTimer", content: currentTabUrl});
  });

  $('#stop').on('click', function () {
    chrome.runtime.sendMessage({command: "StopTimer"});
  });
});