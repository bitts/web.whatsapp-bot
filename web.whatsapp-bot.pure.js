
function getMsg(contact)
{
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
	  let dmsg = div.querySelector('div.copyable-text')
    if(dmsg){
      let time_msg = dmsg.getAttribute('data-pre-plain-text');
      let text_msg = dmsg.querySelector('.selectable-text > span').textContent;
      let regex = new RegExp("\[(.*?)\]", 'g');
      //console.log(time_msg.match(regex))
      let tm_resul = time_msg.replace(/ /gm, '').replace(contact+':','').replace(/\[|\]/gi,'').split(','); 

      let object = {
        'user_name' : contact,
        'message_lasttime': tm_resul[0],
        'message_lastdate': tm_resul[1],
        'message_text': text_msg,
        'elem': dmsg
      };
      retorno.push(object);
    }
	});

	return retorno;
}


function sendMsg(contact, message, counter = 1)
{
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
    event = document.createEvent("UIEvents");
    messageBox.innerHTML = message;//.replace(/ /gm, ''); // test it
    event.initUIEvent("input", true, true, window, 1);
    messageBox.dispatchEvent(event);
    eventFire(document.querySelector('span[data-icon="send"]'), 'click');
  }
}

function checkMsg(user, msg){
  if (msg.indexOf("!") === 0) {
    var cmd_line = msg.substring(1);
    var cmd = cmd_line.split(" ")[0];
    var args = cmd_line.split(" ").slice(1);
    var dftmsg = "";
    dftmsg += "Eu posso fazer os seguintes comandos:\n ";
		dftmsg += "*!about*: Sobre o Bot.\n ";
    dftmsg += "*!joke*: Retorna uma piada aleatória (about Chuck Norris).\n ";
    dftmsg += "(Work in progress)";
    
    if (cmd == "help") {
      sendMsg(user, dftmsg);
    }
    if (cmd == "about") {
      sendMsg(user, "I am a chat bot.");
    }
    if( cmd == "destroy" && escutando){
      clearInterval(escutando);
      console.log('Desabilitando Script');
    }
  }
}

function toListenWW(){
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
    
    let onFocus = (div.firstElementChild.getAttribute('aria-selected')=="true")?true:false;

    let object = {
      'user_name' : user,
      'user_type' : type,
      'user_silence': silence,
      'message_lasttime': lstm,
      'message_text': tmsg,
      'message_number' : nmsg,
      'message_focus' : onFocus,
      'elem': div
    };
    
    if(!object.user_silence && object.user_type == 'User' && ( object.message_number > 0 || object.message_focus) ){
      console.log(object);
      if(object.message_number > 0){
        sendMsg(user, 'Olá eu sou o Bot do Marcelo Bittencourt \n Eu posso fazer os seguintes comandos: \n *!about*: Sobre o Bot. \n (Work in progress)');
      }
      object.message_alltext = getMsg(user);
      object.message_lasted = object.message_alltext.pop();
      checkMsg(user, object.message_lasted.message_text);
    }
    retorno.push(object);
  });
  return retorno;
}

//var escutando = setInterval(function() {
  toListenWW();
//}, 1000);
