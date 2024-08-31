const { src, send } = require("../..");
const { log } = require("../../commonServer");

module.exports.execute = async (data) => {
    send("gizmo", "clonktracker", data);
    return [0, ""];
}