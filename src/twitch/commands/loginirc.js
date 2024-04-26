const { send, log } = require('../include');
const { takeWord, getIdentifier } = require('../../@main/util_client');
const { writeData, data } = require('../../@main/include');
const { addIRC } = require('../../discord/include');
module.exports.condition = '!loginirc'
module.exports.permission = true
let logins = {};
module.exports.attemptLogin = (key, user) => {
    let ret = logins[key];
    if (!ret || user.startsWith("#")) return false;
    delete logins[key];
    addIRC(user, ret);
    return ret;
}
module.exports.execute = async (_, user, _data, message) => {
    let id = getIdentifier();
    if (user.startsWith("#")) user = user.slice(1);
    logins[id] = user;
    _data.logged = true;
    send(`Send \`!login ${id}\` on the Twitch Chat to connect your account (if you get sniped do it again lol sry)`, user, _data);
    return 0;
}