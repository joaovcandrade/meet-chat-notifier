mActive = true //Botão do chat?

/**
 * Ficar no loop de verificar se esta aberto ou fechado o chat
 * cada um desses estados chama a função de notificação
 */


const translation = {
  pt: {enable:"Ativar notificações"},
  en: {enable:"Enable notifications"}
}

var lang = document.documentElement.lang.split('-')[0]
if (!translation[lang]) {lang = 'en'}

const selectors = {
  chatDiv : '.mKBhCf', // CSS class of chat div: mKBhCf qwU8Me RlceJe kjZr4 
  chatButton: '.l4V7wb', // CSS class of chat button: l4V7wb Fxmcue
  chatBalon: '.cM3h5d', // NSvDmb cM3h5d
  optionBar: '.q2u11' //
};

const classOfOpenedChat = "kjZr4";
const getDivChat = () => { return document.querySelector(selectors.chatDiv) };
const getBtnChat = () => { return document.querySelector(selectors.chatButton) };
const getBalonChat = () => { return document.querySelector(selectors.chatBalon) };
const getOptionBar = () => { return document.querySelector(selectors.optionBar)}

initialConfig()

/** 
 * Configuração de um observador para se o chat está aberto ou fechado 
 * Fica no loop até que ele que a pagina esteja carregada.
*/
function initialConfig() {
  setTimeout(() => { getDivChat() ? configChatObserver() : initialConfig() }, 1000);
}

function createOption(){
  el = document.createElement('div');
  el.innerHTML = 
  `<div>
  <input type="checkbox" id="ck-notif" name="notif-chk" checked>
  <label for="notif-chk">${translation[lang].enable}</label>
  </div>`

  getOptionBar().prepend(el)

  document.querySelector("#ck-notif").addEventListener('change', ()=>{
      mActive = !mActive
  })
}

function configChatObserver(){

  createOption()

  let callback = (mutationRecord, observer) => {
    if ( getDivChat().className.includes(classOfOpenedChat) ) {
      observableChatOpened();
    } else {
      observableChatClosed();
    }
  };

  const observer = new MutationObserver(callback);
  const config = {
    childList: true,
    subtree: true
  };
  observer.observe(getDivChat(), config);
  callback();
}


function observableChatOpened() {
  function callback(mutationRecord, observer) {
    let messageElement = mutationRecord[mutationRecord.length - 1].addedNodes[0];
    if(messageElement && mActive){
      if(messageElement.dataset && messageElement.dataset.senderName){
        senderName = messageElement.dataset.senderName
        message_text = messageElement.lastChild.innerText
      }else{
        senderName = messageElement.parentElement.parentNode.dataset.senderName
        message_text = messageElement.innerText
      }
      showNotification(senderName, message_text);
    }
  }

  const observer = new MutationObserver(callback);

  const config = {
    childList: true,
    subtree: true
  };
  observer.observe(getDivChat(), config);
}

function observableChatClosed() {
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
    type: "shownotification",
    opt: opt
  }, function () {});


}