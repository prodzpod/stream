const { src } = require("../..");
const { info } = require("../../commonServer");

module.exports.predicate = "!unbrb";
module.exports.permission = false;
module.exports.execute = (_reply, from, chatter, message, text, reply) => {
    info("Toggling BRB");
    src().obs.unbrb();
    return [0, ""];
}