const { send, src, data } = require("../..");
const { split, Math, nullish } = require("../../common");
const { log } = require("../../commonServer");
const { args } = require("../chat/chat");

module.exports.predicate = ["!changeicon"];
module.exports.permission = 0;  
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    const _args = args(text);
    if (!chatter?.twitch?.id) return [1, "unknown chatter"];
    if (!Object.keys(chatter.economy.icons).includes(_args[0]))
        return [1, "chatter does not have this icon"];
    data(`user.${chatter.twitch.id}.economy.icon`, {
        icon: _args[0],
        alt: false,
        modifier: null
    });
    send("web", "changeIcon", chatter.twitch.id, chatter.economy.icon);
    _reply("icon changed");
    return [0, ""];
}