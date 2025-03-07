const { WASD } = require("../../common");
const { log, send } = require("../../ws");
let jakes = [];
module.exports._init = async (ws, query, body) => {
    log("[jake] jake connected");
    jakes.push(ws);
    send("jake");
}

module.exports._send = async (...args) => {
    log("[jake] sending message: " + args);
    for (let k of jakes) k.send(WASD.pack(...args));
}

module.exports._close = async (key) => {
    log("[jake] jake closed");
}