const { WASD } = require("../../common");
const { log, send } = require("../../ws");
let wss = {};
module.exports._init = async (ws, query, body) => {
    log("[extension] WS initialized");
}
module.exports._send = async (token, ...args) => {
    log("[extension] sending message: " + args);
    wss[token]?.send(WASD.pack(...args));
}
module.exports.login = async (ws, args) => {
    wss[args[1]] = ws;
}
module.exports._all = async (ws, args, res) => {
    if (res) return res;
    return await send("extension", ...args);
}