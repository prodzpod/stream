const { send, ID, log } = require('../include');
const { takeWord } = require('../../@main/util_client');
module.exports.condition = '!send'
module.exports.permission = false
module.exports.execute = async (message, user, data) => {
    let [_, to, msg] = takeWord(message, 3);
    require('../../@main/include').sendClient(ID, to, msg, t => { send(t, user, data); });
    return 0;
}