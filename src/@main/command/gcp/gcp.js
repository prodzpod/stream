const { data } = require("../..");
const { Math } = require("../../common");
const { log, debug } = require("../../commonServer");

module.exports.execute = n => {
    debug("gcp:", n);
    data("global.gcp", Math.prec(n) * 100);
    return [0, ""];
}