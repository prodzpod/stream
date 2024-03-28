const { send } = require('../include');
const { takeWord } = require('../../@main/util_client');
const { writeData } = require('../../@main/include');
module.exports.condition = '!login'
module.exports.permission = false
module.exports.execute = async (message, user, data) => {
    let [_, key] = takeWord(message);
    let id = require('../../discord/include').attemptLogin(key, user);
    if (!id) id = require('../../web/api_client/WS/screen').attemptLogin(key, user, data.color ?? '#000000');
    if (!id) {
        send("Invalid Login", user, data);
        return 1;
    }
    if (id !== true) writeData(`user.${user}.discord`, id);
    send("Login Successful!", user, data);
    return 0;
}