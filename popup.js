 
document.querySelectorAll('[data-translate]').forEach(el=>{
    el.innerText = chrome.i18n.getMessage(el.getAttribute('data-translate'));
})

document.querySelectorAll('[data-translate-url]').forEach(el=>{
    el.href = chrome.i18n.getMessage(el.getAttribute('data-translate-url'));
    el.target="_blank"
})
