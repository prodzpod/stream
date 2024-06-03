const { src } = require("../..");
const { WASD } = require("../../common");

module.exports.predicate = ["!point", "!pin", "!close"];
module.exports.permission = 0;  
module.exports.execute = (_reply, from, chatter, message, text, reply) => 
    src().genericXY.execute(_reply, from, chatter, message, WASD.pack(...WASD.unpack(text), chatter.economy.pointers[0] ?? "cursor"), reply)