var authToken = null;
var contentArr = [];
var currentTab = null;
var currentContent = null;
var timer = new Tock({
  interval: 1000,
  callback: function() {
    sendCurrentTime(timer.msToTimecode(timer.lap()))
  }
});

$.get("http://localhost:3001/contents", function(data) {
  contentArr = data.map(function(content) {
    return {url: content.link, id: content._id};
  })
});

function sendCurrentTime(time) {
  chrome.runtime.sendMessage({type: "time", timeSpent: time});
}

function postContent(content) {
  $.ajax({
    type: "POST",
    url: "https://secret-island-23486.herokuapp.com/users/content",
    datatype: 'json',
    data: JSON.stringify(content),
    headers: {
      'content-type': 'application/json',
      'Authorization': "Bearer " + authToken
    },
    success: function(data) {
      $.ajax({
        type: 'GET',
        url: "https://secret-island-23486.herokuapp.com/users/io/" + data.contentId,
        headers: {
          'Authorization': "Bearer " + authToken
        },
        success: function() {
          console.log('IO updated');
        }
      })
    }
  });
};

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
  var content = contentArr.find(function(content) {
    return changeInfo.url == content.url;
  });
  if (content && currentTab === null) {
    currentTab = tabId;
    currentContent = content;
    timer.start();
    console.log('URL exists, applicable content');
  } else {
    console.log('doesnt');
  }
})

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.command == "StartTimer") {
    currentTab = message.tabId;
    timer.start();
  } else if (message.command == "StopTimer") {
    currentTab = null;
    timer.stop();
    timer.reset();
  } else if (message.command == "SetToken") {
    authToken = message.authToken;
  }
});

chrome.tabs.onRemoved.addListener(function(tabId, b) {
  if (currentTab == tabId) {
    postContent({
      "content": currentContent.id,
      "time": (timer.lap() / 1000) / 60 ,
      "completed": false
    });
    currentTab = null;
    currentContent = null;
    timer.stop();
    timer.reset();
  }
})