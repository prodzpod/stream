const { send, data } = require("../../..");
const { time } = require("../../../common");
module.exports.predicate = ["!resetrta", "!resetigt", "!resettimer"];
module.exports.permission = false;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    for (let cat of ["igt", "rta", "igtstart", "rtastart"])
        data(`user.140410053.special.` + cat, 0);
    send("web", "ws", "timer", "reset");
    _reply("Timer Reset!");
    return [0, ""];
}