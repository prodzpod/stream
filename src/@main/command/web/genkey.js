const { src } = require("../..");
const { log } = require("../../commonServer");
module.exports.execute = async (g) => {
    return [0, await src().generateKey.validate(g)];
}