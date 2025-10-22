const { log } = require("../ws");

module.exports.execute = async (to, ...args) => {
    return [0, (await (require("../api/WS/" + to))._send(...args)) ?? ""];
}