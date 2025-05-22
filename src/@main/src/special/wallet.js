const { src, send, data } = require("../..");
const { random, Math, numberish, WASD } = require("../../common");
const { args } = require("../chat/chat");
module.exports.predicate = "!wallet";
module.exports.permission = 0;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    let inventory = chatter.special ?? {};
    inventory.dollar ??= 10000; inventory.jesus ??= 0; inventory.judas ??= 0;
    let data = [];
    if (inventory.dollar > 0) data.push(inventory.dollar + "$");
    if (inventory.jesus > 0) data.push(inventory.jesus + "x$JESUS");
    if (inventory.judas > 0) data.push(inventory.judas + "x$JUDAS");
    _reply(`Current Balance: ${data.join(", ")}`);
    return [0, data];
}