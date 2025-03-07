const { WASD } = require("../../common");
const { log, send } = require("../../ws");
let lalas = [];
module.exports._init = async (ws, query, body) => {
    log("[lala] lala connected");
    lalas.push(ws);
}

module.exports._send = async (...args) => {
    log("[lala] sending message: " + args);
    for (let k of lalas) k.send(...args);
}

module.exports._close = async (key) => {
    log("[lala] lala closed");
}