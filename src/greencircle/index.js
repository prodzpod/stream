const WebSocket = require("ws");
const { WASD, measureStart, measureEnd } = require("./common"); 
const { init, info, send, debug, log } = require("./ws");

let isOn = 0;
try {(async () => {

const mGlobal = measureStart();
await init();
openWS(); setInterval(() => { if (isOn === 0) openWS(); }, 5*60*1000);
info(`Green Circle Module Loaded, total time: ${measureEnd(mGlobal)}ms`);
})();} catch (e) { console.log(e.stack); }

function openWS() {
    try {
        isOn += 1;
        let ws = new WebSocket("wss://api.colonq.computer/api/circle/events");
        ws.onopen = () => { debug("colonq API Connected"); }
        ws.onclose = () => { debug("colonq API Down"); isOn -= 1; if (isOn === 0) openWS(); }
        ws.onmessage = async message => {
            let data = parseSexpRubbish(message.data.toString());
            log("Data:", data);
            for (let user of data[1]) await send(data[0], user);
        }
    } catch { isOn -= 1; log("colonq API Down REAL"); }
}
function parseSexpRubbish(str) { return WASD.unpack(str.slice(1, -1).replaceAll("(", "[").replaceAll(")", "]")); }