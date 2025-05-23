const { send, src, data } = require("../..");
const { nullish } = require("../../common");
const { info, download, log } = require("../../commonServer");
const { args } = require("../chat/chat");

module.exports.predicate = ["!cease", "!ceasefire", "!peace", "!nonaggressionpact", "!johnlennon"];
module.exports.permission = 0;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    if (!src().screen.isScreenOn(_reply, chatter, message)) return [1, ""];
    let res = await send("gizmo", "peace", chatter.twitch.name)
    _reply(res[1]);
    return [0, chatter.twitch.name];
}