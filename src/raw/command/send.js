const { WASD } = require("../common");
const { log } = require("../ws");

module.exports.execute = (args) => {
    return [0, require("../index").start(...WASD.unpack(args))];
};