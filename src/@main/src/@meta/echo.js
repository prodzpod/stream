const { split } = require("../../common");

module.exports.predicate = "!echo";
module.exports.permission = true;
module.exports.execute = (_reply, from, chatter, message, text, emote, reply) => {
    let ret = split(text, /\s+/, 1)[1] ?? "";
    _reply(ret);
    return [0, ret];
}