const { src } = require("../..");

module.exports.execute = async (cmd, sub, ...args) => {
    return await src()[cmd][sub](...args);
}