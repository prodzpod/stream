const { send, ID, log } = require('../../include');
const { takeWord, WASD } = require('../../../@main/util_client');
module.exports.condition = '!send'
module.exports.permission = false
module.exports.execute = async (args, user, data, message) => {
    require('../../../@main/include').sendClient(ID, args[1], ...WASD.unpack(takeWord(message, 3)[2]), t => { send(t, user, data); });
    return 0;
}