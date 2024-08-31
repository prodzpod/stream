const { WASD } = require("../../common");
const { log, send } = require("../../ws");
let pos = [0, 0];
let jake;
module.exports._init = async (ws, query, body) => {
    log("[jake] jake connected");
    pos = [0, 0];
    jake = ws;
    ws.send("jake");
}
module.exports._send = async (arg) => {
    jake?.send(JSON.stringify(arg));
}

module.exports.up = async (ws, args) => {
    pos[1] -= 1;
    ws.send(`position: ${pos[0]}, ${pos[1]}`);
    return [0, ""];
}

module.exports.down = async (ws, args) => {
    pos[1] += 1;
    ws.send(`position: ${pos[0]}, ${pos[1]}`);
    return [0, ""];
}