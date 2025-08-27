const { send, src } = require("../..");
const { realtype, numberish, time, formatDate } = require("../../common");
const { info, log } = require("../../commonServer");
const { args } = require("../chat/chat");

module.exports.predicate = "!searchclip";
module.exports.permission = false;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    const _args = args(text);
    // log(text, _args);
    let user = await send("twitch", "user", _args[0]);
    if (!user) { _reply("user not found"); return [1, "user not found"]; }
    let q = {broadcaster_id: user.id}; if (_args[1]) _args[1] = numberish(_args[1]);
    if (realtype(_args[1]) === "number") _args[1] = BigInt(_args[1]);
    if (realtype(_args[1]) === "bigint") q.started_at = formatDate(time() - time(_args[1]*60n*60n*24n*1000n), "YYYY-MM-DDThh:mm:ss%Z");
    let res = await send("twitch", "remote", "GET", "clips", q);
    _reply(res);
    return [0, res];
}