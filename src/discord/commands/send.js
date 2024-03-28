const { takeWord, safeAssign } = require('../../@main/util_client');
const { send, log, warn, error } = require('../include');
module.exports.condition = 'send'
module.exports.execute = async str => {
    let [_, k] = takeWord(str);
    send(k);
    return 0;
}