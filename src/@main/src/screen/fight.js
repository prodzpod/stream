const { send, src, data } = require("../..");
const { nullish } = require("../../common");
const { info, download, log } = require("../../commonServer");
const { args } = require("../chat/chat");

module.exports.predicate = ["!fight", "!zfight", "!combat", "!strife", "!violence", "!war", "!conflict", "!engageinadiscoursewith", "!attack", "!fisticuffs"];
module.exports.permission = 0;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    if (!src().screen.isScreenOn(_reply, chatter, message)) return [1, ""];
    const target = Object.values(data().user).find(x => {
        const t = args(text)[0];
        if (nullish(t) === null) return false;
        if (x === chatter) return false;
        return x.twitch?.id === t || x.twitch?.login === t?.toLowerCase() || x.twitch?.name?.toLowerCase() === t?.toLowerCase();
    });
    if (nullish(target) === null) { _reply("invalid target"); return [0, ""]; }
    let res = await send("gizmo", "fight", chatter.twitch.name, target.twitch.name);
    _reply(res[1]);
    return [0, res[1]];
}