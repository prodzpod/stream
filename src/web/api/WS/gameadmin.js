const { WASD } = require("../../common");
const { log, send } = require("../../ws");
const bcrypt = require("bcrypt");
let loginWS = {};
let userWS = {};
let userName = {}

module.exports._init = async (ws, query, body) => {
    log("[game] WS initialized");
    let user = await send("init", query.hash, "gameadmin");
    if (user && user.id && (!query.password || !await bcrypt.compare(user?.id + process.env.STREAM_WEB_SALT, query.password))) user = await send("init", null, "gameadmin");
    if (user) {
        if (user.id) { userWS[user.id] = ws; userName[user.name] = user.id; }
        else loginWS[user.login] = ws;
        return user;
    }
}
module.exports._login = async (k, chatter, hash, streaming) => {
    const ws = loginWS[k];
    userWS[chatter.id] = ws;
    userName[chatter.name] = chatter.id;
    delete loginWS[k];
    log("[game] WS logged in:", chatter.name);
    ws.send(WASD.pack("login", chatter, hash, await bcrypt.hash(chatter.id + process.env.STREAM_WEB_SALT, 10)));
}
module.exports._send = async (id, ...args) => {
    log("[game] sending message: " + args);
    userWS[userName[id]]?.send(WASD.pack(...args));
}
module.exports._all = async (ws, args, res) => {
    if (res) return res;
    const user = Object.keys(userWS).find(x => userWS[x] === ws);
    if (!user) return; return await send("chat", user, WASD.pack("!" + args[0], ...args.slice(1)));
}