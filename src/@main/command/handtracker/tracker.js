const { send, src, data } = require("../..");
const { log } = require("../../commonServer");

module.exports.execute = (hand, wrist, palm) => {
    send("gizmo", "handtracker", hand, wrist[0], wrist[1], wrist[2], palm[0], palm[1], palm[2]);
    return [0, ""];
}