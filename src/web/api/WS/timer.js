const { WASD } = require("../../common");
const { log, send } = require("../../ws");
let sockets = [];
module.exports._init = async (ws, query, body) => {
    log("[timer] timer connected");
    sockets.push(ws);
}

module.exports._send = async (...args) => {
    log("[timer] sending message: " + args);
    for (let k of sockets) k.send(...args);
}

module.exports._close = async (key) => {
    log("[timer] ws closed");
}