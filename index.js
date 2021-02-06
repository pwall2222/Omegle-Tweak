const ips = {
    blacklist: [],
    whitelist: [],
    history: []
};

const intervals = {
    active: [],
    all: [],
    atime: 0,
    ctime: 0
};

const stats = {
    requests: 0,
    times: 0,
    avaliable: false
};

let banskip = 0;
let twiceskip = 0;

async function main(ip) {
    interval.clear_both();
    dom.update_stats();
    if (intervals.active.length > 32) {
        interval.clear_active();
    }
    if (ips.history[ips.history.length - 1] == ip) {
        return;
    }
    if (!check_ip(ip)) {
        return;
    }
    const info = await api.fetch(ip);
    dom.obs();
    dom.new_connection(info);
    time.connection_time(ip);
    time.peers_time(info.time, ip);
}
function check_ip(ip) {
    const checkBox = document.querySelector("#banhistory").checked;
    if (ips.blacklist.some(ips => ips == ip)) {
        banskip++;
        dclick.new_connection();
        return false;
    }
    else if (checkBox && ips.history.some(ips => ips == ip) && !ips.whitelist.some(ips => ips == ip)) {
        twiceskip++;
        dclick.new_connection();
        return false;
    }
    ips.history.push(ip);
    return true;
}
const api = {
    fetch: async function (ip) {
        const location_api = "https://ipwhois.app/json/";
        const time_api = "https://worldtimeapi.org/api/ip/";
        const vpn_api = "https://vpnapi.io/api/";
        const location_data = await api.fetch_json(`${location_api}${ip}`);
        const vpn_data = await api.cors_proxy(`${vpn_api}${ip}`);
        const time_data = await api.time.fetch(ip, time_api, location_data.timezone_gmtOffset);
        const vpn = vpn_data.security.vpn || vpn_data.security.proxy || vpn_data.security.tor;
        const data = {
            ip: ip,
            city: location_data.city,
            region: location_data.region,
            country: location_data.country,
            org: location_data.org,
            vpn: vpn,
            time: time_data.datetime.match(/[0-9]{2}:[0-9]{2}:[0-9]{2}/)[0],
            timezone: time_data.utc_offset || location_data.timezone_gmt.replace("GMT", "UTC"),
            timezone_short: time_data.abbreviation,
            time_source: time_data.source
        };
        return data;
    },
    cors_proxy: async function (url) {
        const response = await fetch(`https://api.allorigins.win/get?url=${url}`, { referrerPolicy: 'no-referrer' });
        const data = await response.json();
        return JSON.parse(data.contents);
    },
    fetch_json: async function (url) {
        const response = await fetch(url, { referrerPolicy: 'no-referrer' });
        const data = await response.json();
        return data;
    },
    time: {
        fetch: async function (ip, time_api, offset) {
            api.time.api_check(time_api);
            if (stats.avaliable) {
                return api.time.api(ip, time_api, offset);
            }
            else {
                return api.time.local_fallback(offset);
            }
        },
        api_check: async function (time_api) {
            if (stats.times % 10 == 0) {
                stats.requests++;
                const api_test = await fetch(time_api);
                stats.avaliable = api_test.ok;
            }
            else if (stats.times % 2 == 0 && stats.avaliable) {
                stats.requests++;
                const api_test = await fetch(time_api);
                stats.avaliable = api_test.ok;
            }
            stats.times++;
        },
        api: async function (ip, time_api, offset) {
            try {
                stats.requests++;
                const response = await fetch(`${time_api}${ip}.json`, { mode: 'no-cors' }).catch(() => { throw "Time Error"; });
                const data = await response.json();
                data.utc_offset = "UTC " + data.utc_offset;
                data.source = "API";
                return data;
            }
            catch {
                stats.avaliable = false;
                return this.local_fallback(offset);
            }
        },
        local_fallback: function (offset) {
            const date = new Date();
            const localTime = date.getTime();
            const localOffset = date.getTimezoneOffset() * 60000;
            const utc = localTime + localOffset;
            const newDateTime = utc + (1000 * parseInt(offset));
            const convertedDateTime = new Date(newDateTime).toTimeString();
            const time = convertedDateTime.match(/[0-9]{2}:[0-9]{2}:[0-9]{2}/)[0];
            return {
                datetime: time,
                source: "Fallback"
            };
        }
    }
};
const time = {
    peers_time: function (time, ip) {
        const timeobj = {
            hours: 0,
            minutes: 0,
            seconds: 0,
            update() {
                timeobj.seconds++;
                if (timeobj.seconds >= 60) {
                    timeobj.minutes++;
                    timeobj.seconds = 0;
                }
                if (timeobj.minutes >= 60) {
                    timeobj.hours++;
                    timeobj.minutes = 0;
                }
                if (timeobj.hours >= 24) {
                    timeobj.hours = 0;
                }
            },
            pad(number, width = 2, character = '0') {
                let snumber = number + '';
                return snumber.length >= width ? snumber : new Array(width - snumber.length + 1).join(character) + snumber;
            },
            updatediv() {
                timeobj.update();
                const timediv = document.getElementById(`time${ip}`);
                if (timediv == null) {
                    clearInterval(intervals.atime);
                    return;
                }
                timediv.innerText = `Time: ${timeobj.pad(timeobj.hours)}:${timeobj.pad(timeobj.minutes)}:${timeobj.pad(timeobj.seconds)}`;
            }
        };
        if (time == "00:00:00") {
            return;
        }
        const newtime = time.split(":");
        timeobj.hours = parseInt(newtime[0]);
        timeobj.minutes = parseInt(newtime[1]);
        timeobj.seconds = parseInt(newtime[2]);
        intervals.atime = interval.new(timeobj.updatediv, 1000);
    },
    connection_time: function (ip) {
        const timeobj = {
            hours: 0,
            minutes: 0,
            seconds: 0,
            update() {
                timeobj.seconds++;
                if (timeobj.seconds >= 60) {
                    timeobj.minutes++;
                    timeobj.seconds = 0;
                }
                if (timeobj.minutes >= 60) {
                    timeobj.hours++;
                    timeobj.minutes = 0;
                }
                if (timeobj.hours >= 24) {
                    timeobj.hours = 0;
                }
            },
            pad(number, width = 2, character = '0') {
                let snumber = number + '';
                return snumber.length >= width ? snumber : new Array(width - snumber.length + 1).join(character) + snumber;
            },
            updatediv() {
                timeobj.update();
                const timediv = document.getElementById(`ctime${ip}`);
                if (timediv == null) {
                    clearInterval(intervals.ctime);
                    return;
                }
                timediv.innerText = `Connection: ${timeobj.pad(timeobj.hours)}:${timeobj.pad(timeobj.minutes)}:${timeobj.pad(timeobj.seconds)}`;
            }
        };
        intervals.ctime = interval.new(timeobj.updatediv, 1000);
    }
};
const dclick = {
    new_connection: function () {
        interval.clear(intervals.ctime);
        const btn = document.querySelector(".disconnectbtn");
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
    reroll_skip: function () {
        dclick.discconect();
        dclick.stop_reroll();
    },
    discconect: function () {
        interval.clear(intervals.ctime);
        const btn = document.querySelector(".disconnectbtn");
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
        const btn = document.querySelector("input[value='Stop']");
        btn.click();
    }
};
const list = {
    blacklist: function () {
        const x = document.querySelector("#texbox_ip");
        ips.blacklist.push(x.value);
        x.value = "";
    },
    blacklist_this: function () {
        ips.blacklist.push(ips.history[ips.history.length - 1]);
        dclick.discconect();
    },
    whitelist: function () {
        const x = document.querySelector("#texbox_ip");
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
        const config = { attributes: true, childList: true, subtree: true };
        const targetNode = document.querySelector(".logbox");
        const observer = new MutationObserver(obscallback);
        function obscallback(mutations) {
            if (mutations.some(mutation => mutation.target.className != undefined && mutation.target.className == "newchatbtnwrapper")) {
                interval.clear(intervals.ctime);
                observer.disconnect();
            }
        }
        observer.observe(targetNode, config);
    },
    new_connection: function (info) {
        const chat = document.querySelector(".logitem");
        chat.innerHTML = `IP: ${info.ip} <br/>
		City: ${info.city} <br/>
		Region: ${info.region} <br/>
		Country: ${info.country} <br/>
		ISP: ${info.org} <br/>
		VPN: ${info.vpn} <br/>
		<div id="time${info.ip}">Time: ${info.time}</div>
		Timezone: ${info.timezone} <br/>
		Source: ${info.time_source} <br/>
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
        document.querySelector("#banstat").innerText = ips.blacklist.length.toString();
        document.querySelector("#twicestat").innerText = twiceskip.toString();
        document.querySelector("#skipstat").innerText = banskip.toString();
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
        clearInterval(intervals.atime);
        intervals.active.splice(intervals.active.indexOf(intervals.atime), 1);
        clearInterval(intervals.ctime);
        intervals.active.splice(intervals.active.indexOf(intervals.ctime), 1);
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
window.oRTCPeerConnection = window.oRTCPeerConnection || window.RTCPeerConnection;
window.RTCPeerConnection = function (...args) {
    const pc = new window.oRTCPeerConnection(...args);
    pc.oaddIceCandidate = pc.addIceCandidate;
    pc.addIceCandidate = function (iceCandidate, ...rest) {
        const fields = iceCandidate.candidate.split(' ');
        if (fields[7] === 'srflx') {
            main(fields[4]);
        }
        return pc.oaddIceCandidate(iceCandidate, ...rest).catch((err) => { });
    };
    return pc;
};