const { getIdentifier, takeWord } = require('../../../@main/util_client');
const { data, getSocketsServer } = require('../../../@main/include');
const { log } = require('../../include');
let logs = {};
let sockets = {};
module.exports.sockets = () => sockets;
module.exports.allSockets = () => [...Object.values(sockets), ...Object.values(logs)];
module.exports.init = (ws, q, body) => {
    let id = getIdentifier();
    logs[id] = {ws: ws};
    return "auth " + id;
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
    sockets[user].ws.send(`points ${data().user[user]?.point ?? 0}`)
    delete logs[str];
    return true;
}
module.exports.point = (ws, str) => {
    let user = Object.values(sockets).find(x => x.ws == ws);
    if (!user) return "respond you are not logged in";
    [x, y] = takeWord(str, 2);
    getSocketsServer('model')?.send(`web 0 point ${x} ${y} ${user.color} ${user.user}`);
    return "respond it worked";
}
module.exports.click = (ws, str) => {
    let user = Object.values(sockets).find(x => x.ws == ws);
    if (!user) return "respond you are not logged in";
    [x, y] = takeWord(str, 2);
    getSocketsServer('model')?.send(`web 0 click ${x} ${y} ${user.color} ${user.user}`);
    return "respond it worked";
}
module.exports.fling = (ws, str) => {
    let user = Object.values(sockets).find(x => x.ws == ws);
    if (!user) return "respond you are not logged in";
    [x, y, x2, y2] = takeWord(str, 4);
    getSocketsServer('model')?.send(`web 0 drag ${x} ${y} ${x2} ${y2} ${user.color} ${user.user}`);
    return "respond it worked";
}
module.exports.spawn = (ws, str) => {
    let user = Object.values(sockets).find(x => x.ws == ws);
    if (!user) return "respond you are not logged in";
    [x, y, title, content] = takeWord(str, 4);
    getSocketsServer('model')?.send(`web 0 window ${x} ${y} ${title} ${content}`);
    return "respond it worked";
}