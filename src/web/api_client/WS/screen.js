const { getIdentifier } = require('../../../@main/util_client');
const { data } = require('../../../@main/include');
let logs = {};
let sockets = {};
module.exports.sockets = () => sockets;
module.exports.allSockets = () => [...Object.values(sockets), ...Object.values(logs)];
module.exports.init = (ws, q, body) => {
    let id = getIdentifier();
    logs[id] = ws;
    return "auth " + id;
}
module.exports.attemptLogin = (str, user, color = '#000000') => {
    if (!logs[str]) return false;
    sockets[user] = {
        user: user,
        ws: logs[str],
        color: color
    };
    sockets[user].ws.send(`points ${data().user[user].point ?? 0}`)
    delete logs[str];
    return true;
}