const { src } = require("../..");
const { args } = require("../chat/chat");

module.exports.predicate = "!src";
module.exports.permission = false;
module.exports.execute = async (_reply, from, chatter, message, text, reply) => {
    const _args = args(text);
    const ret = src()[_args[0]][_args[1] ?? "execute"](..._args.slice(2));
    _reply(ret);
    if (ret.length !== 2) return [0, ret];
    return ret;
}