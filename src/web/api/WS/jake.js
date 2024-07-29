const { WASD } = require("../../common");
const { log, send } = require("../../ws");
let jakes = {};
module.exports._init = async (ws, query, body) => {
    log("[jake] jake connected");
    const k = await send("jake");
    jakes[k] = ws;
}

module.exports._send = async (...args) => {
    log("[jake] sending message: " + args);
    for (let k of Object.keys(jakes)) jakes[k].send(WASD.pack(...args));
}

module.exports._close = async (key) => {
    log("[jake] jake closed");
    jakes[key].close(1000);
    delete jakes[key];
}

module.exports._all = async (ws, args, res) => {
    if (res) return res;
    const user = Object.keys(jakes).find(x => jakes[x] === ws);
    if (!user) return; return await send("jake", user, WASD.pack(...args));
}