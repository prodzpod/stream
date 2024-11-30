const { src, send, data } = require("../..");
const { WASD, array, randomHex, nullish } = require("../../common");
const { log, path } = require("../../commonServer");
const { args } = require("../chat/chat");

module.exports.predicate = "!test";
module.exports.permission = false;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    return [0, ""];
}