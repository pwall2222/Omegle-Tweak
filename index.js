const ips = {
	blacklist: [],
	whitelist: [],
	history: []
};
const intervals = {
	active: [],
	all: []
};
let banskip = 0;
let twiceskip = 0;
let ainterval;
let cinterval;

async function main(ip) {
	interval.clear_both();
	if (intervals.active.length > 32) {intervals.clear_active();}
	if (ips.history[ips.history.length - 1] == ip) {return;}
	if(!check_ip(ip)) {return;}
	dom.update_stats();
	const info = await fetch_api(ip);
	dom.obs();
	dom.new_connection(info);
	time.connection_time(ip);
	time.peers_time(info.time, ip);
}

function check_ip(ip) {
	const checkBox = $("banhistory").checked;
	if (ips.blacklist.some(ips => ips == ip)) {
		banskip++;
		dclick.discconect();
		console.log("Skip reason: Banned ip");
		return false;
	}
	else
	if (checkBox && ips.history.some(ips => ips == ip) && !ips.whitelist.some(ips => ips == ip)) {
		twiceskip++;
		dclick.discconect();
		console.log("Skip reason: Ip history ban enabled and ip seen twice");
		return false;
	}

	ips.history.push(ip);
	return true;
}

async function fetch_api(ip) {
	const location_api = "https://ipwhois.app/json/";
	const time_api = "https://worldtimeapi.org/api/ip/";
	const location_data = await fetch(`${location_api}${ip}`, {referrerPolicy: 'no-referrer'}).then(response => response.json());
	const time_data = await time.api(ip, time_api);
	const data = {
		ip: ip,
		city: location_data.city,
		region: location_data.region,
		country: location_data.country,
		org: location_data.org,
		time: /[0-9]{2}:[0-9]{2}:[0-9]{2}/g.exec(time_data.datetime)[0],
		timezone: time_data.utc_offset,
		timezone_short: time_data.abbreviation
	};
	return data;
}

const time = {
	peers_time: function (newtime, ip) {
		const timeobj = {
			hours: 0,
			minutes: 0,
			seconds: 0,
			update() {
				timeobj.seconds++;
				if (timeobj.seconds >= 60) {timeobj.minutes++; timeobj.seconds = 0;}
				if (timeobj.minutes >= 60) {timeobj.hours++; timeobj.minutes = 0;}
				if (timeobj.hours >= 24) {timeobj.hours = 0;}
			},
			pad(number, width = 2, character = '0') {
				number = number + '';
				return number.length >= width ? number : new Array(width - number.length + 1).join(character) + number;
			},
			updatediv() {
				timeobj.update();
				const timediv = $(`time${ip}`);
				if (timediv == null) {clearInterval(ainterval); return;}
				timediv.innerText = `Time: ${timeobj.pad(timeobj.hours)}:${timeobj.pad(timeobj.minutes)}:${timeobj.pad(timeobj.seconds)}`;
			}
		};
		if (newtime == "00:00:00") {return;}
		newtime = newtime.split(":");
		timeobj.hours = newtime[0];
		timeobj.minutes = newtime[1];
		timeobj.seconds = newtime[2];
		ainterval = interval.new(timeobj.updatediv, 1000);
	},
	connection_time: function (ip) {
		const timeobj = {
			hours: 0,
			minutes: 0,
			seconds: 0,
			update() {
				timeobj.seconds++;
				if (timeobj.seconds >= 60) {timeobj.minutes++; timeobj.seconds = 0;}
				if (timeobj.minutes >= 60) {timeobj.hours++; timeobj.minutes = 0;}
				if (timeobj.hours >= 24) {timeobj.hours = 0;}
			},
			pad(number, width = 2, character = '0') {
				number = number + '';
				return number.length >= width ? number : new Array(width - number.length + 1).join(character) + number;
			},
			updatediv() {
				timeobj.update();
				const timediv = $(`ctime${ip}`);
				if (timediv == null) {clearInterval(cinterval);return;}
				timediv.innerText = `Connection: ${timeobj.pad(timeobj.hours)}:${timeobj.pad(timeobj.minutes)}:${timeobj.pad(timeobj.seconds)}`;
			}
		};
		cinterval = interval.new(timeobj.updatediv, 1000);
	},
	api: async function (time_ip, ip) {
		return fetch(`${time_ip}${ip}`).then(async response =>
			{
				response = await response.json()
				response.utc_offset = "UTC " + response.utc_offset;
				return response;
			}).catch(error =>
			{
				return {
					datetime: "00:00:00",
					utc_offset: "error"
				}
			});
	}
};

