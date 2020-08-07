messagesId = []
messages = []
watching = false

function getNotificationId() {
  var id = (Date.now() * 100) + 1;
  return id.toString();
}


//Create notification
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if(request.type == "notification"){
    messages.push(request.opt)

  if (!watching) {
    watching = true
    notifier()
  }

  sendResponse(true);

  }
});


//Clean notifications
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if(request.type == "clean"){

    messages = [] //clear

    while(messages > 0){ //clear
      chrome.notifications.clear(messagesId.shift(), () => {})
    }      
    }

  sendResponse(true);
  
});

function notifier() {

  setInterval(() => {

    if (messages.length > 0) {

      nId = getNotificationId()

      notification = chrome.notifications.create(nId, messages.shift(), function (nId) {

        messagesId.push(nId)

        setTimeout(function () {
          chrome.notifications.clear(messagesId.shift(), () => { })
        }, 4000);

      })

    }
  }, 3000);

}




