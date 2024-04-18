const { send, log } = require('../include');
const { takeWord } = require('../../@main/util_client');
const { writeData, data } = require('../../@main/include');
module.exports.condition = '!login'
module.exports.permission = true
module.exports.execute = async (_, user, _data, message) => {
    let [__, key] = takeWord(message);
    let id = require('../../discord/include').attemptLogin(key, user);
    if (!id) id = require('../../web/api_client/WS/screen').attemptLogin(key, user, _data.color);
    if (!id) {
        send("Invalid Login", user, _data);
        return 1;
    }
    if (id !== true) writeData(`user.${user}.discord`, id);
    send("Login Successful!", user, _data);
    return 0;
}