const { WASD } = require("../../common");
const { log, send } = require("../../ws");
const bcrypt = require("bcrypt");

let loginWS = {};
let prodWS = null;

module.exports._init = async (ws, query, body) => {
    log("[clip] WS initialized");
    let user = await send("init", query.hash, "clip");
    if (user && user.id && (!query.password || !await bcrypt.compare(user?.id + process.env.STREAM_WEB_SALT, query.password))) user = await send("init", null, "screen");
    if (user?.isProd) prodWS = ws;
    else loginWS[user.login] = ws;
    return user;
}
module.exports._linkProd = async (k, chatter, hash) => {
    prodWS = loginWS[k];
    delete loginWS[k];
    log("[clip] WS logged in");
    prodWS.send(WASD.pack("login", chatter, await bcrypt.hash(chatter.id + process.env.STREAM_WEB_SALT, 10), hash));
    return chatter;
}
module.exports._all = async (ws, args, res) => { 
    // i should just make an individual thing but like this is an admin page who cares
    if (res) return res;
    if (ws !== prodWS) return "no";
    return await send("chat", 140410053, WASD.pack("!" + args[0], ...args.slice(1)));
}