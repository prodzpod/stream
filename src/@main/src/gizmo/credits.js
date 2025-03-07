const { send, src } = require("../..");
const { remove } = require("../../common");
const { log } = require("../../commonServer");
const { args } = require("../chat/chat");

module.exports.predicate = ["!credits"];
module.exports.permission = false;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    return [0, ""]; // no
    if (args(text)?.[0] == ".861287561875618756479" && chatter?.twitch?.name) {
        if (guys.includes(chatter.twitch.name)) return [0, false];
        guys.push(chatter.twitch.name);
        setTimeout(() => { guys = remove(guys, chatter.twitch.name); }, 10000);
        _reply(`Current List: ${guys.length} / 10`);
        if (guys.length >= 10) src().ending.ending();
    }
    return [0, true];
}

let guys = [];