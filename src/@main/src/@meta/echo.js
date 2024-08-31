const { split } = require("../../common");

module.exports.predicate = "!echo";
module.exports.permission = true;
module.exports.execute = (_reply, from, chatter, message, text, emote, reply) => {
    _reply(split(text, " ", 1)[1] ?? "");
    return [0, ""];
}