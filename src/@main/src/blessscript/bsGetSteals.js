const { data } = require("../..");
const { split, WASD, unique, unentry } = require("../../common");
const { log, listFiles } = require("../../commonServer");
const { args } = require("../chat/chat");

module.exports.predicate = ["!getsteals", "!updatesteals"];
module.exports.permission = 0;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    let _args = args(text);
    return [0, unentry(Object.entries(data().hooks[_args[0]]?.[_args[1]]).filter(x => x[1]).map(x => [data().user[x[0]]?.twitch?.name ?? "Default", x[1]]))]; 
}
