const { isNullOrWhitespace } = require('../../@main/util_client');
const { send, log, warn, error, reply } = require('../include');
module.exports.condition = 'send'
module.exports.execute = async args => {
    if (isNullOrWhitespace(args[2])) args[2] = null;
    if (isNullOrWhitespace(args[3])) args[3] = null;
    if (args[3]) return await reply(args[1], args[3], args[2]);
    else return await send(args[1], args[2]);
}