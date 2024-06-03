const { data } = require("../..");
const { Math } = require("../../common");
const { log, debug } = require("../../commonServer");

module.exports.execute = n => {
    debug("gcp2:", n);
    data("global.gcp2", Math.prec(n) * 100);
    return [0, ""];
}