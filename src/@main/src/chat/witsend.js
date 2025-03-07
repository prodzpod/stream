const { send } = require("../..");
const { split } = require("../../common");
const { log } = require("../../commonServer");

module.exports.predicate = ["!ws", "!wp", "!witsend", "!witpost", "!sendwitsend", "!postwitsend"];
module.exports.permission = true;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    if (!chatter) { _reply("you dont exist?"); return [1, ""]; }
    let name = chatter?.twitch?.name ?? Object.values(chatter).find(x => x?.name)?.name;
    let color = chatter?.twitch?.color ?? "";
    if (!name) { _reply("you dont exist?"); return [1, ""]; }
    let txt = split(text, " ", 1)[1];
    send("witsend", "send", name, color, txt);
    _reply("posted!");
    return [0, txt];
}