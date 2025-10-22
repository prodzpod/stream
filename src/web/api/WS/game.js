const { WASD } = require("../../common");
const { log, send } = require("../../ws");
let wss = {};
module.exports._init = async (ws, query, body) => {
    log("[game] game connected");
    wss[query.id] ??= [];
    wss[query.id].push(ws);
    log(query.id)
}

module.exports._send = async (id, ...args) => {
    log("[game] sending message: " + args);
    if (wss[id]) for (let k of wss[id]) k.send(WASD.pack(...args));
}

module.exports._close = async (key) => {
    log("[game] game closed");
}

module.exports._all = async (ws, args, res) => {
    if (res) return res;
    const user = Object.keys(wss).find(x => wss[x].includes(ws));
    if (!user) return; return await send("game", user, ...args);
}