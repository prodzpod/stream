const { data, src } = require("../..");
const { split, WASD, unique } = require("../../common");
const { log, listFiles } = require("../../commonServer");
const { args } = require("../chat/chat");

module.exports.predicate = ["!savehook"];
module.exports.permission = 0;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    let _args = args(text);
    return await src().bsAddHook.execute(_reply, from, chatter, message, "!hook " + WASD.pack(..._args.slice(0, 2)) + " " + (_args[2] ?? ""), emote, reply);
}
