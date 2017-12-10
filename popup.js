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

  $('.login-form').submit(function(e) {
    e.preventDefault();
    var loginInfo = {
      "username": $('#username').val(),
      "password": $('#password').val()
    };

    $.ajax({
      type: "POST",
      url: "http://localhost:3001/auth/login",
      datatype: 'json',
      data: JSON.stringify(loginInfo),
      headers: {
        'content-type': 'application/json'
      },
      success: function(data) {
        console.log(data);
      }
    });
  })

  // Timer & tab logic
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