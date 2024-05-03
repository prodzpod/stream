const { getSocketsServer } = require('../../../@main/include');
const { Math, isNullOrWhitespace, WASD } = require('../../../@main/util_client');
const { send, log, warn, error } = require('../../include');
module.exports.condition = '!fling'
module.exports.permission = true
module.exports.execute = async (args, user, data) => {
    let msg = "it worked";
    args[1] = Math.clamp(Number(args[1]), 1, 1919);
    args[2] = Math.clamp(Number(args[2]), 1, 1079);
    args[3] = Math.clamp(Number(args[3]), 1, 1919);
    args[4] = Math.clamp(Number(args[4]), 1, 1079);
    if (Number.isNaN(args[1]) || Number.isNaN(args[2]) || Number.isNaN(args[3]) || Number.isNaN(args[4])) msg = "no";
    else getSocketsServer('model')?.send(WASD.pack('web', 0, 'drag', args[1], args[2], args[3], args[4], data.color, user));
    if (isNullOrWhitespace(args[5])) send(msg, user, data);
    return msg;
}