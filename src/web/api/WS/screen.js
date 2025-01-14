const { WASD } = require("../../common");
const { log, send } = require("../../ws");
const bcrypt = require("bcrypt");
let loginWS = {};
let userWS = {};

module.exports._init = async (ws, query, body) => {
    log("[screen] WS initialized");
    let user = await send("init", query.hash, "screen");
    if (user && user.id && (!query.password || !await bcrypt.compare(user?.id + process.env.STREAM_WEB_SALT, query.password))) user = await send("init", null, "screen");
    if (user) {
        if (user.id) userWS[user.id] = ws;
        else loginWS[user.login] = ws;
        return user;
    }
}
module.exports._login = async (k, chatter, hash, streaming) => {
    const ws = loginWS[k];
    userWS[chatter.id] = ws;
    delete loginWS[k];
    log("[screen] WS logged in:", chatter.name);
    ws.send(WASD.pack("login", chatter, hash, await bcrypt.hash(chatter.id + process.env.STREAM_WEB_SALT, 10), streaming));
}
module.exports._info = (chatter, msg, iserror=false) => {
    if (!userWS[chatter]) return 1; userWS[chatter].send(WASD.pack(iserror ? "error" : "info", msg)); return 0;
}
module.exports._iu = (chatter, iu) => {
    if (!userWS[chatter]) return 1; userWS[chatter].send(WASD.pack("iu", iu)); return 0;
}
module.exports._changeIcon = (chatter, icon, data) => {
    if (!userWS[chatter]) return 1; userWS[chatter].send(WASD.pack("icon", icon, data)); return 0;
}
module.exports._sendAll = (...vars) => { for (let user of Object.values(userWS)) user.send(WASD.pack(...vars)); }
module.exports.chat = async (ws, args) => {
    const user = Object.keys(userWS).find(x => userWS[x] === ws);
    if (!user) return; await send("chat", user, args[0]); return true;
}
module.exports.fetch = async (ws, args) => {
    const user = Object.keys(userWS).find(x => userWS[x] === ws);
    return await send("fetch", args[0], user);
}
module.exports._all = async (ws, args, res) => {
    if (res) return res;
    const user = Object.keys(userWS).find(x => userWS[x] === ws);
    if (!user) return; return await send("chat", user, WASD.pack("!" + args[0], ...args.slice(1)));
}