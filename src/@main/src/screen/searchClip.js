const { send, src } = require("../..");
const { realtype, numberish, time, formatDate } = require("../../common");
const { info, log } = require("../../commonServer");
const { args } = require("../chat/chat");

module.exports.predicate = "!searchclip";
module.exports.permission = false;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    const _args = args(text);
    let user = await send("twitch", "user", _args[0]);
    let q = {broadcaster_id: user.id}; _args[1] = numberish(_args[1]);
    if (realtype(_args[1])) q.started_at = formatDate(time() - time(_args[1]*60*60*24*1000), "YYYY-MM-DDThh:mm:ss%Z");
    return [0, await send("twitch", "remote", "GET", "clips", q)];
}