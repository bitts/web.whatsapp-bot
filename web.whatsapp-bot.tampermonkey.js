// ==UserScript==
// @name         WhatsApp Web - Chat Bot
// @namespace    WACB
// @version      0.1
// @description  A chat bot for WhatsApp Web, with some basic commands. Check console for log.
// @author       bitts (marcelo.valvassori@gmail.com)
// @match        https://web.whatsapp.com/*
// @icon         https://www.google.com/s2/favicons?domain=whatsapp.com
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-idle
// ==/UserScript==

var jBWW = {
    debug : true,
    escutando : false,
    refresh : 5000,
    about : {
        'author' : 'Marcelo Valvassori Bittencourt',
        'supportURL':'https://github.com/bitts/web.whatsapp-bot/blob/main/web.whatsapp-bot.js',
        'create':'2021-06-03',
        'description':'Bot Javascript de respostas para Whatsapp.',
        'name':'[HK]Bot WebWhatsapp Javascript',
        'namespace':'mbitts.com',
        'version' : '1.0'
    },
    init : function(){
        if(jBWW.debug)jBWW.log("Carregando script do chat-bot");
        var escutando = setInterval(function() {
            jBWW.call();
        }, jBWW.refresh);

    },
    log : function(txt){
        if(jBWW.debug){
            let tm = new Date().toLocaleString();
            console.log('[jBWW]['+ tm +']', txt);
        }
    },
    call : function(){
        var obj = jBWW.toListenWW();
        [].forEach.call(obj, function(o) {
            if(!o.user_silence && o.user_type == 'User' && ( o.message_number > 0 || o.message_focus) ){
                if(o.message_number > 0 && !o.message_focus){
                    jBWW.checkMsg(o.user_name, '!help');
                }
                o.message_alltext = jBWW.getMsg(o.user_name);
                o.message_lasted = o.message_alltext.pop();
                if(o.message_lasted.message_type == 'IN'){
                    jBWW.checkMsg(o.user_name, o);
                }
            }
        });
    },
    sendMsg : function(contact, message, counter = 1){
        if(jBWW.debug)jBWW.log('Enviando mensagem para \"'+ contact +'\" : '+ message);
        var element = document.querySelector('[title="' + contact + '"]')
        var mouseEvent = document.createEvent('MouseEvents');
        mouseEvent.initEvent('mousedown', true, true);
        if(element)element.dispatchEvent(mouseEvent);

        var eventFire = (MyElement, ElementType) => {
            var MyEvent = document.createEvent("MouseEvents");
            MyEvent.initMouseEvent(ElementType, true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            MyElement.dispatchEvent(MyEvent);
        };
        let messageBox = document.querySelectorAll("[contenteditable='true']")[1];
        for (let i = 0; i < counter; i++) {
            let event = document.createEvent("UIEvents");
            messageBox.innerHTML = message;//.replace(/ /gm, ''); // test it
            event.initUIEvent("input", true, true, window, 1);
            messageBox.dispatchEvent(event);
            eventFire(document.querySelector('span[data-icon="send"]'), 'click');
            if(jBWW.debug)jBWW.log('Mensagem enviada.');
        }
    },
    getMsg : function(contact){
        if(jBWW.debug)jBWW.log('Coletando mensagens de '+ contact);

        var element = document.querySelector('[title="' + contact + '"]')
        var mouseEvent = document.createEvent('MouseEvents');
        mouseEvent.initEvent('mousedown', true, true);
        element.dispatchEvent(mouseEvent);
        var eventFire = (MyElement, ElementType) => {
            var MyEvent = document.createEvent("MouseEvents");
            MyEvent.initMouseEvent(ElementType, true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            MyElement.dispatchEvent(MyEvent);
        };

        var retorno = new Array();
        document.querySelectorAll('.GDTQm').forEach((div) => {
            let dmsg = div.querySelector('div.copyable-text');
            if(dmsg){
                let time_msg = dmsg.getAttribute('data-pre-plain-text');
                let text_msg = dmsg.querySelector('.selectable-text > span').textContent;
                let regex = new RegExp("\[(.*?)\]", 'g');
                let tm_resul = time_msg.replace(/ /gm, '').replace(contact+':','').replace(/\[|\]/gi,'').split(',');
                let type_msg = div.classList.contains('message-in')?'IN':'OUT';
                let deslocamento = div.querySelector('div._2kR4B')?true:false;
                let object = {
                    'user_name' : contact,
                    'message_lasttime': tm_resul[0],
                    'message_lastdate': tm_resul[1],
                    'message_text': text_msg,
                    'message_type': type_msg,
                    'message_break' : deslocamento,
                    //'elem': dmsg
                };
                retorno.push(object);
            }
        });
        return retorno;
    },
    checkMsg : function(user, msg){
        var message;
        if(msg instanceof Object && !(msg instanceof Array)){
            message = msg.message_lasted.message_text;
        }else message = msg;
        if(jBWW.debug)jBWW.log('Conferindo mensagem / usuario: '+ user + ' / menssagem: '+ message);
        if (message.indexOf("!") === 0) {
            var cmd_line = message.substring(1);
            var cmd = cmd_line.split(" ")[0];
            var args = cmd_line.split(" ").slice(1);
            var dftmsg = "";

            dftmsg += "Eu posso fazer os seguintes comandos:\n ";
            dftmsg += "*!about*: Sobre o Bot.\n ";
            dftmsg += "*!help*: Ajuda.\n ";
            dftmsg += "*!joke*: Retorna uma piada aleatória (about Chuck Norris).\n ";
            dftmsg += "(Work in progress)";

            switch(cmd){
                case 'help':
                    message = dftmsg;
                    break;
                case 'about':
                    message = 'I am a chat bot!\n\n Em constante criação. \n Create by Bitts (Marcelo Bitts d\'Valvassori) \n v1.0 - 05/06/2021';
                    break;
                case 'destroy':
                    message = 'Desabilitando Script';
                    if(jBWW.escutando){
                        if(clearInterval(jBWW.escutando))message += '\n Desabilitado!';
                    }else message = 'Não habilitado';
                    break;
                case 'json':
                    var data = jBWW.toListenWW();
                    var getCircularReplacer = () => {
                        const seen = new WeakSet();
                        return (key, value) => {
                            if (typeof value === "object" && value !== null) {
                                if (seen.has(value))return;
                                seen.add(value);
                            }
                            return value;
                        };
                    };
                    var txt = JSON.stringify(data, getCircularReplacer(), 4);
                    message = txt;
                    break;
                case 'joke':
                    if(GM_xmlhttpRequest){
                        GM_xmlhttpRequest({
                            method: "GET",
                            url: "http://api.icndb.com/jokes/random?escape=javascript",
                            onload: function(response) {
                                var json = JSON.parse(response.responseText);
                                message = json.value.joke;
                            }
                        });
                    }else if(GM && GM.xmlHttpRequest){
                        GM.xmlHttpRequest({
                            method: "GET",
                            url: "http://www.example.com/",
                            onload: function(response) {
                                var json = JSON.parse(response.responseText);
                                message = json.value.joke;
                            }
                        });
                    }
                    break;
                case 'vars':
                    message = 'Variáveis do Sistema:\n';
                    message += '\n Modo Debug: '+ jBWW.debug;
                    message += '\n Intervalo de escuta (segundos):'+ jBWW.refresh;
                    break;
                case 'servico':
                    var data_service = {
                        method: "GET",
                        url: "http://volatil.1cta.eb.mil.br/webservice/servico_qgcms.php?data="+args,
                        onload: function(response) {
                            message = JSON.stringify(response.responseText, getCircularReplacer(), 4);
                            //message = response.responseText
                            if(message!=''){
                                sendMsg(user, message);
                                send = true;
                            }
                        }
                    };
                    if(GM_xmlhttpRequest)GM_xmlhttpRequest(data_service);
                    else if(GM && GM.xmlHttpRequest)GM.xmlHttpRequest(data_service);
                    break;
                default : message = 'Comando: ['+ cmd + '] inválido. \n\n' + dftmsg;
            }
            if(jBWW.debug)jBWW.log('Para usuário / resposta: '+ user + ' / '+ message);
            jBWW.sendMsg(user, message);
        }
    },

    toListenWW : function(){
        var retorno = new Array();
        var contacts = document.querySelectorAll("div._2aBzC");
        [].forEach.call(contacts, function(div) {
            let user = div.querySelector('._35k-1').getAttribute('title');
            let tagimg = div.querySelector('img._18-9u');
            let img = tagimg?tagimg.getAttribute('src'):'';
            let tpusr = div.querySelector('div.IGI1I');
            let type = (tpusr)?'User':'Group';
            let lstm = div.querySelector('div._15smv').textContent;
            let tmsg = div.querySelector('div._2vfYK').querySelector('span._1DB2K').textContent;
            let ntmsg = div.querySelector('div._2TiQe:last-child');
            let nmsg = (ntmsg && ntmsg.querySelector('._38M1B'))?parseInt(ntmsg.querySelector('._38M1B').textContent):0;
            let slc = div.querySelector('div._2TiQe:first-child');
            let silence = (slc && slc.getAttribute('aria-label') == "Conversa silenciada")?true:false;
            let onFocus = (div.firstElementChild.getAttribute('aria-selected')=="true")?true:false;

            let object = {
                'user_name' : user,
                'user_type' : type,
                'user_silence': silence,
                'message_lasttime': lstm,
                'message_text': tmsg,
                'message_number' : nmsg,
                'message_focus' : onFocus,
                //'elem': div
            };
            retorno.push(object);
        });
        return retorno;
    }
};

console.log("[jBWW] Esperando que o chat carregue");
window.addEventListener("load", function() {
    console.log('Page is loaded. \n Load bot script...');
    setTimeout(function(){ jBWW.init(); }, 3000);
});
