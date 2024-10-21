const { src, send } = require("../..")

module.exports.execute = (v) => {
    send("fl", "send", 0, v);
    return [0, ""];
}