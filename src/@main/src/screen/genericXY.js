const { send } = require("../..");
const { split, Math, nullish } = require("../../common");
const { log } = require("../../commonServer");
const { args } = require("../chat/chat");

module.exports.predicate = ["!spawn", "!window", "!spawnshimeji", "!moveshimeji"];
module.exports.permission = 0;  
module.exports.execute = (_reply, from, chatter, message, text, reply) => {
    const _cmd = split(text, " ", 1)[0].slice(1); const cmd = OVERRIDE[_cmd] ?? _cmd;
    const _args = args(text);
    const x = Math.clamp(Math.round(Number(_args[0])), 0, 1920), y = Math.clamp(Math.round(Number(_args[1])), 0, 1080);
    if (!nullish(x) || !nullish(y)) return [1, ""];
    log("Redeeming:", cmd, chatter.twitch.name, chatter.twitch.color, x, y, ..._args.slice(2));
    _reply("it worked");
    send("gizmo", cmd, chatter.twitch.name, chatter.twitch.color, x, y, ..._args.slice(2)); return [0, ""];
}

const OVERRIDE = {
    "spawn": "window",
}