const { src } = require("../..");
const { WASD } = require("../../common");

module.exports.predicate = ["!fling", "!drag"];
module.exports.permission = 0;
module.exports.execute = (_reply, from, chatter, message, text, reply) => 
    src().genericXYXY.execute(_reply, from, chatter, message, WASD.pack(...WASD.unpack(text), chatter.economy.pointers[0] ?? "cursor"), reply)