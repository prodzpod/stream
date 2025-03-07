const { send } = require("../..");
const { Math } = require("../../common");
const { measureStart, measureEnd } = require("../../commonServer");
const { args } = require("../chat/chat");

module.exports.predicate = "!ping";
module.exports.permission = true;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    let mPing = measureStart();
    let m = args(text)[0] ?? from;
    let ping = await send(m, "ping");
    let dur = measureEnd(mPing);
    _reply(`${ping} (duration: ${Math.prec(dur)}ms)`);
    return [0, dur];
}