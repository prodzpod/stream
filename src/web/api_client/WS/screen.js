const { getIdentifier, WASD, Math, delay, unentry } = require('../../../@main/util_client');
const { data, getSocketsServer, sendClient } = require('../../../@main/include');
const { log, error, ID } = require('../../include');
const { objects } = require('../../../model/include');
let logs = {};
let sockets = {};
module.exports._sockets = () => sockets;
module.exports._allSockets = () => [...Object.values(sockets), ...Object.values(logs)];
module.exports._init = async (ws, _, __) => {
    let id = getIdentifier();
    logs[id] = {ws: ws};
    return WASD.pack("auth", id, JSON.stringify(objects()));
}
module.exports._attemptLogin = async (str, user, color) => {
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
module.exports.sync = async (ws, args) => {
    return WASD.pack("sync", JSON.stringify(Object.keys(objects())));
}
module.exports.request = async (ws, args) => {
    try {
        let r = JSON.parse(args[0]);
        if (!Array.isArray(r)) {
            error(r, "is not array");
            return WASD.pack("respond", "what???");
        }
        let ret = {}, os = objects();
        for (let s of r) {
            if (!!os[s]) ret[s] = unentry(Object.entries(os[s]).filter(x => x[0] != "name"));
            else {
                log("Desync occured, resyncing instance");
                await delay(100);
                return WASD.pack("sync", JSON.stringify(Object.keys(objects())));
            }
        }
        return WASD.pack("update", JSON.stringify(ret));
    } catch (e) { error(e); return WASD.pack("respond", "what???"); };
}
const COMMANDS = ['point', 'click', 'fling', 'spawn', 'kill', 'pin'];
module.exports._all = async (ws, k, args) => {
    let user = Object.values(sockets).find(x => x.ws == ws);
    if (!user) return WASD.pack("respond", "you are not logged in");
    if (!COMMANDS.includes(k)) return false;
    let ret = await new Promise(resolve => sendClient('twitch', 'twitch', `${user.user}@color=${user.color ?? '#000000'}`, WASD.pack('!' + k, ...args, 'silent'), resolve));
    return WASD.pack("respond", ret);    
}