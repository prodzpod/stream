const { send, src } = require("../..");
const { split, Math, nullish } = require("../../common");
const { log } = require("../../commonServer");
const { args } = require("../chat/chat");

module.exports.predicate = ["!spawn", "!window", "!moveshimeji", "!jump"];
module.exports.permission = 0;  
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    if (!src().screen.isScreenOn(_reply, chatter, message)) return [1, ""];
    const _cmd = split(text, /\s+/, 1)[0].slice(1); const cmd = OVERRIDE[_cmd] ?? _cmd;
    if (cmd === "window") text = await src().chat.emotesToGizmo(from, text, emote);
    const _args = args(text);
    if (!COST[cmd] || src().user.cost(_reply, chatter, COST[cmd])) {
        const x = Math.clamp(Math.round(Number(_args[0])), 0, 1920), y = Math.clamp(Math.round(Number(_args[1])), 0, 1080);
        if (!nullish(x) || !nullish(y)) return [1, ""];
        log("Redeeming:", cmd, chatter.twitch.name, chatter.twitch.color ?? "#ffffff", x, y, ..._args.slice(2));
        _reply("it worked"); 
        return [0, await send("gizmo", cmd, chatter.twitch.name, chatter.twitch.color ?? "#ffffff", x, y, ..._args.slice(2))];
    } else return [1, ""];
}

const OVERRIDE = {
    "spawn": "window",
}

const COST = {
    "window": 10,
    "idoldream": 10,
}