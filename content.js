button = 0

wait_buttons()


function wait_buttons(){

    setTimeout(function(){ 

        button = document.querySelector('#ow3 > div.T4LgNb > div > div:nth-child(4) > div.crqnQb > div.pHsCke > div.Jrb8ue > div > div.NzPR9b > div:nth-child(3)')

        if(button){

            button.click()
            
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

function notifier_btn(){

    button.addEventListener('click', ()=>{

        target = document.querySelector(".z38b6");
        observer.observe(target, config);

    })
    
    var target = document.querySelector(".z38b6");
    
    function callback(mutationRecord, observer) {

            showNotification(mutationRecord[mutationRecord.length-1].addedNodes[0])

    }
    
    const observer = new MutationObserver(callback);
    
    const config = {
      childList: true,
      subtree: true
    };
    
    observer.observe(target, config);

}

function showNotification(message){
 

            if(message.dataset.senderName){
                senderName = message.dataset.senderName
                message_text = message.lastChild.innerText
            }else{
                senderName = message.parentElement.parentNode.dataset.senderName
                message_text = message.innerText
            }

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

