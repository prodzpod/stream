const { send, src } = require("../..");
const { split, random } = require("../../common");
const { log } = require("../../commonServer");
const { args } = require("../chat/chat");

module.exports.predicate = ["!levelup", "!lvup", "!lvlup", "!level", "!lvl", "!lv"];
module.exports.permission = 0;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    if (!src().screen.isScreenOn(_reply)) return [1, ""];
    let stat = args(text)?.[0]?.toLowerCase().trim();
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
        case "":
        case undefined:
            stat = random(["maxhp", "attack", "critchance"]);
            break;
        default:
            _reply("available stats are 'hp', 'attack' and 'crit'");
            return [0, ""];
    }
    let result = await send("gizmo", "levelup", chatter?.twitch?.name, stat);
    if (result[1]) {
        _reply(`Leveled up the guy's ${stat}`);
        return [0, stat];
    }
    else {
        _reply("you do not have a stat point, win a combat to gain stat points");
        return [1, ""];
    }
}