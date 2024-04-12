const { send, log, warn, error } = require('../include');
const { takeWord } = require('../../@main/util_client');
module.exports.condition = '!echo'
module.exports.permission = true
module.exports.execute = async (_, user, data, message) => {
    let [__, msg] = takeWord(message);
    send(msg, user, data);
    return 0;
}