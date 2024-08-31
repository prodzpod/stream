const { send } = require("../..");
const { split, Math, nullish } = require("../../common");
const { log } = require("../../commonServer");
const { args } = require("../chat/chat");

module.exports.predicate = ["!drawwindow"];
module.exports.permission = 0;
module.exports.execute = (_reply, from, chatter, message, text, emote, reply) => {
    const _cmd = split(text, " ", 1)[0].slice(1); const cmd = OVERRIDE[_cmd] ?? _cmd;
    const _args = args(text);
    const x1 = Math.clamp(Math.round(Number(_args[0])), 0, 1920), y1 = Math.clamp(Math.round(Number(_args[1])), 0, 1080);
    const x2 = Math.clamp(Math.round(Number(_args[2])), 0, 1920), y2 = Math.clamp(Math.round(Number(_args[3])), 0, 1080);
    if (!nullish(x1) || !nullish(y1) || !nullish(x2) || !nullish(y2)) return [1, ""];
    log("Redeeming:", cmd, chatter.twitch.name, chatter.twitch.color ?? "#ffffff", x1, y1, x2, y2, ..._args.slice(4));
    _reply("it worked");
    send("gizmo", cmd, chatter.twitch.name, chatter.twitch.color ?? "#ffffff", x1, y1, x2, y2, ..._args.slice(4)); return [0, ""];
}

const OVERRIDE = {
    "drag": "fling",
}