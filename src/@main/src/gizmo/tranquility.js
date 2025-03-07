const { send } = require("../..");
const { random } = require("../../common");
const { args } = require("../chat/chat");

module.exports.predicate = "!tranquility";
module.exports.permission = true;
module.exports.execute = async (_reply, from, chatter, message, text, emote, reply) => {
    let txt = "";
    if (random() < .5) txt += "o";
    if (random() < .33) txt += "u";
    else if (random() < .5) txt += "h";
    if (random() < .33) txt += "h";
    txt += "m";
    if (random() < .9) txt += "m";
    if (random() < .5) txt += "m";
    if (random() < .33) txt += "m";
    txt += "..";
    if (random() < .5) txt += ".";
    if (random() < .33) txt += ".";
    _reply(txt);
    return [0, txt];
}