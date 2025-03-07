const { send, src } = require("../..");
const { split, Math, nullish } = require("../../common");
const { log } = require("../../commonServer");
const { args } = require("../chat/chat");

module.exports.predicate = ["!drawwindow", "!fan", "!antifan"];
module.exports.permission = 0;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    if (!src().screen.isScreenOn(_reply)) return [1, ""];
    const _cmd = split(text, /\s+/, 1)[0].slice(1); const cmd = OVERRIDE[_cmd] ?? _cmd;
    const _args = args(text);
    if (!COST[_cmd] || src().user.cost(_reply, chatter, COST[_cmd])) {
        const x1 = Math.clamp(Math.round(Number(_args[0])), 0, 1920), y1 = Math.clamp(Math.round(Number(_args[1])), 0, 1080);
        const x2 = Math.clamp(Math.round(Number(_args[2])), 0, 1920), y2 = Math.clamp(Math.round(Number(_args[3])), 0, 1080);
        if (!nullish(x1) || !nullish(y1) || !nullish(x2) || !nullish(y2)) return [1, ""];
        log("Redeeming:", cmd, chatter.twitch.name, chatter.twitch.color ?? "#ffffff", x1, y1, x2, y2, ..._args.slice(4));
        _reply("it worked");
        return [0, await send("gizmo", cmd, chatter.twitch.name, chatter.twitch.color ?? "#ffffff", x1, y1, x2, y2, ..._args.slice(4))];
    } else return [1, ""];
}

const OVERRIDE = {
    "drag": "fling",
}

const COST = {
    "drawwindow": 100,
}