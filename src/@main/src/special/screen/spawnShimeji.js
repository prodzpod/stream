const { send, src, data } = require("../..");
const { split, Math, nullish, WASD, random } = require("../../common");
const { log } = require("../../commonServer");
const { args } = require("../chat/chat");

module.exports.predicate = ["!guy", "!littleguy", "!spawn", "!spawnshimeji", "!gal", "!creature", "!creacher", "!creachre", "!chrechre", "!littlegal"];
module.exports.permission = 0;  
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    let _args = args(text);
    let x = random(0, 1920);
    let y = random(0, 1080);
    if (typeof _args[0] === "number" && typeof _args[1] === "number") [x, y] = _args;
    let target = chatter;
    if (typeof _args[0] === "string" && chatter?.meta?.permission?.streamer) 
        target = Object.values(data().user).find(x => x?.twitch?.login === _args[0].toLowerCase());
    let ai = {};
    for (let c in target.shimeji.ai) {
        let v = target.shimeji.ai[c];
        if (typeof v !== "object") ai[c] = v;
        else ai[c] = v.value / v.max;
    }
    let name = target.twitch.name;
    if (target.shimeji.override) name = target.shimeji.override.replaceAll("$NAME$", target.twitch.name);
    return src().genericXY.execute(_reply, from, target, message, WASD.pack(...["!spawnshimeji", x, y, ai, name]), emote, reply);
}