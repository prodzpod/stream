const { send } = require("../..");
const { split } = require("../../common");
const { log } = require("../../commonServer");

module.exports.predicate = ["!seal", "!sealpost", "!flopabout", "!gifofasealfloppingabouthappily"];
module.exports.permission = true;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    if (!chatter) { _reply("you dont exist?"); return [1, ""]; }
    let name = chatter?.twitch?.name ?? Object.values(chatter).find(x => x?.name)?.name;
    let color = chatter?.twitch?.color ?? "";
    if (!name) { _reply("you dont exist?"); return [1, ""]; }
    send("witsend", "send", name, color, "[gif of a seal flopping about happily]");
    _reply("posted!");
    return [0, "https://i.imgur.com/wN1pgoc.gif"];
}