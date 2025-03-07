const { send } = require("../..");
module.exports.execute = async (subject) => {
    return [0, await send("gizmo", "fetch", subject)];
}