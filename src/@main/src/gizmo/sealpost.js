const { send } = require("../..");
const { split, random } = require("../../common");
const { log } = require("../../commonServer");

module.exports.predicate = ["!seal", "!sealpost", "!flopabout", "!gifofasealfloppingabouthappily"];
module.exports.permission = true;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    if (!chatter) { _reply("you dont exist?"); return [1, ""]; }
    let name = chatter?.twitch?.name ?? Object.values(chatter).find(x => x?.name)?.name;
    let color = chatter?.twitch?.color ?? "";
    if (!name) { _reply("you dont exist?"); return [1, ""]; }
    let msg = random(SEALPOSTS);
    send("witsend", "send", name, color, msg[0]);
    _reply("posted!");
    return [0, msg[1]];
}

const SEALPOSTS = [
    ["[gif of a seal flopping about happily]", "https://i.imgur.com/wN1pgoc.gif"],
    ["[gif of a seal staring into the camera and then splashing everythwere]", "https://i.imgur.com/QwCjhJL.gif"],
]