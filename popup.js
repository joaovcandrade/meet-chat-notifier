var locales = {
    "pt":{
        "message": "Mantenha o chat do Google Meet aberto para receber as notifiações.",
        "site_message": "Site da extensão",
        "site_url": "https://sites.google.com/view/meet-chat-notifier",
        "faq_message":"Perguntas frequentes",
        "faq_url": "https://sites.google.com/view/meet-chat-notifier/perguntas-frequentes",
        "faq_1": "Notificações acima de vídeos e apresentações em tela cheia (Windows 10)",
        "faq_1_url": "https://sites.google.com/view/meet-chat-notifier/perguntas-frequentes#h.fmx4weu5ktoy"    
    },            
    "en":{
        "message": "Keep the Google Meet chat open to receive notifications.",
        "site_message": "extension website",
        "site_url": "https://sites.google.com/view/meet-chat-notifier",
        "faq_message":"FAQ",
        "faq_url": "https://sites.google.com/view/meet-chat-notifier/perguntas-frequentes",
        "faq_1": "Notifications above videos and full-screen presentations (Windows 10)",
        "faq_1_url": "https://sites.google.com/view/meet-chat-notifier/perguntas-frequentes#h.fmx4weu5ktoy"
    }
};    
var lang = navigator.language.split('-')[0] || navigator.userLanguage.split('-')[0]
if (!locales[lang]) { lang = 'en' }
lang = 'pt'    
console.log(document.querySelectorAll('[data-translate]'))
document.querySelectorAll('[data-translate]').forEach(el=>{
    el.innerText = locales[lang][el.getAttribute('data-translate')];
})
document.querySelectorAll('[data-translate-url]').forEach(el=>{
    el.href = locales[lang][el.getAttribute('data-translate-url')];
    el.addEventListener('click',(e)=>{
        console.log(e)
        chrome.tabs.create({url: `${e.target.getAttribute('href')}`});
    })
})
