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
		let dmsg = div.querySelector('div.copyable-text');
		if(dmsg){
			  let time_msg = dmsg.getAttribute('data-pre-plain-text');
			  let text_msg = dmsg.querySelector('.selectable-text > span').textContent;
			  let regex = new RegExp("\[(.*?)\]", 'g');
			  let tm_resul = time_msg.replace(/ /gm, '').replace(contact+':','').replace(/\[|\]/gi,'').split(','); 
			  let type_msg = div.classList.contains('message-in')?'IN':'OUT';
			  let object = {
			      'user_name' : contact,
			      'message_lasttime': tm_resul[0],
			      'message_lastdate': tm_resul[1],
			      'message_text': text_msg,
			      'message_type': type_msg,
			      //'elem': dmsg
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
		dftmsg += "*!json*: Retorna dados do web.whatsapp utilizados no Bot.\n ";
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
		if( cmd == "json"){
			var data = toListenWW();
			var txt = JSON.stringify(data, undefined, 4);
			sendMsg(user, txt);
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
		retorno.push(object);
	});
	return retorno;
}


function call(){
	var obj = toListenWW();
	const getCircularReplacer = () => {
		const seen = new WeakSet();
		return (key, value) => {
		    if (typeof value === "object" && value !== null) {
			if (seen.has(value)) {
			    return;
			}
			seen.add(value);
		    }
		    return value;
		};
	};
	var txt = JSON.stringify(obj, getCircularReplacer(), 4);
	console.log(txt);
	[].forEach.call(obj, function(o) {
		if(!o.user_silence && o.user_type == 'User' && ( o.message_number > 0 || o.message_focus) ){
			if(o.message_number > 0 && !o.message_focus){
				checkMsg(o.user_name, '!help');
			}
			o.message_alltext = getMsg(o.user_name);
			o.message_lasted = o.message_alltext.pop();
			if(o.message_lasted.message_type == 'IN')
				checkMsg(o.user_name, o.message_lasted.message_text);
		}
	});
}

//var escutando = setInterval(function() {
  call();
//}, 1000);
