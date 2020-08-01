messagesId = []

function getNotificationId() {
    var id = (Date.now() * 100) + 1;
    return id.toString();
  }

//Create notification
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    
    nId = getNotificationId()
    notification = chrome.notifications.create(nId, request.opt, function(nId){

      messagesId.push(nId)

      //Remove notification
      setTimeout(function() {
        chrome.notifications.clear(messagesId.shift() , ()=>{})
      }, 3000);
      

    })
    
    sendResponse(request.opt);
});