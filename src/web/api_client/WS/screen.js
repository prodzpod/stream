const { getIdentifier, WASD, Math } = require('../../../@main/util_client');
const { data, getSocketsServer } = require('../../../@main/include');
const { log, error } = require('../../include');
const { objects } = require('../../../model/include');
let logs = {};
let sockets = {};
module.exports.sockets = () => sockets;
module.exports.allSockets = () => [...Object.values(sockets), ...Object.values(logs)];
module.exports.init = (ws, _, __) => {
    let id = getIdentifier();
    logs[id] = {ws: ws};
    return WASD.pack("auth", id, JSON.stringify(objects()));
}
module.exports.attemptLogin = (str, user, color) => {
    if (!logs[str]) return false;
    if (user.startsWith("#")) user = user.slice(1);
    if (user.startsWith("#")) return false;
    sockets[user] = {
        user: user,
        ws: logs[str].ws,
        color: data().user[user]?.color ?? color ?? '#000000'
    };
    sockets[user].ws.send(WASD.pack('points', data().user[user]?.point ?? 0))
    delete logs[str];
    return true;
}
module.exports.sync = (ws, args) => {
    return WASD.pack("sync", JSON.stringify(Object.keys(objects())));
}
module.exports.request = (ws, args) => {
    try {
        let r = JSON.parse(args[0]);
        if (!Array.isArray(r)) {
            error(r, "is not array");
            return WASD.pack("respond", "what???");
        }
        let ret = {}, os = objects();
        for (let s of r) {
            if (!!os[s]) ret[s] = os[s];
            else {
                error(s, "is not in bobjects");
                return WASD.pack("respond", "what???");
            }
        }
        return WASD.pack("update", JSON.stringify(ret));
    } catch (e) { error(e); return WASD.pack("respond", "what???"); };
}
module.exports.point = (ws, args) => {
    let user = Object.values(sockets).find(x => x.ws == ws);
    if (!user) return WASD.pack("respond", "you are not logged in");
    args[0] = Math.clamp(Number(args[0]), 1, 1919);
    args[1] = Math.clamp(Number(args[1]), 1, 1079);
    if (Number.isNaN(args[0]) || Number.isNaN(args[1])) return WASD.pack("respond", "no");
    getSocketsServer('model')?.send(WASD.pack('web', 0, 'point', args[0], args[1], user.color, user.user));
    return WASD.pack("respond", "it worked");
}
module.exports.click = (ws, args) => {
    let user = Object.values(sockets).find(x => x.ws == ws);
    if (!user) return WASD.pack("respond", "you are not logged in");
    args[0] = Math.clamp(Number(args[0]), 1, 1919);
    args[1] = Math.clamp(Number(args[1]), 1, 1079);
    if (Number.isNaN(args[0]) || Number.isNaN(args[1])) return WASD.pack("respond", "no");
    getSocketsServer('model')?.send(WASD.pack('web', 0, 'click', args[0], args[1], user.color, user.user));
    return WASD.pack("respond", "it worked");
}
module.exports.fling = (ws, args) => {
    let user = Object.values(sockets).find(x => x.ws == ws);
    if (!user) return WASD.pack("respond", "you are not logged in");
    args[0] = Math.clamp(Number(args[0]), 1, 1919);
    args[1] = Math.clamp(Number(args[1]), 1, 1079);
    args[2] = Math.clamp(Number(args[2]), 1, 1919);
    args[3] = Math.clamp(Number(args[3]), 1, 1079);
    if (Number.isNaN(args[0]) || Number.isNaN(args[1]) || Number.isNaN(args[2]) || Number.isNaN(args[3])) return WASD.pack("respond", "no");
    getSocketsServer('model')?.send(WASD.pack('web', 0, 'drag', args[0], args[1], args[2], args[3], user.color, user.user));
    return WASD.pack("respond", "it worked");
}
module.exports.spawn = (ws, args) => {
    let user = Object.values(sockets).find(x => x.ws == ws);
    if (!user) return WASD.pack("respond", "you are not logged in");
    args[0] = Math.clamp(Number(args[0]), 1, 1919);
    args[1] = Math.clamp(Number(args[1]), 1, 1079);
    if (Number.isNaN(args[0]) || Number.isNaN(args[1])) return WASD.pack("respond", "no");
    getSocketsServer('model')?.send(WASD.pack('web', 0, 'window', args[0], args[1], args[2], args[3]));
    return WASD.pack("respond", "it worked");
}