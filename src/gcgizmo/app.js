const WebSocket = require("ws");
const { log, send } = require("./ws");
let reboot = true;
let ws;
module.exports.init = () => {
    ws = new WebSocket("wss://heat.prod.kr/prodzpod");
    ws.onopen = () => log("GreenHeat connected!");
    ws.onmessage = _message => {
        const message = JSON.parse(_message.data);
        if (message.type === "hover") return;
        send(message.type, message.id, message.x * 1920, message.y * 1080);
    };
    ws.onclose = () => { 
        log("GreenHeat disconnected!"); 
        if (reboot) setTimeout(module.exports.init, 500);
    };
}
module.exports.exit = () => {
    reboot = false;
    ws?.terminate();
}