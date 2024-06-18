const { send } = require("../..");
const { log } = require("../../commonServer")

module.exports.execute = (txt) => {
    if (txt.startsWith("@") || txt.startsWith("[")) return [1, ""];
    send("gizmo", "speak", txt);
    return [0, ""];
}