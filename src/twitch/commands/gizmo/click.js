const { getSocketsServer, streamInfo } = require('../../../@main/include');
const { Math, isNullOrWhitespace, WASD, rand } = require('../../../@main/util_client');
const { send, log, warn, error } = require('../../include');
module.exports.condition = '!click'
module.exports.permission = true
module.exports.execute = async (args, user, data) => {
    let msg = "it worked";
    args[1] = Math.clamp(Number(args[1]), 1, 1919);
    args[2] = Math.clamp(Number(args[2]), 1, 1079);
    if (Number.isNaN(args[1]) || Number.isNaN(args[2])) msg = "no";
    else {
        let txt = ['window', rand(1, 1919), rand(1, 1023)];
        if (Math.between(4, args[1], 182) && Math.between(1030, args[2], 1076) || Math.between(212, args[1], 476) && Math.between(1030, args[2], 1076)) {
            txt.push(`hi ${user}!`, 'im prodzpod, the most wired shimeji schuber out here.\nfind out more about me and this stream at\nhttps://prod.kr/v and\nhttps://prod.kr/v/lore !');
            send("https://prod.kr/v \nhttps://prod.kr/v/lore", user, {logged: true});
        }
        else if (Math.between(482, args[1], 746) && Math.between(1030, args[2], 1076)) {
            txt.push('the only shill', 'we have a discord fully connected with this twitch chat!\nim active there all the time, we hang out here\nhttps://prod.kr/discord');
            send("https://prod.kr/discord", user, {logged: true});
        }
        else if (Math.between(752, args[1], 1044) && Math.between(1030, args[2], 1076)) 
            txt.push('TEST STREAM', 'none of this is really done,\ncode is extremely messy,\nand the stream will most likely end in crashing. be aware!\n\nalso the on screen chat only supports ascii for now');
        else if (Math.between(1050, args[1], 1750) && Math.between(1030, args[2], 1076)) {
            let sub = streamInfo().subject;
            txt.push('!today', `today we're making [${sub}]!`);
        }
        else if (Math.between(1772, args[1], 1916) && Math.between(1030, args[2], 1076)) {
            let info = streamInfo();
            let time = new Date(new Date().getTime() - info.start);
            txt.push('!uptime', `We've been going for ${time.getUTCHours()}:${time.getUTCMinutes()}:${time.getUTCSeconds()}!\nCurrently we're in phase ${info.phase}.`);
        }
        else txt = ['click', args[1], args[2], data.color, user];
        getSocketsServer('model')?.send(WASD.pack('web', 0, ...txt));
    }
    if (isNullOrWhitespace(args[3])) send(msg, user, data);
    return msg;
}