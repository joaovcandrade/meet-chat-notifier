mActive = true //state of extension?

/**
 * Ficar no loop de verificar se esta aberto ou fechado o chat
 * cada um desses estados chama a função de notificação
 */


//translation of extensio (pt: portuguese, en: english)
const translation = {
  pt: { enable: "Notificações", enableMsg: "Assegure-se de que<br> as notificações em seu computador estão ativas.<br> Clique no ícone da extensão <br>para ver mais informações." },
  en: { enable: "Notifications", enableMsg: "Make sure notifications<br> on your computer are enabled.<br> Click the extension icon<br> for more information." }
}

//Get lang of meet html
var lang = document.documentElement.lang.split('-')[0]
if (!translation[lang]) { lang = 'en' }


const selectors = {
  ariaLive: '[aria-live=polite]:not([aria-atomic])',
  chatBalloon: '.NSvDmb',
  actionButtons: '[data-tooltip][data-is-muted]',
  participantId: '[data-initial-participant-id]',
  topButtons: '[data-tooltip][data-tab-id]'
};

const getAriaLive = () => { return document.querySelector(selectors.ariaLive) }; //Open chat area-live
const getBalloonChat = () => { return document.querySelector(selectors.chatBalloon) }; //Closed chat area-live (baon)
const getTopButtons = () => { return document.querySelectorAll(selectors.topButtons) };
const getParticipantId = () => { return document.querySelector(selectors.participantId) };
const getActionButtons = () => {
  let b = document.querySelector(selectors.actionButtons)
  return b ? b.parentNode.parentNode.parentNode.parentNode : null
};


initialConfig()

//Wait meeting start
function initialConfig() {

  setTimeout(() => { getParticipantId() ? initialize() : initialConfig() }, 1000);
}


function initialize() {

  //Observer balloon messages.
  configClosedChatObserver();

  //Listen top meet buttons for start observer of opened chat messages.
  getTopButtons().forEach(el => {
    el.addEventListener('click', () => {
      configOpenedChatObserver()
    })
  })

  //Switch element on bottom bar (on/off).
  createOption();
}

//Switch create element to on/off notifications, and append to meet bar.
function createOption() {
  //check if ShadowDOM
  if (!document.body.createShadowRoot) {
    //Add switch (shadowDOM Webcomponent to avoid other css/extensions interference) to bottom bar
    let bottomBar = getActionButtons().parentElement;
    let temp = document.createElement('div')
    temp.id = 'host'
    bt = bottomBar.childNodes[2].prepend(temp);


    elShadow = document.querySelector("#host").attachShadow({ mode: 'closed' });

    let el = document.createElement('div');

    el.innerHTML = `
      <style>
        .switch {
          position: relative;
          display: inline-block;
          width: 48px;
          height: 27.2px;
          top: 4px;
        }
        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        .slider {
          position: absolute;
          cursor: pointer;
          top: -1px;
          left: 0;
          right: -8px;
          bottom: 0;
          background-color: #ccc;
          -webkit-transition: .4s;
          transition: .4s;
        }
        .slider:before {
          position: absolute;
          content: "";
          height: 20.8px;
          width: 20.8px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          -webkit-transition: .4s;
          transition: .4s;
        }
        input:checked + .slider {
          background-color: #2196F3;
        }
        input:focus + .slider {
          box-shadow: 0 0 1px #2196F3;
        }
        input:checked + .slider:before {
          -webkit-transform: translateX(26px);
          -ms-transform: translateX(26px);
          transform: translateX(26px);
        }
        .slider.round {
          border-radius: 34px;
        }
        .slider.round:before {
          border-radius: 50%;
        }
        .tooltip {
          position: relative;
          display: inline-block;
        }

        .tooltip .tooltiptext {
          visibility: hidden;
          width: auto;
          bottom: 100%;
          background-color: black;
          color: #fff;
          text-align: center;
          padding: 5px;
          margin-left: -60px;
          left: 50%;
          border-radius: 6px;
          position: absolute;
          z-index: 1;
        }

        .tooltip:hover .tooltiptext {
          visibility: visible;
        }
        .container {
          display: flex;
          flex-direction: column;
          align-content: center;
        }
        .container .btn {
          display: flex;
          justify-content: center;
        }
        .text {
          color: #3c4043;
          font-family: 'Google Sans',Roboto,Arial,sans-serif;
          font-size: 13px;
          font-weight: 500;
        }
      </style>
      <div class="container">
        <label class="text">${translation[lang].enable}</label>
        <div class="btn">
          <label class="switch tooltip">
            <input type="checkbox" id="ck-notif" name="notif-chk" checked>
            <span class="slider round"></span>
            <span class="tooltiptext">${translation[lang].enableMsg}</span>
          </label>
        </div>
      </div>
      `

    elShadow.prepend(el)

    /*
    Event when switch 'change'
    The state is inverted. A message is sent to the bottom to clear the list of notifications
    */
    elShadow.querySelector("#ck-notif").addEventListener('change', () => {
      mActive = !mActive
      if (!mActive) {
        chrome.runtime.sendMessage({
          type: "clean"
        })
      }
    })
  }
}



//Observer to get messages (sender name, message text) from aria-live, when te chat is opened and the notifications state is on
function configOpenedChatObserver() {
  if (getAriaLive()) {
    let callback = (mutationRecord, observer) => {
      if (mutationRecord.length == 1) {
        let messageElement = mutationRecord[mutationRecord.length - 1].addedNodes[0];
        if (messageElement && mActive) {
          if (messageElement.dataset.senderName) {
            senderName = messageElement.dataset.senderName
            message_text = messageElement.lastChild.innerText
          } else {
            senderName = messageElement.parentElement.parentNode.dataset.senderName
            message_text = messageElement.innerText
          }
          showNotification(senderName, message_text);
        }
      }

    };

    const observer = new MutationObserver(callback);

    const config = {
      childList: true,
      subtree: true
    };

    observer.observe(getAriaLive(), config);
  }

}


/*Observer to to get messages (sender name, message text) from aria-live of balloon*/
function configClosedChatObserver() {
  function callback(mutationRecord, observer) {
    let messageElement = mutationRecord[mutationRecord.length - 1].addedNodes[0];
    if (messageElement && mActive) {
      let sender = messageElement.querySelector('.UgDTGe');
      let message = messageElement.querySelector('.xtO4Tc');
      showNotification(sender.innerText, message.innerText);
    }
  }

  const observer = new MutationObserver(callback);

  const config = {
    childList: true,
    subtree: true
  };
  observer.observe(getBalloonChat(), config);
}


//Send to backgroung the sender name and the message to background
function showNotification(sender, message) {

  var opt = {
    type: "basic",
    title: sender,
    iconUrl: 'img_notification.png',
    message: message,
    silent: true,
    priority: 2
  };

  chrome.runtime.sendMessage({
    type: "notification",
    opt: opt
  }, function () { });


}