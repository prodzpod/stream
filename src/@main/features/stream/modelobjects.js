const { sync } = require("../../../model/include");

module.exports.condition = 'modelobjects'
module.exports.execute = async args => {
    sync(JSON.parse(args[1]));
    return 0;
}