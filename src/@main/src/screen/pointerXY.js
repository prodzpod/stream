const { src } = require("../..");
const { WASD } = require("../../common");
const { path } = require("../../commonServer");

module.exports.predicate = ["!point", "!pin", "!close"];
module.exports.permission = 0;  
module.exports.execute = (_reply, from, chatter, message, text, reply) => 
    src().genericXY.execute(_reply, from, chatter, message, WASD.pack(...WASD.unpack(text), path("src/@main/data/pointer", chatter.economy.pointer?.point ?? "cursor")), reply)