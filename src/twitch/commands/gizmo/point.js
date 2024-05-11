const { getSocketsServer } = require('../../../@main/include');
const { Math, isNullOrWhitespace, WASD } = require('../../../@main/util_client');
const { send, log, warn, error } = require('../../include');
module.exports.condition = ['!point', '!click', '!kill', '!pin'];
module.exports.permission = true;
module.exports.execute = async (args, user, data) => {
    let msg = "it worked";
    args[1] = Math.clamp(Number(args[1]), 1, 1919);
    args[2] = Math.clamp(Number(args[2]), 1, 1079);
    if (Number.isNaN(args[1]) || Number.isNaN(args[2])) msg = "no";
    else getSocketsServer('model')?.send(WASD.pack('web', 0, args[0].slice(1), args[1], args[2], data.color, user));
    if (isNullOrWhitespace(args[3])) send(msg, user, data);
    return msg;
}