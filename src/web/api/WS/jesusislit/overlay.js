const { WASD } = require("../../../common");
const { log, send } = require("../../../ws");
let wss = [];
module.exports._init = async (ws, query, body) => {
    log("[overlay] overlay connected");
    wss.push(ws);
}

module.exports._send = async (...args) => {
    for (let k of wss) k.send(WASD.pack(...args));
}

module.exports._close = async (key) => {
    log("[overlay] overlay closed");
}