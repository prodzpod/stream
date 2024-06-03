const { src } = require("../..")

module.exports.execute = () => {
    src().obs.unbrb();
    return [0, ""];
}