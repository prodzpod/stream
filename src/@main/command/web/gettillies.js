const { src, data, send } = require("../..");
const { nullish, time, numberish } = require("../../common");
module.exports.execute = async () => {
    return [0, await data().user[1070508385].special.tillies];
}