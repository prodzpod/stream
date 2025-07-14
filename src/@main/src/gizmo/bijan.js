const { send, src } = require("../..");
const { remove } = require("../../common");
const { log } = require("../../commonServer");
const { args } = require("../chat/chat");

module.exports.predicate = ["!bijan"];
module.exports.permission = 0;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    return await src().tiktokgift.execute(_reply, from, chatter, message, `!gift bijan ` + args(text)[0], emote, reply);
}