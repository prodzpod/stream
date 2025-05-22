const { WASD } = require("../../common");
const { log, send } = require("../../ws");
const bcrypt = require("bcrypt");
let loginWS = {};
let userWS = {};

module.exports._init = async (ws, query, body) => {
    log("[brain] WS initialized");
    let user = await send("init", query.hash, "brain");
    if (user && user.id && (!query.password || !await bcrypt.compare(user?.id + process.env.STREAM_WEB_SALT, query.password))) user = await send("init", null, "brain");
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
    log("[brain] WS logged in:", chatter.name);
    ws.send(WASD.pack("login", chatter, hash, await bcrypt.hash(chatter.id + process.env.STREAM_WEB_SALT, 10)));
}
module.exports._report = async (module, name, id, code, res, token, stack) => {
    if (userWS[id]) userWS[id].send(WASD.pack("report", module, name, id, code, res, token, stack));
}
module.exports._all = async (ws, args, res) => {
    if (res) return res;
    const user = Object.keys(userWS).find(x => userWS[x] === ws);
    if (!user) return; return await send("chat", user, WASD.pack("!" + args[0], ...args.slice(1)));
}