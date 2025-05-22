const { src, send, data } = require("../..");
const { random } = require("../../common");
const { args } = require("../chat/chat");
module.exports.predicate = ["!bankrupt", "!bankruptsy", "!declarebankrupt", "!declarebankruptsy", "!chapter13"];
module.exports.permission = 0;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    let inventory = chatter.special ?? {};
    inventory.dollar ??= 10000; inventory.jesus ??= 0; inventory.judas ??= 0;
    if (inventory.jesus > 0 || inventory.judas > 0) { _reply(`you have liquid assets (${inventory.jesus}${inventory.jesus > 0 ? "x$JESUS" : ""}${inventory.jesus > 0 && inventory.judas > 0 ? ", " : ""}${inventory.judas}${inventory.judas > 0 ? "x$JUDAS" : ""}), use !sell all to liquidate your assets`); return [1, ""]; }
    if (inventory.dollar >= 10000) { _reply("you're too rich (over 10k dollars)"); return [1, ""]; }
    inventory.dollar = 10000; inventory.jesus = 0; inventory.judas = 0;
    data(`user.${chatter.twitch.id}.special`, inventory);
    _reply(`declared bankruptsy! you have 10000$ again`);
    return [0, ""];
}