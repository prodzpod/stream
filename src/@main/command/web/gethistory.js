const { src, data, send } = require("../..");
const { nullish, time, numberish } = require("../../common");
module.exports.execute = async () => {
    return [0, src().chat.history()];
}