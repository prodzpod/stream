const { src, send, data } = require("../..");
const { WASD, array, randomHex, nullish, random, realtype, Math, time, formatDate, numberish } = require("../../common");
const { log, path, fetch, listFiles, info, download, debug } = require("../../commonServer");
const { args } = require("../chat/chat");

module.exports.predicate = "!test";
module.exports.permission = false;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    return [0, ""];
}