chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.type == "time") {
      $('#clock').val(message.timeSpent);
    } else {
      console.log("message received: ", message);
      sendResponse("yoyooyooyoy");
    }
});

document.addEventListener('DOMContentLoaded', () => {  
  var currentTabUrl;
  chrome.tabs.getSelected(null, function(tab) {
    currentTab = tab;
  });

  $('#start').on('click', function() {
    chrome.runtime.sendMessage({command: "StartTimer", tabId: currentTab.id, tabUrl: currentTab.url});
  });

  $('#stop').on('click', function () {
    chrome.runtime.sendMessage({command: "StopTimer"});
  });
});