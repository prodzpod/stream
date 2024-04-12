const { send, log, warn, error } = require('../include');
const { takeWord, WASD, Math, isNullOrWhitespace } = require('../../@main/util_client');
const { getSocketsServer } = require('../../@main/include');
module.exports.condition = '!removetriangle'
module.exports.permission = true
module.exports.execute = async (args, user, data) => {
    if (isNullOrWhitespace(args[1])) args[1] = 1;
    else args[1] = Math.clamp(Number(args[1]), 0, 9001);
    if (!args[1] || Number.isNaN(args[1])) {
        send("no", user, data);
        return 0;
    }
    getSocketsServer('model')?.send(WASD.pack('twitch', 0, 'removetriangle', args[1]));
    send("removed triangle", user, data);
    return 0;
}