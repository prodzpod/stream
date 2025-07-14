const { send, data, src } = require("../..");
const { random, Math, unentry, nullish, WASD } = require("../../common");
const { log } = require("../../commonServer");

module.exports.execute = async (number) => {
    return [0, {ret: (process.env.OFFCARDS4_CODES.split(",").indexOf(String(number).toUpperCase()) + 1)}];
}