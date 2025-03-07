const { src, send, data } = require("../..");
const { WASD, array, randomHex, nullish, random, realtype, Math, time, formatDate, numberish } = require("../../common");
const { log, path, fetch, listFiles, info, download, debug } = require("../../commonServer");
const { args } = require("../chat/chat");

module.exports.predicate = "!addprodemote";
module.exports.permission = false;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    let k = {};
    for (let word of args(text)) k[`:${word}:`] = `src/@main/data/emote/prod/_${word}_.png`;
    data(`emote.prod`, k);
    _reply("done!");
    return [0, ""];
}