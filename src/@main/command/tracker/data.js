const { send } = require("../..");
const { info, verbose } = require("../../commonServer");

module.exports.execute = async (o) => {
    // verbose("tracker:", Buffer.from(o, "base64"));
    send("gizmo", "tracker", o);
    return [0, ""];
}