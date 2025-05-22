const { src, send } = require("../..")

module.exports.execute = (v) => {
    send("fl", "send", 3, v);
    return [0, ""];
}