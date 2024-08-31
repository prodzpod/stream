const { send, sendByName } = require("../app")

module.exports.execute = async (...args) => {
    if (args.length === 2) return [0, await send(...args)];
    if (args.length === 4) return [0, await sendByName(...args)];
    return [1, ""];
}