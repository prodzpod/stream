const { WASD } = require("../../common");
const { log, send } = require("../../ws");

let wss = [];

module.exports._init = async (ws, query, body) => {
    log("[malphon] WS initialized");
    let tillies = await send("gettillies");
    ws.send(WASD.pack("settillies", tillies));
    wss.push(ws);
}
module.exports._send = async (...args) => {
    log("[malphon] sending message: " + args);
    for (let k of wss) k.send(WASD.pack(...args));
}