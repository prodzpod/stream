const { takeWord } = require('../../@main/util_client');
const { send, log, warn, error } = require('../include');
module.exports.condition = 'send'
module.exports.execute = async (_, message) => {
    send(takeWord(message, 4)[3]);
    return 0;
}