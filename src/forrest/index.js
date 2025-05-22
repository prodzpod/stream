const { measureStart, measureEnd } = require("./common"); 
const { init, info, error, log, send } = require("./ws");
const WebSocket = require("ws");
let ws;
module.exports.ws = () => ws;

try {(async () => {

const mGlobal = measureStart();
await init();

ws = new WebSocket("wss://heat-api.j38.net/channel/108372992");
await new Promise(resolve => {
    ws.onmessage = msg => {
        let data = JSON.parse(msg.data);
        if (data.type === "click") {
            log("sending click:", data.id, data.x, data.y);
            send("click", data.id, data.x, data.y);
        }
    }
    ws.onopen = () => { info("websocket connected"); resolve(true); }
    ws.onerror = e => { error(e); resolve(false); }
    ws.onclose = () => {
        info("websocket closed");
        process.exit(0);
    }
});

info(`forrest Module Loaded, total time: ${measureEnd(mGlobal)}ms`);

})();} catch (e) { console.log(e.stack); }
