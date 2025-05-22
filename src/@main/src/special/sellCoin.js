const { src, send, data } = require("../..");
const { random, numberish, WASD } = require("../../common");
const { args } = require("../chat/chat");
module.exports.predicate = ["!sell", "!selljesus", "!selljudas"];
module.exports.permission = 0;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    const judas = data().user[1028054302].special.value;
    const _a = args(text)[0]; let amount; const sellall = ["max", "all"].includes(String(_a).toLowerCase());
    if (!sellall && text.startsWith("!sell ") && judas > 0) { _reply("try again with !selljesus or !selljudas"); return [1, ""]; }
    if (text.startsWith("!selljudas") && judas <= 0) { _reply("this stock does not exist"); return [1, ""]; }
    let inventory = chatter.special ?? {};
    inventory.dollar ??= 10000; inventory.jesus ??= 0; inventory.judas ??= 0;
    const isSellingJudas = text.startsWith("!selljudas"); 
    if (sellall) amount = isSellingJudas ? inventory.judas : inventory.jesus;
    else if (typeof numberish(_a) === "number") amount = Math.max(_a ?? 1, 1);
    if (sellall && judas > 0 && text.startsWith("!sell ")) {
        inventory = sell(inventory, false, inventory.jesus, chatter);
        inventory = sell(inventory, true, inventory.judas, chatter);
        _reply(`sold all stocks!`);
    }
    else {
        inventory = sell(inventory, isSellingJudas, amount, chatter);
        _reply(`sold ${amount} $${isSellingJudas ? "JUDAS" : "JESUS"}!`);
    }
    data(`user.${chatter.twitch.id}.special`, inventory);
    send("gizmo", "playsound", "jesusislit/cash");
    return [0, ""];
}

function sell(inventory, isSellingJudas, amount=1, chatter) {
    const jesus = data().user[109830946].special.value;
    const judas = data().user[1028054302].special.value;
    const price = (isSellingJudas ? judas : jesus) * amount;
    if (inventory[isSellingJudas ? "judas" : "jesus"] < amount) amount = inventory[isSellingJudas ? "judas" : "jesus"];
    inventory.dollar += price; inventory[isSellingJudas ? "judas" : "jesus"] -= amount;
    send("web", "recentsold", chatter.twitch.id, isSellingJudas, amount, price);
    return inventory;
}