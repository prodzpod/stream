const { send, src, data } = require("../..");
const { split, Math, nullish } = require("../../common");
const { log } = require("../../commonServer");
const { args } = require("../chat/chat");

module.exports.predicate = ["!shareicon"];
module.exports.permission = 0;  
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    let _args = args(text)
    let target = Object.values(data().user).find(x => x.twitch?.id == _args[0] || x.twitch?.login == _args[0].toLowerCase() || x.twitch?.name.toLowerCase() == _args[0].toLowerCase() || x.discord?.name?.toLowerCase() == _args[0]?.toLowerCase());
    if (!target?.twitch.id) { _reply("target is not a valid user"); return [1, ""]; }
    if (!src().user.cost(_reply, chatter, 2500)) return [0, ""];
    const ret = await src().icon.grantFromUser(chatter.twitch.id, target.twitch.id);
    _reply(`${target.twitch.name} was gifted: ${ret[0]} by ${chatter.twitch.name}! you can swap equipped icons via screen.`);
    send("web", "changeIcon", target.twitch.id, ret[0], ret[1]);
    return [0, ret];
}