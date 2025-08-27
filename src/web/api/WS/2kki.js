const { WASD } = require("../../common");
const { log, send } = require("../../ws");
let wss = [];
module.exports._init = async (ws, query, body) => {
    log("[2kki] ws connected");
    wss.push(ws);
}

module.exports._send = async (...args) => {
    log("[2kki] sending message: " + args);
    for (let k of wss) k.send(...args);
}

module.exports._close = async (key) => {
    log("[2kki] ws closed");
}

module.exports._all = async (ws, args, res) => {
    if (res) return res;
    return await send("2kki", ...args);
}