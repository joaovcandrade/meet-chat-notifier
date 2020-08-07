mActive = true //estado?

/**
 * Ficar no loop de verificar se esta aberto ou fechado o chat
 * cada um desses estados chama a função de notificação
 */


const translation = {
  pt: { enable: "Ativar notificações", enableMsg: "Para receber as notificações, mantenha o chat aberto.<br> Clique no ícone da extensão para ver mais informações." },
  en: { enable: "Enable notifications", enableMsg: "To receive notifications, keep the chat open.<br> Click the extension icon for more information." }
}

var lang = document.documentElement.lang.split('-')[0]
if (!translation[lang]) { lang = 'en' }

const selectors = {
  ariaLive: '[aria-live=polite]:not([aria-atomic])', // CSS class of chat div: mKBhCf qwU8Me RlceJe kjZr4 
  //chatBalon: '[aria-atomic]', // NSvDmb cM3h5d
  actionButtons: '[data-tooltip][data-is-muted]', //
  participantId: '[data-initial-participant-id]',
  topButtons: '[data-tooltip][data-tab-id]'
};

const getAriaLive = () => { return document.querySelector(selectors.ariaLive) };
//const getBalonChat = () => { return document.querySelector(selectors.chatBalon) };
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
  el.innerHTML =
    `<div>
  <style>
  .tooltip {
    position: relative;
    display: inline-block;
    border-bottom: 1px dotted black;
  }
  
  .tooltip .tooltiptext {
    visibility: hidden;
    background-color: black;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 5px;
    word-wrap: break-word;
    display: inline;
    position: absolute;
    z-index: 999;
  }
  
  .tooltip:hover .tooltiptext {
    visibility: visible;
  }
  </style>
  <div>
  <input type="checkbox" id="ck-notif" name="notif-chk" checked>
  <label class="tooltip" for="notif-chk">${translation[lang].enable}
  <span class="tooltiptext">${translation[lang].enableMsg}</span>
  </label>
  </div>
  </div>`

  getActionButtons().prepend(el)

  document.querySelector("#ck-notif").addEventListener('change', () => {
    mActive = !mActive
  })
}

function initialize() {

  //observableChatClosed()
  console.log(getTopButtons())
  getTopButtons().forEach(el => {
    el.addEventListener('click', () => {
      configChatObserver()
    })
  })

  createOption();

}

function configChatObserver() {
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



/*   function observableChatClosed() {
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
}  */


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
    opt: opt
  }, function () { });


}