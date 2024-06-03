const { WASD } = require("../../common");
const { log, send } = require("../../ws")
let loginWS = {};
let userWS = {};

module.exports._init = async (ws, query, body) => {
    log("[screen] WS initialized");
    const user = await send("init", query.hash);
    if (user) {
        if (user.id) userWS[user.id] = ws;
        else loginWS[user.login] = ws;
        return user;
    }
}
module.exports._login = async (k, chatter, hash) => {
    const ws = loginWS[k];
    userWS[chatter.id] = ws;
    delete loginWS[k];
    log("[screen] WS logged in:", chatter.name);
    ws.send(WASD.pack("login", chatter, hash));
}
module.exports._info = (chatter, msg, iserror=false) => {
    if (!userWS[chatter]) return 1; userWS[chatter].send(WASD.pack(iserror ? "error" : "info", msg)); return 0;
}
module.exports.chat = async (ws, args) => {
    const user = Object.keys(userWS).find(x => userWS[x] === ws);
    if (!user) return; await send("chat", user, args[0]); return true;
}
module.exports.fetch = async (ws, args) => {
    return await send("fetch", args[0]);
}
module.exports._all = async (ws, args, res) => {
    if (res) return res;
    const user = Object.keys(userWS).find(x => userWS[x] === ws);
    if (!user) return; return await send("chat", user, WASD.pack("!" + args[0], ...args.slice(1)));
}