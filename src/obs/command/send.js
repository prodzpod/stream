const { send, sendByName } = require("../app")

module.exports.execute = (...args) => {
    if (args.length === 2) return [0, send(...args)];
    if (args.length === 4) return [0, sendByName(...args)];
    return [1, ""];
}