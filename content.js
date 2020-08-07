mActive = true //estado?

/**
 * Ficar no loop de verificar se esta aberto ou fechado o chat
 * cada um desses estados chama a função de notificação
 */


const translation = {
  pt: { enable: "Ativar notificações", enableMsg: "Para receber as notificações, <br>mantenha o chat aberto.<br> Clique no ícone da extensão <br>para ver mais informações." },
  en: { enable: "Enable notifications", enableMsg: "To receive notifications, <br>keep the chat open.<br> Click the extension <br>icon for more information." }
}

var lang = document.documentElement.lang.split('-')[0]
if (!translation[lang]) { lang = 'en' }

const selectors = {
  ariaLive: '[aria-live=polite]:not([aria-atomic])', // CSS class of chat div: mKBhCf qwU8Me RlceJe kjZr4 
  chatBalon: '.NSvDmb', // NSvDmb cM3h5d
  actionButtons: '[data-tooltip][data-is-muted]', //
  participantId: '[data-initial-participant-id]',
  topButtons: '[data-tooltip][data-tab-id]'
};

const getAriaLive = () => { return document.querySelector(selectors.ariaLive) };
const getBalonChat = () => { return document.querySelector(selectors.chatBalon) };
const getTopButtons = () => { return document.querySelectorAll(selectors.topButtons) };
const getParticipantId = () => { return document.querySelector(selectors.participantId) };
const getActionButtons = () => {
  let b = document.querySelector(selectors.actionButtons)
  return b ? b.parentNode.parentNode.parentNode.parentNode : null
};


initialConfig()

/** 
 * Configuração de um observador para se o chat está aberto ou fechado 
 * Fica no loop até que ele que a pagina esteja carregada.
*/
function initialConfig() {

  setTimeout(() => { getParticipantId() ? initialize() : initialConfig() }, 1000);
}

function createOption() {
  let el = document.createElement('div');
  el.innerHTML =`
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
      background-color: black;
      color: #fff;
      text-align: center;
      padding: 5px;
      margin-left: 20%;
      border-radius: 6px;
    
      /* Position the tooltip text - see examples below! */
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
  console.log(getActionButtons());
  console.log(el);
  let bottomBar = getActionButtons().parentElement;
  bottomBar.childNodes[2].prepend(el);

  document.querySelector("#ck-notif").addEventListener('change', () => {
    mActive = !mActive
    if(!mActive){
      chrome.runtime.sendMessage({
        type: "clean"
      })
    }
  })
}

function initialize() {
  configClosedChatObserver();

  getTopButtons().forEach(el => {
    el.addEventListener('click', () => {
      configOpenedChatObserver()
    })
  })

  createOption();

}

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



function configClosedChatObserver() {
  function callback(mutationRecord, observer) {
    let messageElement = mutationRecord[mutationRecord.length - 1].addedNodes[0];
    if (messageElement && mActive) {
      console.log(mutationRecord)
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
  observer.observe(getBalonChat(), config);
}


// Recebe a mensagem a ser notificada
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