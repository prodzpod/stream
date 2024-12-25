const { send, data } = require("../..");
const { unentry } = require("../../common");

module.exports.predicate = "!logout";
module.exports.permission = 0;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    data(`user.${chatter.twitch.id}`, unentry(Object.keys(chatter).filter(x => chatter[x].id && x !== "twitch").map(x => [x, ""])));
    _reply("logged out of everything");
    return [0, true];
}