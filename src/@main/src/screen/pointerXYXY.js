const { src } = require("../..");
const { WASD } = require("../../common");
const { path } = require("../../commonServer");

module.exports.predicate = ["!fling", "!drag"];
module.exports.permission = 0;
module.exports.execute = (_reply, from, chatter, message, text, reply) => 
    src().genericXYXY.execute(_reply, from, chatter, message, WASD.pack(...WASD.unpack(text), path("src/@main/data/pointer", chatter.economy.pointer?.click ?? "cursor")), reply)