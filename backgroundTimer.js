var timer = new Tock({
  interval: 1000,
  callback: function() {
    sendCurrentTime(timer.msToTimecode(timer.lap()))
  }
});

function sendCurrentTime(time) {
  chrome.runtime.sendMessage({type: "time", timeSpent: time}, function(response) {
    console.log(response);
  });
}

// chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
//     console.log("message received: ", message);
//     sendResponse("yoyooyooyoy");
// });

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.command == "StartTimer") {
    console.log(message);
    timer.start();
  } else if (message.command == "StopTimer") {
    timer.stop();
    timer.reset();
  }
});