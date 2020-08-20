//messagesId = []
messages = []
watching = false

function getNotificationId() {
  var id = (Date.now() * 100) + 1;
  return id.toString();
}


//Create notification
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  
  if(request.type == "notification"){
    messages.push(request.opt) //add to Queque of messages

  if (!watching) { //If the message queue is still not being watched
    watching = true
    
    notifier() //Start the notifier queque
  }

  sendResponse(true);

  }
});


//Clean notifications
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if(request.type == "clean"){

    messages = [] //clear messages queque

    /*while(messages > 0){ //clear already launched messages saved in the queue
      chrome.notifications.clear(messagesId.shift(), () => {})
    }*/     
    } 

  sendResponse(true);
  
});


function notifier() {

    if (messages.length > 0) {

      nId = getNotificationId()

      //Create the next queue notification
      notification = chrome.notifications.create(nId, messages.shift(), function (nId) {

        //Clean notification
          setTimeout(function (_nId) {
            chrome.notifications.clear(_nId, () => {
              notifier()
            })
          }, 4000, nId);

      })

    }else{
      watching = false
    }
    
  

}




