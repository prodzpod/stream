const { WASD } = require("../../common");
const { log, send } = require("../../ws");

let userWS = [];
module.exports._init = async (ws, query, body) => {
    log("[dex] WS initialized");
    userWS.push(ws);
    ws.onclose = () => userWS = userWS.filter(x => x !== ws);
}
module.exports._online = async (user, stream) => userWS.map(x => x.send(WASD.pack("online", user, stream)));
module.exports._offline = async (user) => userWS.map(x => x.send(WASD.pack("offline", user)));
module.exports.fetch = async (ws, args) => {
    log(args);
    return await send("channel", args?.[0]);
}