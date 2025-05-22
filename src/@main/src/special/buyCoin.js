const { src, send, data } = require("../..");
const { random, Math, numberish, WASD } = require("../../common");
const { args } = require("../chat/chat");
module.exports.predicate = ["!buy", "!buyjesus", "!buyjudas"];
module.exports.permission = 0;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    const jesus = data().user[109830946].special.value;
    const judas = data().user[1028054302].special.value;
    if (text.startsWith("!buy ") && judas > 0) { _reply("try again with !buyjesus or !buyjudas"); return [1, ""]; }
    if (text.startsWith("!buyjudas") && judas <= 0) { _reply("this stock does not exist"); return [1, ""]; }
    const isBuyingJudas = text.startsWith("!buyjudas"); 
    let inventory = chatter.special ?? {};
    inventory.dollar ??= 10000; inventory.jesus ??= 0; inventory.judas ??= 0;
    const _a = args(text)[0]; let amount;
    if (["max", "all"].includes(String(_a).toLowerCase())) amount = Math.floor(inventory.dollar / (isBuyingJudas ? judas : jesus));
    else if (typeof numberish(_a) === "number") amount = Math.max(_a ?? 1, 1);
    else { _reply("usage: !buy [amount=number or \"all\"]"); return [1, ""]; }
    const price = (isBuyingJudas ? judas : jesus) * amount;
    if (inventory.dollar < price) { _reply(`you're too broke (needed: ${price}$, current: ${inventory.dollar}$)`); return [1, ""]; }
    inventory.dollar -= price; inventory[isBuyingJudas ? "judas" : "jesus"] += amount;
    data(`user.${chatter.twitch.id}.special`, inventory);
    _reply(`bought ${amount} $${isBuyingJudas ? "JUDAS" : "JESUS"}!`);
    send("web", "recentbought", chatter.twitch.id, isBuyingJudas, amount, price);
    send("gizmo", "playsound", "jesusislit/cash");
    return [0, ""];
}