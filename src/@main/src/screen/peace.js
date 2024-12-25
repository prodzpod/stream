const { send, src, data } = require("../..");
const { nullish } = require("../../common");
const { info, download, log } = require("../../commonServer");
const { args } = require("../chat/chat");

module.exports.predicate = ["!cease", "!ceasefire", "!peace", "!nonaggressionpact", "!johnlennon"];
module.exports.permission = 0;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    let res = await send("gizmo", "peace", chatter.twitch.name)
    _reply(res[1]);
    return [0, ""];
}