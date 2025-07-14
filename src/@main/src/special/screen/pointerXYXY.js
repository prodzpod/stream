const { src } = require("../..");
const { WASD } = require("../../common");
const { path } = require("../../commonServer");

module.exports.predicate = ["!fling", "!drag", "!draw"];
module.exports.permission = 0;
module.exports.execute = (_reply, from, chatter, message, text, emote, reply) => 
    src().genericXYXY.execute(_reply, from, chatter, message, WASD.pack(...WASD.unpack(text), chatter?.economy?.pointer), emote, reply)