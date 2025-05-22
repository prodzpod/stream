const { src, send, data } = require("../..");
const { random, Math, numberish, WASD } = require("../../common");
const { log } = require("../../commonServer");
const { args } = require("../chat/chat");
module.exports.predicate = "!coin";
module.exports.permission = false;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    const _args = args(text);
    const target = Object.values(data().user).find(x => x?.twitch?.login === _args[0]);
    if (typeof numberish(_args[1]) !== "number") { _reply("??"); return [1, ""]; }
    if (_args[2] === undefined || _args[1] === _args[2]) {
        _reply("Reset " + target.twitch.name + "!");
        return module.exports.reset(target.twitch.id, _args[1]);
    }
    if (typeof numberish(_args[2]) !== "number") { _reply("??"); return [1, ""]; }
    _reply("Set fluctuations to " + target.twitch.name + "!");
    return module.exports.set(target.twitch.id, _args[1], _args[2]);
}
let event;
let current = {};

module.exports.set = (user, min, max) => {
    current[user] = [min, max];
    if (!event) event = setInterval(() => {
        let ret = {};
        for (const id in current) {
            let special = data().user[id].special ?? {};
            let from = special?.value ?? 0;
            let to = random(...current[id]);
            special.value = Math.prec((from + to) / 2, 2);
            ret[id] = special.value;
            data(`user.${id}.special`, special);
        }
        send("web", "priceupdate", WASD.pack(ret));
    }, 2000);
    return [0, current];
}

module.exports.reset = (user, value) => {
    const target = data().user[user];
    let special = target.special ?? {}; special.value = value ?? -1; special.lastValue = value ?? -1;
    data(`user.${user}.special`, special);
    delete current[user];
    if (!Object.keys(current).length && event) { clearInterval(event); event = null; } 
    return [0, current];
}