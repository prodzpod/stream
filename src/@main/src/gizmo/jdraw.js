const { send, src } = require("../..");
const { remove } = require("../../common");
const { log } = require("../../commonServer");
const { args } = require("../chat/chat");

module.exports.predicate = "!jdraw";
module.exports.permission = true;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    send("web", "ws", "lala", "jdraw");
    return [0, ""];
}