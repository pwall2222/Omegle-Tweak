function init_chat() {
	document.getElementsByClassName("logitem")[0].innerHTML = /* html */`
	IP: Fetching <br/>
	City: Fetching <br/>
	Region: Fetching <br/>
	Country: Fetching <br/>
	ISP: Fetching <br/>
	<div id="time">Time: Fetching </div>
	Timezone: Fetching <br/>
	<div id="ctime">Connection: 00:00:00</div>
	<button type="button" onclick="list.blacklist_this()">Blacklist this IP</button>
	<button type="button" onclick="list.whitelist_this()">Whitelist this IP</button> <br/>
	<button type="button" onclick="dclick.new_connection()">New Connection</button>
	<button type="button" onclick="dclick.discconect()">Skip</button>
	<button type="button" onclick="dclick.reroll_skip()">Skip and stop reroll</button> <br/>
	<button type="button" onclick="local.save()">Save to local storage</button>
	<button type="button" onclick="local.clear()">Clear local storage</button>`;
}
const reg = /\("Omegle video chat might not work well in Microsoft Edge\. Please upgrade to Firefox or Chrome\."\)/g
const string = `("Omegle video chat might not work well in Microsoft Edge. Please upgrade to Firefox or Chrome."),init_chat()`;
let chat = startNewChat.toString();
chat = chat.substring(35);
chat = chat.substring(0, chat.length - 1);
chat = chat.replace(reg, string);
startNewChat = new Function (["a","b","c","e","f"], chat);
setShouldUseEnglish(true);
const newItem = document.createElement("div");
newItem.innerHTML = /* html */`
	<div style="width: 400px;height: 20px;margin-top: 7px;margin-right: auto;margin-bottom: auto;margin-left: auto;"> 
		<input id="texbox_ip"> 
		<button type="button" onclick="list.blacklist()">Blacklist</button>
		<button type="button" onclick="list.whitelist()">Whitelist</button>
	</div>
	<div style="width: 300px;height: 20px;margin-top: 4px;margin-right: auto;margin-bottom: auto;margin-left: auto;"> 
		<style>
			.switch {position: relative; display: inline-block; width: 30px; height: 17px; }
			.switch input {opacity: 0; width: 0; height: 0; }
			.slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; -webkit-transition: .4s; transition: .4s; }
			.slider:before {position: absolute; content: ""; height: 13px; width: 13px; left: 2px; bottom: 2px; background-color: white; -webkit-transition: .4s; transition: .4s; }
			input:checked + .slider { background-color: #2196F3; }
			input:focus + .slider { box-shadow: 0 0 1px #2196F3; }
			input:checked + .slider:before { -webkit-transform: translateX(13px); -ms-transform: translateX(13px); transform: translateX(13px); }
			/* Rounded sliders */
			.slider.round { border-radius: 17px; }
			.slider.round:before { border-radius: 50%; }
		</style>
		<label class="switch" style=" position: absolute; margin-top: 4px; margin-left: 3px; "> 
			<input type="checkbox" id="banhistory" checked> 
			<span class="slider round"></span>
		</label>
		<div style="position: absolute; margin-left: 38px;">No same person twice</div>
		
	</div>
	<div style="position: absolute;width: 200px;right: 260px;top: 0px;color: #9CF;font-size: 1.1em;">
		<strong id="twicestat">0</strong> Seen more than once<br>
		<strong id="banstat">0</strong> Banned<br>
		<strong id="skipstat">0</strong> Skipped because ip ban<br>
	</div>	
	`;
$("header").appendChild(newItem);
$("onlinecount").style.position = "absolute";
$("onlinecount").style.bottom = "18px";
$('sharebuttons').dispose();
$('tagline').dispose();
$("footer").dispose();