const { src, send, data } = require("../..");
const { random, Math, numberish, WASD, realtype, nullish } = require("../../common");
const { args } = require("../chat/chat");
module.exports.predicate = "!scan";
module.exports.permission = 0;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    let _args = args(text);
    switch (_args[0]) {
        case "reset":
            return await src().CElink.sendce(_reply, `reset ${chatter.twitch.login} ${_args[1] ?? "int"}`);
        case "exact":
            return await src().CElink.sendce(_reply, `scanExact ${chatter.twitch.login} ${_args[1]}`);
        case "between":
            let v1 = numberish(_args[1]); if (realtype(v1) !== "number") break;
            let v2 = numberish(_args[2]); if (realtype(v2) !== "number") break;
            return await src().CElink.sendce(_reply, `scanBetween ${chatter.twitch.login} ${v1} ${v2}`);
        case "changed":
            return await src().CElink.sendce(_reply, `scanChanged ${chatter.twitch.login}`);
        case "unchanged":
            return await src().CElink.sendce(_reply, `scanUnchanged ${chatter.twitch.login}`);
        case "more":
            return await src().CElink.sendce(_reply, `scanIncreased ${chatter.twitch.login}`);
        case "less":
            return await src().CElink.sendce(_reply, `scanDecreased ${chatter.twitch.login}`);
        case "unknown":
            return await src().CElink.sendce(_reply, `scanUnknown ${chatter.twitch.login}`);
        default:
            break;
    }
    _reply("Usage: `!scan reset [int/float/string]` or `!scan [exact/between/changed/unchanged/more/less] <value1> <value2>`");
    return [1, ""];
}