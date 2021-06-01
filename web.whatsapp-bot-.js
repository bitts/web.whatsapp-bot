// ==UserScript==
// @name         WhatsApp Web - Chat Bot
// @namespace    WACB
// @version      0.1
// @description  A chat bot for WhatsApp Web, with some basic commands. Check console for log.
// @author       bitts (marcelo.valvassori@gmail.com)
// @match        https://web.whatsapp.com/*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-idle
// ==/UserScript==

var jq = document.createElement('script');
jq.onload = function() {
    jQuery.noConflict();
    console.log('jQuery loaded');
    setTimeout(Main, 3500);
};
jq.src = "//ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js";
document.getElementsByTagName('head')[0].appendChild(jq);

function Main() {
    console.log("[WACB] Esperando que o chat carregue");
    //jQuery("#pane-side").on("click", function() {
        setTimeout(listenToChat, 350);
    //});
}

function listenToChat() {
    console.log("[WACB] Ouvindo bate-papo");
    /*
    jQuery(".message-list").bind("DOMSubtreeModified", function() {
        var new_msg = jQuery(".selectable-text").last().text();
        console.log("[WACB] Nova mensagem de chat: \n" + new_msg);
        if (new_msg.indexOf("!") === 0) {
            var cmd_line = new_msg.substring(1);
            var cmd = cmd_line.split(" ")[0];
            var args = cmd_line.split(" ").shift();
            if (cmd == "about") {
                sendMsg("Eu sou um chat Bot, feito pelo Bitts.");
            }
        }
    });
    */
    jQuery("div#pane-side")
        .find("[aria-label='Lista de conversas']")
        .find('div._2aBzC')
        .each(function(i, obj){
            let th = jQuery(this);

            let user = th.find('span.N2dUK').find('._35k-1').attr('title');
            let group = (typeof user === 'undefined')?th.find('div._3Dr46').find('._35k-1').attr('title'):undefined;
            let lstm = th.find('._15smv').text();
            let tmsg = th.find('div._2vfYK').find('span._1DB2K').text();
            let nmsg = th.find('div._2TiQe').find('span._38M1B').text();
            if(nmsg && nmsg > 0 && typeof user !== 'undefined'){
                console.log('| user: '+ user, '|group: '+ group, '| time: '+ lstm, '| MSG: '+ tmsg,'|Nº MSG: '+ nmsg);
            }

         });
    /*
    unsafeWindow.sendMsg = function(msg) {
        console.log("[WACB] Enviando mensagem: \n" + msg);
        var target = document.getElementsByClassName("input")[1];
        var eventType = "textInput";
        var evt = document.createEvent("TextEvent");
        evt.initTextEvent(eventType, true, true, unsafeWindow, msg, 0, "en-US");
        target.focus();
        target.dispatchEvent(evt);
        jQuery(".send-container").click();
    };
    var last_msg = jQuery(".selectable-text").last().text();
    setInterval(function() {
        var new_msg = jQuery(".selectable-text").last().text();
        if (new_msg !== last_msg) {
            console.log("[WACB] New chat message: \n" + new_msg);
            last_msg = new_msg;
            if (new_msg.indexOf("!") === 0) {
                var cmd_line = new_msg.substring(1);
                var cmd = cmd_line.split(" ")[0];
                var args = cmd_line.split(" ").slice(1);
                if (cmd == "help") {
                    sendMsg("Eu posso fazer os seguintes comandos:");
                    sendMsg("*!about*: Retorna quem eu sou.");
                    sendMsg("*!joke*: Retorna uma piada aleatória (about Chuck Norris).");
                    sendMsg("*!weather*: Retorna o tempo corrente in Porto Alegre.");
                    sendMsg("*!weather <LOCATION>*: Retorna o tempo local em <LOCATION>.");
                    sendMsg("*!gewis*: Retorna a agenda do Bitts.");
                    sendMsg("(Work in progress)");
                }
                if (cmd == "about") {
                    sendMsg("I am a chat bot.");
                }
                if (cmd == "joke") {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: "http://api.icndb.com/jokes/random?escape=javascript",
                        onload: function(response) {
                            var json = JSON.parse(response.responseText);
                            sendMsg(json.value.joke);
                        }
                    });
                }
                if (cmd == "weather") {
                    var url = "http://api.apixu.com/v1/current.json?key=d0c5d252848043d6af4210418162706&q=Eindhoven";
                    if (args.length > 0) {
                        url = "http://api.apixu.com/v1/current.json?key=d0c5d252848043d6af4210418162706&q=" + args[0];
                    }
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: url,
                        onload: function(response) {
                            var json = JSON.parse(response.responseText);
                            if (args.length > 0) {
                                if (json.error) {
                                    sendMsg("ERROR: Não foi possível encontrar local.");
                                } else {
                                    sendMsg("É atualmente " + json.current.temp_c + "°C in " + args[0]);
                                }
                            } else {
                                sendMsg("É atualmente " + json.current.temp_c + "°C em Porto Alegre.");
                            }
                        }
                    });
                }
                if (cmd == "gewis") {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: "https://www.gewis.nl/activity",
                        onload: function(response) {
                            var acts = jQuery(".agenda-item-body", response.responseText);
                            for (var i = 0; i < acts.length; i++) {
                                sendMsg(jQuery("h4 > a", acts[i]).text().trim() + " - " + jQuery("div.col-md-4 > dl > dd:nth-child(2)", acts[i]).text().trim() + " @ " + jQuery("div.col-md-4 > dl > dd:nth-child(6)", acts[i]).text().trim());
                            }
                        }
                    });
                }
            }
        }
    }, 100);
    */
}
