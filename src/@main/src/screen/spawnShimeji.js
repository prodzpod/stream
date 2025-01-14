const { send, src } = require("../..");
const { split, Math, nullish, WASD, random } = require("../../common");
const { log } = require("../../commonServer");
const { args } = require("../chat/chat");

module.exports.predicate = ["!guy", "!littleguy", "!spawn", "!spawnshimeji", "!gal"];
module.exports.permission = 0;  
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    let _args = args(text);
    let x = _args[0] ?? random(0, 1920);
    let y = _args[1] ?? random(0, 1080);
    let ai = {};
    for (let c in chatter.shimeji.ai) {
        let v = chatter.shimeji.ai[c];
        if (typeof v !== "object") ai[c] = v;
        else ai[c] = v.value / v.max;
    }
    let name = chatter.twitch.name;
    if (chatter.shimeji.override) name = chatter.shimeji.override.replaceAll("$NAME$", chatter.twitch.name);
    return src().genericXY.execute(_reply, from, chatter, message, WASD.pack(...["!spawnshimeji", x, y, ai, name]), emote, reply);
}