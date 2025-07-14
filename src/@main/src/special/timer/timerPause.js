const { send, data } = require("../../..");
const { time } = require("../../../common");
module.exports.predicate = ["!pauserta", "!stoprta", "!pausetimer", "!stoptimer"];
module.exports.permission = false;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    let sp = data().user[140410053].special;
    let t = time();
    if (sp.rta === 0) data(`user.140410053.special.rta`, t);
    if (sp.igt === 0) data(`user.140410053.special.igt`, t);
    send("web", "timer", "reset");
    _reply("Timer Paused!");
    return [0, ""];
}