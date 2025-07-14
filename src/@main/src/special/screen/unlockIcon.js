const { send, src, data } = require("../..");
const { split, Math, nullish } = require("../../common");
const { log } = require("../../commonServer");
const { args } = require("../chat/chat");

module.exports.predicate = ["!unlockicon"];
module.exports.permission = 0;  
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    if (!src().user.cost(_reply, chatter, 4000)) return [0, ""];
    const ret = await src().icon.grantRandom(chatter.twitch.id);
    _reply(`UNLOCKED: ${ret[0]}! you can swap equipped icons via screen.`);
    send("web", "changeIcon", chatter.twitch.id, ret[0], ret[1]);
    return [0, ret];
}