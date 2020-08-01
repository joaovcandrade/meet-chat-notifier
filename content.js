button = 0
wait_buttons()



function wait_buttons(){

    setTimeout(function(){ 

        let _button = document.querySelector('#ow3 > div.T4LgNb > div > div:nth-child(4) > div.crqnQb > div.pHsCke > div.Jrb8ue > div > div.NzPR9b > div:nth-child(3)')

        if(_button){

            _button.click()

            button = _button

            
            chat_wait()
            
        }else{

            wait_buttons()
        }
        
    
    }, 1000);
}

function chat_wait(){

    

    setTimeout(function(){ 

        let _target = document.querySelector(".z38b6");

        if(_target){

            notifier_btn()

        }else{

            chat_wait()
        }

    }, 1000);

}

function notifier_baloon(){
    
    var target = document.querySelector("#ow3 > div.T4LgNb > div > div:nth-child(4) > div.crqnQb > div.NSvDmb.cM3h5d");
    
    function callback(mutationRecord, observer) {

            showNotification('balloon',mutationRecord[0].addedNodes[0].parentNode)
            
    
    }
    
    const observer = new MutationObserver(callback);
    
    const config = {
      childList: true,
      sutree: true
    };
    
    observer.observe(target, config);

}

function notifier_btn(){

    button.addEventListener('click', ()=>{

        target = document.querySelector(".z38b6");
        observer.observe(target, config);

    })
    
    var target = document.querySelector(".z38b6");
    
    function callback(mutationRecord, observer) {


            showNotification('chat',mutationRecord[mutationRecord.length-1].addedNodes[0])
            
    
    }
    
    const observer = new MutationObserver(callback);
    
    const config = {
      childList: true,
      subtree: true
    };
    
    observer.observe(target, config);

}

function getNotificationId() {
    var id = Math.floor(Math.random() * 9007199254740992) + 1;
    return id.toString();
  }

function showNotification(type,message){

    if(type == 'chat'){

        if(message.dataset.senderName){
            senderName = message.dataset.senderName
            message_text = message.lastChild.innerText
        }else{
            senderName = message.parentElement.parentNode.dataset.senderName
            message_text = message.innerText
        }
    }

    if(type == 'balloon'){
        
        senderName = message.querySelectorAll("div > span > span > div > div.UgDTGe").innerText
        message_text = message.querySelectorAll("div > span > span > div > div.mVuLZ").innerText
    }


        console.log(senderName,message_text)
  
        var opt = {
            type: "basic",
            title: senderName,
            iconUrl: 'img_notification.png',
            message: message_text,
            silent: true,
            priority: 2
        };

        chrome.runtime.sendMessage({type: "shownotification", opt: opt}, function(){});
    
    


}

