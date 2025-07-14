const { send, data, src } = require("../..");
const { random, Math, unentry, nullish, WASD } = require("../../common");
const { log } = require("../../commonServer");

module.exports.execute = async (message) => {
    log("Cheatengine Result:", message);
    src().CElink.resolve(message);
    return [0, ""];
}