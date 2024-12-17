const { src, send } = require("../..")

module.exports.execute = (v) => {
    send("twitch", "send", null, "[🌙] " + v, []);
    return [0, ""];
}