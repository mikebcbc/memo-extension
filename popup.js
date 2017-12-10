chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.type == "time") {
      $('#clock').html(message.timeSpent);
    } else {
      console.log("message received: ", message);
    }
});

document.addEventListener('DOMContentLoaded', () => {  
  var currentTabUrl = null;
  var authToken = null;

  chrome.storage.sync.get('authToken', function(data) {
    if (typeof data.authToken !== undefined) {
      authToken = data.authToken;
      chrome.runtime.sendMessage({command: "SetToken", authToken: data.authToken});
      showClockView();
    }
  });

  function showClockView() {
    $('.login-view').hide();
    $('.clock-view').show().css('display', 'flex');
  }

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
        chrome.storage.sync.set({'authToken': data.authToken});
        chrome.runtime.sendMessage({command: "SetToken", authToken: data.authToken});
        showClockView();
      }
    });
  })

  // Timer & tab logic
  chrome.tabs.getSelected(null, function(tab) {
    currentTab = tab;
  });

  // $('#start').on('click', function() {
  //   chrome.runtime.sendMessage({command: "StartTimer", tabId: currentTab.id, tabUrl: currentTab.url});
  // });

  // $('#stop').on('click', function () {
  //   chrome.runtime.sendMessage({command: "StopTimer"});
  // });
});