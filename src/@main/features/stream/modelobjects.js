const { sync } = require("../../../model/include");
const { log } = require("../../include");

module.exports.condition = 'modelobjects'
module.exports.execute = async args => {
    sync(JSON.parse(args[1]), false);
    return 0;
}