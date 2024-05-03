const { send, log } = require('../../include');
const { takeWord } = require('../../../@main/util_client');
const { writeData, data } = require('../../../@main/include');
module.exports.condition = '!login'
module.exports.permission = true
module.exports.execute = async (_, user, _data, message) => {
    _data.logged = true; // always send return;
    let [__, key] = takeWord(message);
    let id = require('../../../discord/include').attemptLogin(key, user);
    let type = id ? 'discord' : 'irc';
    if (!id) id = await require('../../../web/api_client/WS/screen')._attemptLogin(key, user, _data.color);
    if (!id) id = require('./loginirc').attemptLogin(key, user);
    if (!id) {
        send("Invalid Login", user, _data);
        return 1;
    }
    if (id !== true) writeData(`user.${user}.${type}`, id);
    send("Login Successful!", user, _data);
    return 0;
}