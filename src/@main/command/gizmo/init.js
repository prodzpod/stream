const { send, src, data } = require("../..")

module.exports.execute = () => {
    send("gizmo", "info", data().stream.subject, data().stream.phase, data().stream.category);
    return [0, ""];
}