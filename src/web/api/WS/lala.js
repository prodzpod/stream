const { WASD } = require("../../common");
const { log, send } = require("../../ws");
let lalas = [];
module.exports._init = async (ws, query, body) => {
    log("[lala] lala connected");
    ws.send(WASD.pack("water", ...(await send("getchunguswater"))));
    lalas.push(ws);
}

module.exports._send = async (...args) => {
    // log("[lala] sending message: ", args);
    for (let k of lalas) k.send(WASD.pack(...args));
}

module.exports._close = async (key) => {
    log("[lala] lala closed");
}