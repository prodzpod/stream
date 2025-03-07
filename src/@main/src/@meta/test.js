const { src, send, data } = require("../..");
const { WASD, array, randomHex, nullish, random, realtype, Math, time, formatDate, numberish } = require("../../common");
const { log, path, fetch, listFiles, info, download, debug } = require("../../commonServer");
const { args } = require("../chat/chat");

module.exports.predicate = "!test";
module.exports.permission = false;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    log((await fetch({})("GET", "https://pub.colonq.computer/~tyumici/analytics/"))[1]);
    return [0, ""];
}