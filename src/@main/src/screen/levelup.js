const { send } = require("../..");
const { split, random } = require("../../common");
const { log } = require("../../commonServer");
const { args } = require("../chat/chat");

module.exports.predicate = ["!levelup", "!lvup", "!lvlup", "!level", "!lvl", "!lv"];
module.exports.permission = true;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    let stat = args(text)?.[0].toLowerCase().trim();
    switch (stat) {
        case "hp":
        case "maxhp":
        case "con":
        case "health":
        case "tank":
        case "constitution":
            stat = "maxhp";
            break;
        case "damage":
        case "strength":
        case "str":
        case "dmg":
        case "atk":
        case "force":
        case "might":
        case "attack":
        case "aggression":
            stat = "attack";
            break;
        case "accuracy":
        case "acc":
        case "crit":
        case "critical":
        case "critchance":
        case "criticalchance":
            stat = "critchance";
            break;
        default:
            stat = random(["maxhp", "attack", "critchance"]);
            break;
    }
    let result = await send("gizmo", "levelup", chatter?.twitch?.name, stat);
    if (result[1]) _reply(`Leveled up the guy's ${stat}`);
    else _reply("invalid levelup");
    return [0, ""];
}