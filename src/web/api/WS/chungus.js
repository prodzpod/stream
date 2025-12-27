const { WASD } = require("../../common");
const { log, send } = require("../../ws");
let sockets = {};
module.exports._init = async (ws, query, body) => {
    log("[chungus] chungus connected");
    const res = await (await fetch("https://id.twitch.tv/oauth2/validate", { headers: { Authorization: `OAuth ${query.token}` } })).json();
    if (res.user_id) {
        ws.send(JSON.stringify(["init", await send("getchungus", res.user_id)]));
        sockets[res.user_id] = ws;
    } else ws.send(JSON.stringify(["init", false]));
}

module.exports._close = async (key) => {
    log("[chungus] chungus closed");
}

module.exports._all = async (ws, args, res) => {
    if (res) return res;
    const user = Object.keys(sockets).find(x => sockets[x] === ws);
    if (!user) return; 
    let v = await send("chat", user, WASD.pack("!" + args[0], ...args.slice(1)));
    ws.send(JSON.stringify(["update", await send("getchungus", user)]));
    return v;
}