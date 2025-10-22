const { send, data } = require("../../..");
const { time } = require("../../../common");
module.exports.predicate = ["!startigt", "!resumeigt"];
module.exports.permission = false;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    let sp = data().user[140410053].special;
    let t = time();
    data(`user.140410053.special.igtstart`, sp.igt === 0 ? t : sp.igtstart + t - sp.igt);
    data(`user.140410053.special.igt`, 0);
    send("web", "ws", "timer", "reset");
    _reply("Timer Resumed!");
    return [0, ""];
}