const dclick = {
	new_connection: function() {
		const btn = document.getElementsByClassName("disconnectbtn")[0];
		switch (btn.innerText.split("\n")[0]) {
			case "Stop":
				btn.click();
				btn.click();
				btn.click();
			break;
	
			case "Really?":
				btn.click();
				btn.click();
			break;
			
			default:
				btn.click();
			break;
		}
	},
	reroll_skip: function() {
		dclick.discconect();
		dclick.stop_reroll();
	},
	discconect: function() {
		const btn = document.getElementsByClassName("disconnectbtn")[0];
		switch (btn.innerText.split("\n")[0]) {
			case "Stop":
				btn.click();
				btn.click();
			break;
	
			case "Really?":
				btn.click();
			break;
			
			default:
			break;
		}
	},
	stop_reroll: function () {
		const btn =  document.querySelector('input[value="Stop"]');
		btn.click();
	}
}; 

const list = {
	blacklist: function () {
		const x = $("texbox_ip");
		ips.blacklist.push(x.value);
		x.value = "";
	},
	blacklist_this: function() {
		ips.blacklist.push(ips.history[ips.history.length - 1]);
		dclick.discconect();
	},
	whitelist: function () {
		const x = $("texbox_ip");
		ips.whitelist.push(x.value);
		x.value = "";
	},
	whitelist_this: function () {
		ips.whitelist.push(ips.history[ips.history.length - 1]);
	}
};

const local = {
	get: function () {
		if (localStorage.ips != undefined) {
			const local = JSON.parse(localStorage.getItem('ips'));
			ips.whitelist.push.apply(ips.whitelist, local.whitelist);
			ips.blacklist.push.apply(ips.blacklist, local.blacklist);
			ips.history.push.apply(ips.history, local.history);
		}
	},
	save: function () {
		localStorage.setItem('ips', JSON.stringify(ips));
	},
	clear: function () {
		localStorage.clear();
	}
};

const dom = {
	obs: function () {
		const config = {attributes: true, childList: true, subtree: true};
		const targetNode = document.getElementsByClassName("logbox")[0];
		const observer = new MutationObserver(obscallback);
		function obscallback(mutations) {
			if(mutations.some(mutation => mutation.target.className != undefined && mutation.target.className == "newchatbtnwrapper")) {
				interval.clear(cinterval);
				observer.disconnect();
			}
		}
		observer.observe(targetNode, config);
	},
	new_connection: function (info) {
		const chat = document.getElementsByClassName("logitem")[0];
		chat.innerHTML = /* html */`IP: ${info.ip} <br/>
		City: ${info.city} <br/>
		Region: ${info.region} <br/>
		Country: ${info.country} <br/>
		ISP: ${info.org} <br/>
		<div id="time${info.ip}">Time: ${info.time}</div>
		Timezone: ${info.timezone} <br/>
		<div id="ctime${info.ip}">Connection: 00:00:00</div>
		<button type="button" onclick="list.blacklist_this()">Blacklist this IP</button> 
		<button type="button" onclick="list.whitelist_this()">Whitelist this IP</button> <br/>
		<button type="button" onclick="dclick.new_connection()">New Connection</button>
		<button type="button" onclick="dclick.discconect()">Skip</button>
		<button type="button" onclick="dclick.reroll_skip()">Skip and stop reroll</button> <br/>
		<button type="button" onclick="local.save()">Save to local storage</button>
		<button type="button" onclick="local.clear()">Clear local storage</button>
		`;
	},
	update_stats: function () {
		$("banstat").innerText = ips.blacklist.length;
		$("twicestat").innerText = twiceskip;
		$("skipstat").innerText = banskip;	
	}
};

const interval = {
	new: function (callback, ms) {
		const intrvl = setInterval(callback, ms);
		intervals.active.push(intrvl);
		intervals.all.push(intrvl);
		return intrvl;
	},
	clear: function (intrvl) {
		clearInterval(intrvl);
		intervals.active.splice(intervals.active.indexOf(intrvl), 1);
	},
	clear_both: function () {
		clearInterval(interval);
		intervals.active.splice(intervals.active.indexOf(interval), 1);
		clearInterval(cinterval);
		intervals.active.splice(intervals.active.indexOf(cinterval), 1);
	},
	clear_active: function () {
		intervals.active.forEach(i => clearInterval(i));
	},
	clear_all: function () {
		intervals.all.forEach(i => clearInterval(i));
	}
};

local.get();
dom.update_stats();

window.oRTCPeerConnection  = window.oRTCPeerConnection || window.RTCPeerConnection;
window.RTCPeerConnection = function(...args) {
    const pc = new window.oRTCPeerConnection(...args);
    pc.oaddIceCandidate = pc.addIceCandidate;
    pc.addIceCandidate = function(iceCandidate, ...rest) {
		const fields = iceCandidate.candidate.split(' ');
		if (fields[7] === 'srflx') {main(fields[4]);}
        return pc.oaddIceCandidate(iceCandidate, ...rest).catch(error => {return;});
    };
    return pc;
};
