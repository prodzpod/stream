const { send, data, src } = require("../..");
const { random, Math, unentry, nullish, WASD } = require("../../common");
const { log } = require("../../commonServer");

module.exports.execute = async (number) => {
    return [0, Object.values(data().user).find(x => x?.special?.offcards4 == process.env.OFFCARDS4_CODES.split(",")[number])];
}