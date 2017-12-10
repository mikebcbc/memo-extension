chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.type == "time") {
      $('#clock').html(message.timeSpent);
    } else {
      console.log("message received: ", message);
    }
});

document.addEventListener('DOMContentLoaded', () => {  
  var currentTabUrl = null;
  
  function showClockView() {
    $('.login-view').hide();
    $('.clock-view').show().css('display', 'flex');
  };

  function showLoginView() {
    $('.clock-view').hide();
    $('.login-view').show().css('display', 'flex');
  }

  // Timer & tab logic
  chrome.tabs.getSelected(null, function(tab) {
    currentTab = tab;
  });

  // Authentication logic
  chrome.storage.sync.get('authToken', function(data) {
    if (data.authToken !== undefined) {
      chrome.runtime.sendMessage({command: "SetToken", authToken: data.authToken});
      showClockView();
    }
  });

  chrome.storage.onChanged.addListener(function(changes, areaName) {
    if (areaName == 'sync' && changes.authToken.oldValue) {
      chrome.runtime.sendMessage({command: "SetToken", authToken: null});
      showLoginView();
    }
  });

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

  $('.logout').click(function() {
    chrome.storage.sync.remove('authToken');
  })
});