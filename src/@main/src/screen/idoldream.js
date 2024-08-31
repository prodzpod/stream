const { src } = require("../..");
const { nullish, Math, random, WASD } = require("../../common");
const { args } = require("../chat/chat");

module.exports.predicate = ["!furrowthemareofeidola"];
module.exports.permission = 0;  
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    text = await src().chat.emotesToGizmo(from, text, emote);
    const _args = args(text);
    let x = Math.clamp(Math.round(Number(_args[0])), 0, 1920), y = Math.clamp(Math.round(Number(_args[1])), 0, 1080);
    if (!nullish(x)) x = Math.floor(random(1, 1919)); if (!nullish(y)) y = Math.floor(random(1, 1079));
    _reply("furrowed the mare of eidola");
    return src().genericXY.execute(_reply, from, chatter, message, WASD.pack("!idoldream", x, y, _args[2] ?? `${chatter.twitch.name} is following their Idol Dream`, chatter.twitch.profile), emote, reply);
}