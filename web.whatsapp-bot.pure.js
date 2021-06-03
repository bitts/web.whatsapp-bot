
function getMsg(contact){
  	console.log('mensagens de ', contact);
  
  	var retorno = new Array();
	  document.querySelectorAll('.message-in').forEach((div) => {
      let dmsg = div.querySelector('div.copyable-text')
      let time_msg = dmsg.getAttribute('data-pre-plain-text');
      let text_msg = dmsg.querySelector('.selectable-text > span').textContent;
      let regex = new RegExp("\[(.*?)\]", 'g');
      //console.log(time_msg.match(regex))
      let tm_resul = time_msg.replace(/ /gm, '').replace(contact+':','').replace(/\[|\]/gi,'').split(','); 

      //console.log(time_msg, '|',tm_resul); 		// mostra o que está entre os :

      let object = {
        'user_name' : contact,
        'message_lasttime': tm_resul[0],
        'message_lastdate': tm_resul[1],
        'message_text': text_msg,
        'elem': dmsg
      };
      retorno.push(object);
    });
}


function sendMsg(contact, message, counter = 1){
  var element = document.querySelector('[title="' + contact + '"]')
  var mouseEvent = document.createEvent('MouseEvents');
  mouseEvent.initEvent('mousedown', true, true);
  element.dispatchEvent(mouseEvent);
  
  var eventFire = (MyElement, ElementType) => {
    var MyEvent = document.createEvent("MouseEvents");
    MyEvent.initMouseEvent(ElementType, true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    MyElement.dispatchEvent(MyEvent);
  };
  let messageBox = document.querySelectorAll("[contenteditable='true']")[1];
  for (let i = 0; i < counter; i++) {
    event = document.createEvent("UIEvents");
    messageBox.innerHTML = message;//.replace(/ /gm, ''); // test it
    event.initUIEvent("input", true, true, window, 1);
    messageBox.dispatchEvent(event);
    eventFire(document.querySelector('span[data-icon="send"]'), 'click');
  }
}

var retorno = new Array();
var contacts = document.querySelectorAll("div._2aBzC");
[].forEach.call(contacts, function(div) {
  let user = div.querySelector('._35k-1').getAttribute('title');
  let tagimg = div.querySelector('img._18-9u');
  let img = tagimg?tagimg.getAttribute('src'):'';
  
  let tpusr = div.querySelector('div.IGI1I')
  let type = (tpusr)?'User':'Group';
  
  let lstm = div.querySelector('div._15smv').textContent;
  let tmsg = div.querySelector('div._2vfYK').querySelector('span._1DB2K').textContent;
  let ntmsg = div.querySelector('div._2TiQe:last-child');
  let nmsg = (ntmsg && ntmsg.querySelector('._38M1B'))?parseInt(ntmsg.querySelector('._38M1B').textContent):0;
  
  let slc = div.querySelector('div._2TiQe:first-child');
  let silence = (slc && slc.getAttribute('aria-label') == "Conversa silenciada")?true:false;
  
  let object = {
    'user_name' : user,
    'user_type' : type,
    'user_silence': silence,
    'message_lasttime': lstm,
    'message_text': tmsg,
    'message_number' : nmsg,
    'elem': div
  };
  if(!object.user_silence && object.user_type == 'User' && object.message_number > 0){
    //sendMsg(object.user_name, 'Teste de mensagem do Bot');
    object.menssage_alltext = getMsg(object.user_name);
  }
  retorno.push(object);
});

//
//sendMsg("Me", "TTeste de Mensagem")
