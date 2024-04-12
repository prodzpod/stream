const { off } = require("../../../model/include");

module.exports.condition = 'modeloff'
module.exports.execute = async _ => {
    off();
    return 0;
}