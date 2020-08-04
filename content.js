const selectors = {
    chatDiv : '.mKBhCf', // CSS class of chat div: mKBhCf qwU8Me RlceJe kjZr4 
    chatButton: '.l4V7wb', // CSS class of chat button: l4V7wb Fxmcue
    chatBalon: '.cM3h5d' // NSvDmb cM3h5d
  };
  const classOfOpenedChat = "kjZr4";
  const getDivChat = () => { return document.querySelector(selectors.chatDiv) };
  const getBtnChat = () => { return document.querySelector(selectors.chatButton) };
  const getBalonChat = () => { return document.querySelector(selectors.chatBalon) };
  
  
  initialConfig()
  
  /** 
   * Configuração de um observador para se o chat está aberto ou fechado 
   * Fica no loop até que ele que a pagina esteja carregada.
  */
  function initialConfig() {
    setTimeout(() => { getDivChat() ? configChatObserver() : initialConfig() }, 1000);
  }
  
  function configChatObserver(){
  
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
      showNotification(mutationRecord[mutationRecord.length - 1].addedNodes[0])
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
      if (messageElement) {
        let sender = messageElement.querySelector('.UgDTGe');
        let message = messageElement.querySelector('.xtO4Tc');
        showNotification(sender, message);
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