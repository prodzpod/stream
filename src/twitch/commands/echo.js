const { send, log, warn, error } = require('../include');
const { takeWord } = require('../../@main/util_client');
module.exports.condition = '!echo'
module.exports.permission = true
module.exports.execute = async (message, user, data) => {
    let [_, msg] = takeWord(message);
    send(msg, user, data);
    return 0;
}