const { send, src, data } = require("../..");
const { split, Math, nullish } = require("../../common");
const { log } = require("../../commonServer");
const { args } = require("../chat/chat");

module.exports.predicate = ["!changepointer"];
module.exports.permission = 0;  
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    const _args = args(text);
    if (!chatter?.twitch?.id) return [1, "unknown chatter"];
    if (!chatter.economy.pointers[_args[1]].includes(_args[0]))
        return [1, "chatter does not have this pointer"];
    data(`user.${chatter.twitch.id}.economy.pointer.${_args[0]}`, _args[1]);
    send("web", "changePointer", chatter.twitch.id, chatter.economy.pointer);
    _reply("pointer changed");
    return [0, chatter.economy.pointer];
}