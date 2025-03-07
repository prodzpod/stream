const { src, send } = require("../..");

module.exports.execute = async (...args) => {
    src().jake.execute(() => {}, null, null, null, "!jakeout");
    return [0, ""];
}