const { src } = require("../..");

module.exports.execute = async (cmd, sub, ...args) => {
    return [0, await src()[cmd][sub](...args)];
}