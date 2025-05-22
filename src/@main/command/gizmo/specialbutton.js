const { src, send, data } = require("../..")

module.exports.execute = async (action, ...args) => {
    await src().jesus[action](...args);
    return [0, ""];
}