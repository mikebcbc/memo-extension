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
    url: "http://localhost:3001/users/content",
    datatype: 'json',
    data: JSON.stringify(content),
    headers: {
      'content-type': 'application/json',
      'Authorization': "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoiZGVtbyIsImNvbnRlbnQiOlt7ImNvbnRlbnRJZCI6IjVhMjFmMWExYmYwOGU0MjI5NTFkNDc5ZiIsInRpbWUiOjQ1NSwiY29tcGxldGVkIjp0cnVlfSx7ImNvbnRlbnRJZCI6IjVhMjZkYmVjZTdlZWZlYjJjMmRkZmIxMSIsInRpbWUiOjIyMSwiY29tcGxldGVkIjp0cnVlfSx7ImNvbnRlbnRJZCI6IjVhMjVjMTQzNjE0MzkxNDNiYzRiYTU5MSIsInRpbWUiOjM0MCwiY29tcGxldGVkIjpmYWxzZX0seyJjb250ZW50SWQiOiI1YTIxZjMyYmJmMDhlNDIyOTUxZDQ3YTAiLCJ0aW1lIjo0MjIsImNvbXBsZXRlZCI6ZmFsc2V9LHsiY29udGVudElkIjoiNWEyNmRkYjNlN2VlZmViMmMyZGRmYjM5IiwidGltZSI6MTIwMiwiY29tcGxldGVkIjpmYWxzZX1dfSwiaWF0IjoxNTEyNzc5NjMwLCJleHAiOjE1MTI3ODMyMzAsInN1YiI6ImRlbW8ifQ.XNPHRC1nqNDRQxjTCzSTTR5kkMJVQ_kLJxwqhhnK4-Q"
    },
    success: function(data) {
      console.log(data);
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